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
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.background } }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="accounts/index" options={{ headerShown: true, title: 'Contas' }} />
      <Stack.Screen name="accounts/[id]" options={{ headerShown: true, title: 'Detalhe da conta' }} />
      <Stack.Screen name="cards/index" options={{ headerShown: true, title: 'Cartões' }} />
      <Stack.Screen name="cards/[id]" options={{ headerShown: true, title: 'Detalhe do cartão' }} />
      <Stack.Screen name="investments/index" options={{ headerShown: true, title: 'Investimentos' }} />
      <Stack.Screen name="investments/summary" options={{ headerShown: true, title: 'Resumo' }} />
      <Stack.Screen name="connections/connect" options={{ headerShown: true, title: 'Conectar banco', presentation: 'modal' }} />
      <Stack.Screen name="connections/[id]" options={{ headerShown: true, title: 'Conexão' }} />
      <Stack.Screen name="settings/index" options={{ headerShown: true, title: 'Configurações' }} />
      <Stack.Screen name="privacy/index" options={{ headerShown: true, title: 'Privacidade' }} />
      <Stack.Screen name="privacy/consents" options={{ headerShown: true, title: 'Consentimentos' }} />
      <Stack.Screen name="privacy/export" options={{ headerShown: true, title: 'Exportar dados' }} />
      <Stack.Screen name="privacy/delete" options={{ headerShown: true, title: 'Excluir conta' }} />
    </Stack>
  );
}
