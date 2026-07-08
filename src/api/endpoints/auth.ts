import { apiRequest } from '../client';
import type { AuthResponse } from '@/types/api';

export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<AuthResponse>('POST', '/auth/login', { email, password }),

  register: (email: string, password: string) =>
    apiRequest<AuthResponse>('POST', '/auth/register', { email, password }),

  refresh: (refreshToken: string) =>
    apiRequest<{ accessToken: string; refreshToken: string; expiresIn?: number }>(
      'POST',
      '/auth/refresh',
      { refreshToken },
    ),

  logout: async (refreshToken: string) => {
    await apiRequest<void>('POST', '/auth/logout', { refreshToken });
  },
};
