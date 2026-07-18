import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/components/AppShell';
import { DetailSkeleton } from '@/components/patterns/Skeleton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useAccount } from '@/features/accounts/useAccounts';
import { ACCOUNT_TYPE_LABELS } from '@/types/labels';
import { useAppTheme } from '@/theme/ThemeProvider';
import type { Theme } from '@/theme/tokens';
import { formatCurrency, formatDateTime } from '@/utils/format';

export default function AccountDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const { data, isLoading, isError, refetch } = useAccount(id);

  return (
    <AppShell showNav={false}>
      <ScreenHeader title="Detalhe da conta" />

      {isLoading && !data ? (
        <DetailSkeleton />
      ) : isError || !data ? (
        <View style={styles.centered}>
          <Text style={styles.empty}>Não foi possível carregar a conta.</Text>
          <Pressable onPress={() => refetch()} style={styles.retryButton}>
            <Text style={styles.retryText}>Tentar de novo</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.main}>
          <View style={styles.card}>
            <Text style={styles.name}>{data.name}</Text>
            <Text style={styles.caption}>{ACCOUNT_TYPE_LABELS[data.type]}</Text>
            <Text style={styles.balance}>{formatCurrency(data.balance, data.currency)}</Text>
            <Text style={styles.caption}>
              Disponível: {formatCurrency(data.availableBalance, data.currency)}
            </Text>
            <Text style={styles.caption}>Atualizado: {formatDateTime(data.lastUpdatedAt)}</Text>
          </View>
          <Pressable
            style={styles.primaryButton}
            onPress={() =>
              router.push({
                pathname: '/(app)/(tabs)/transactions',
                params: { accountId: data.id },
              } as never)
            }>
            <Text style={styles.primaryButtonText}>Ver transações</Text>
          </Pressable>
        </View>
      )}
    </AppShell>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    centered: { paddingVertical: 64, alignItems: 'center', gap: 12 },
    empty: { fontSize: 14, color: theme.colors.textMuted, textAlign: 'center' },
    retryButton: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: theme.colors.primary,
    },
    retryText: { color: '#fff', fontWeight: '600', fontSize: 13 },
    main: { paddingHorizontal: 24, gap: 16 },
    card: {
      gap: 8,
      borderRadius: 24,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 24,
    },
    name: { fontSize: 20, fontWeight: '700', color: theme.colors.text },
    caption: { fontSize: 13, color: theme.colors.textMuted },
    balance: {
      marginTop: 8,
      fontSize: 28,
      fontWeight: '700',
      letterSpacing: -0.4,
      color: theme.colors.text,
    },
    primaryButton: {
      borderRadius: 16,
      backgroundColor: theme.colors.primary,
      paddingVertical: 14,
      alignItems: 'center',
    },
    primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  });
