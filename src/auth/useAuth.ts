import { useCallback } from 'react';
import { router } from 'expo-router';

import { authApi } from '@/api/endpoints/auth';
import { queryClient } from '@/api/queryClient';
import { useAuthStore } from '@/auth/authStore';
import { clearTokens, getRefreshToken, hasStoredTokens, saveTokens } from '@/auth/tokenStorage';
import { clearUser, getUser, saveUser } from '@/auth/userStorage';
import { getApiErrorMessage } from '@/utils/helpers';

export function useAuth() {
  const { isAuthenticated, isBootstrapping, user, setAuthenticated, clearAuth } = useAuthStore();

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      await saveTokens(response.accessToken, response.refreshToken, response.expiresIn ?? 900);
      await saveUser(response.user);
      setAuthenticated(response.user);
      router.replace('/(app)/(tabs)');
      return { success: true as const };
    } catch (error) {
      return { success: false as const, message: getApiErrorMessage(error, 'Credenciais inválidas') };
    }
  }, [setAuthenticated]);

  const register = useCallback(async (email: string, password: string) => {
    try {
      const response = await authApi.register(email, password);
      await saveTokens(response.accessToken, response.refreshToken, response.expiresIn ?? 900);
      await saveUser(response.user);
      setAuthenticated(response.user);
      router.replace('/(app)/(tabs)');
      return { success: true as const };
    } catch (error) {
      return { success: false as const, message: getApiErrorMessage(error) };
    }
  }, [setAuthenticated]);

  const logout = useCallback(async () => {
    const refreshToken = await getRefreshToken();
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken);
      } catch {
        // ignore logout errors
      }
    }
    await clearTokens();
    await clearUser();
    clearAuth();
    queryClient.clear();
    router.replace('/(auth)/login');
  }, [clearAuth]);

  const bootstrap = useCallback(async () => {
    useAuthStore.getState().setBootstrapping(true);
    const hasTokens = await hasStoredTokens();
    if (!hasTokens) {
      useAuthStore.getState().setBootstrapping(false);
      router.replace('/(auth)/login');
      return;
    }

    try {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token');
      const response = await authApi.refresh(refreshToken);
      await saveTokens(response.accessToken, response.refreshToken ?? refreshToken, response.expiresIn ?? 900);
      const user = (await getUser()) ?? { id: 'user', email: 'user@fine-ai.com' };
      setAuthenticated(user);
      router.replace('/(app)/(tabs)');
    } catch {
      await clearTokens();
      useAuthStore.getState().setBootstrapping(false);
      router.replace('/(auth)/login');
    }
  }, [setAuthenticated]);

  return { isAuthenticated, isBootstrapping, user, login, register, logout, bootstrap };
}
