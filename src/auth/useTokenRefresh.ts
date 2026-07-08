import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

import { getRefreshToken, getTokenExpiry, saveTokens } from '@/auth/tokenStorage';
import { authApi } from '@/api/endpoints/auth';

const REFRESH_BEFORE_MS = 60 * 1000;

export function useTokenRefresh() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function scheduleRefresh() {
      const expiry = await getTokenExpiry();
      if (!expiry) return;

      const msUntilRefresh = expiry - Date.now() - REFRESH_BEFORE_MS;
      if (msUntilRefresh <= 0) {
        await doRefresh();
        return;
      }

      timerRef.current = setTimeout(doRefresh, msUntilRefresh);
    }

    async function doRefresh() {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) return;
      try {
        const response = await authApi.refresh(refreshToken);
        await saveTokens(
          response.accessToken,
          response.refreshToken ?? refreshToken,
          response.expiresIn ?? 900,
        );
      } catch {
        // interceptor handles logout on 401
      }
      scheduleRefresh();
    }

    scheduleRefresh();

    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') scheduleRefresh();
    });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      sub.remove();
    };
  }, []);
}
