import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/components/AppShell';
import { ListSkeleton } from '@/components/patterns/Skeleton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useAccounts } from '@/features/accounts/useAccounts';
import { ACCOUNT_TYPE_LABELS } from '@/types/labels';
import { useAppTheme } from '@/theme/ThemeProvider';
import type { Theme } from '@/theme/tokens';
import { formatCurrency } from '@/utils/format';

export default function AccountsScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const { data, isLoading, isError, refetch, isRefetching } = useAccounts();
  const accounts = data ?? [];
  const total = accounts.reduce((s, a) => s + a.balance, 0);

  return (
    <AppShell>
      <ScreenHeader title="Contas" large />

      {isLoading && !data ? (
        <ListSkeleton rows={4} />
      ) : isError ? (
        <View style={styles.centered}>
          <Text style={styles.empty}>Erro ao carregar contas.</Text>
          <Pressable onPress={() => refetch()} style={styles.retryButton}>
            <Text style={styles.retryText}>{isRefetching ? 'Carregando…' : 'Tentar de novo'}</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.main}>
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Total em contas</Text>
            <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
          </View>

          {accounts.length === 0 ? (
            <Text style={styles.empty}>
              Nenhuma conta. Conecte um banco via Pluggy para sincronizar.
            </Text>
          ) : (
            <View style={{ gap: 8 }}>
              {accounts.map((a) => (
                <Pressable
                  key={a.id}
                  onPress={() => router.push(`/(app)/accounts/${a.id}` as never)}
                  style={styles.accountRow}>
                  <View>
                    <Text style={styles.accountBank}>{a.institution.name}</Text>
                    <Text style={styles.accountType}>
                      {a.name} · {ACCOUNT_TYPE_LABELS[a.type]}
                    </Text>
                  </View>
                  <Text style={styles.accountBalance}>{formatCurrency(a.balance, a.currency)}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      )}
    </AppShell>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    main: { paddingHorizontal: 24, gap: 16 },
    centered: { paddingVertical: 64, alignItems: 'center', gap: 12 },
    empty: {
      paddingVertical: 32,
      textAlign: 'center',
      fontSize: 14,
      color: theme.colors.textMuted,
    },
    retryButton: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: theme.colors.primary,
    },
    retryText: { color: '#fff', fontWeight: '600', fontSize: 13 },
    totalCard: {
      borderRadius: 24,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 24,
    },
    totalLabel: {
      fontSize: 10,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 1.2,
      color: theme.colors.textMuted,
    },
    totalValue: {
      marginTop: 4,
      fontSize: 30,
      fontWeight: '700',
      letterSpacing: -0.5,
      color: theme.colors.text,
    },
    accountRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 16,
    },
    accountBank: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
    accountType: { marginTop: 2, fontSize: 11, color: theme.colors.textMuted },
    accountBalance: {
      fontSize: 14,
      fontWeight: '700',
      fontVariant: ['tabular-nums'],
      color: theme.colors.text,
    },
  });
