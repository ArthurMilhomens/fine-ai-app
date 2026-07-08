import Constants from 'expo-constants';

export const API_BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl ??
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  'https://api.fine-ai.com/v1';

export const PLUGGY_INCLUDE_SANDBOX =
  Constants.expoConfig?.extra?.pluggyIncludeSandbox === true ||
  process.env.EXPO_PUBLIC_PLUGGY_INCLUDE_SANDBOX === 'true';
