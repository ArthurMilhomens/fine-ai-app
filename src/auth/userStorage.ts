import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = 'fine-ai-user';

export async function saveUser(user: { id: string; email: string }): Promise<void> {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function getUser(): Promise<{ id: string; email: string } | null> {
  const raw = await AsyncStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function clearUser(): Promise<void> {
  await AsyncStorage.removeItem(USER_KEY);
}
