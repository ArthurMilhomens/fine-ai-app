import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'fine-ai-access-token';
const REFRESH_TOKEN_KEY = 'fine-ai-refresh-token';
const TOKEN_EXPIRY_KEY = 'fine-ai-token-expiry';

async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return AsyncStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function removeItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    await AsyncStorage.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

export async function getAccessToken(): Promise<string | null> {
  return getItem(ACCESS_TOKEN_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return getItem(REFRESH_TOKEN_KEY);
}

export async function getTokenExpiry(): Promise<number | null> {
  const value = await getItem(TOKEN_EXPIRY_KEY);
  return value ? parseInt(value, 10) : null;
}

export async function saveTokens(
  accessToken: string,
  refreshToken: string,
  expiresInSeconds = 900,
): Promise<void> {
  const expiry = Date.now() + expiresInSeconds * 1000;
  await setItem(ACCESS_TOKEN_KEY, accessToken);
  await setItem(REFRESH_TOKEN_KEY, refreshToken);
  await setItem(TOKEN_EXPIRY_KEY, String(expiry));
}

export async function clearTokens(): Promise<void> {
  await removeItem(ACCESS_TOKEN_KEY);
  await removeItem(REFRESH_TOKEN_KEY);
  await removeItem(TOKEN_EXPIRY_KEY);
}

export async function hasStoredTokens(): Promise<boolean> {
  const refresh = await getRefreshToken();
  return !!refresh;
}
