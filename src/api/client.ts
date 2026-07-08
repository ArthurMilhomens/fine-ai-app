import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

import { API_BASE_URL } from './config';
import { isMockMode, mockRequest } from './mocks';
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from '@/auth/tokenStorage';
import { useAuthStore } from '@/auth/authStore';

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = isMockMode()
      ? await mockRequest<{ accessToken: string; refreshToken: string; expiresIn?: number }>(
          'POST',
          '/auth/refresh',
          { refreshToken },
        )
      : (
          await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken })
        ).data;

    await saveTokens(
      response.accessToken,
      response.refreshToken ?? refreshToken,
      response.expiresIn ?? 900,
    );
    return response.accessToken;
  } catch {
    await clearTokens();
    useAuthStore.getState().clearAuth();
    return null;
  }
}

export async function getValidAccessToken(): Promise<string | null> {
  const token = await getAccessToken();
  if (token) return token;

  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const isAuthRoute =
    config.url?.includes('/auth/login') ||
    config.url?.includes('/auth/register') ||
    config.url?.includes('/auth/refresh');

  if (!isAuthRoute) {
    const token = await getValidAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/')
    ) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      }
    }
    const apiError = error.response?.data ?? {
      error: 'UNKNOWN',
      message: error.message ?? 'Erro de rede',
    };
    return Promise.reject(apiError);
  },
);

export async function apiRequest<T>(
  method: 'GET' | 'POST' | 'DELETE',
  path: string,
  data?: unknown,
  params?: Record<string, string | undefined>,
): Promise<T> {
  if (isMockMode()) {
    return mockRequest<T>(method, path, data, params);
  }

  const response = await axiosInstance.request<T>({
    method,
    url: path,
    data,
    params,
  });
  return response.data;
}

export { axiosInstance };
