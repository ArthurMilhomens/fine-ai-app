import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'fine-ai-access-token';
const REFRESH_TOKEN_KEY = 'fine-ai-refresh-token';
const TOKEN_EXPIRY_KEY = 'fine-ai-token-expiry';

export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export async function getTokenExpiry(): Promise<number | null> {
  const value = await SecureStore.getItemAsync(TOKEN_EXPIRY_KEY);
  return value ? parseInt(value, 10) : null;
}

export async function saveTokens(
  accessToken: string,
  refreshToken: string,
  expiresInSeconds = 900,
): Promise<void> {
  const expiry = Date.now() + expiresInSeconds * 1000;
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
  await SecureStore.setItemAsync(TOKEN_EXPIRY_KEY, String(expiry));
}

export async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  await SecureStore.deleteItemAsync(TOKEN_EXPIRY_KEY);
}

export async function hasStoredTokens(): Promise<boolean> {
  const refresh = await getRefreshToken();
  return !!refresh;
}
