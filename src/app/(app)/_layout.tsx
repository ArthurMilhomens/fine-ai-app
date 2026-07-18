import { Redirect, Stack } from 'expo-router';

import { useAuthStore } from '@/auth/authStore';
import { useAppTheme } from '@/theme/ThemeProvider';

export default function AppLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { theme } = useAppTheme();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="accounts/index" />
      <Stack.Screen name="accounts/[id]" />
      <Stack.Screen name="cards/index" />
      <Stack.Screen name="cards/[id]" />
      <Stack.Screen name="investments/index" />
      <Stack.Screen name="investments/summary" />
      <Stack.Screen name="connections/connect" />
      <Stack.Screen name="connections/[id]" />
      <Stack.Screen name="settings/index" />
      <Stack.Screen name="privacy/index" />
      <Stack.Screen name="privacy/consents" />
      <Stack.Screen name="privacy/export" />
      <Stack.Screen name="privacy/delete" />
    </Stack>
  );
}
