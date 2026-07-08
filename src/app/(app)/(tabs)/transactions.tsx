import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/ui/AppIcon';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { ScreenLayout } from '@/components/ui/ScreenLayout';
import { Skeleton } from '@/components/ui/Skeleton';
import { ThemedText } from '@/components/ui/ThemedText';
import { useTransactions } from '@/features/transactions/useTransactions';
import type { TransactionDirection } from '@/types/api';
import { useAppTheme } from '@/theme/ThemeProvider';
import { accent, radius, spacing } from '@/theme/tokens';
import { formatCurrency, formatDate } from '@/utils/format';

export default function TransactionsScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const [direction, setDirection] = useState<TransactionDirection | undefined>(undefined);
  const { data, isLoading, isError, refetch, isRefetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useTransactions({ direction });

  const items = data?.pages.flatMap((p) => p.items) ?? [];

  const filters = [
    { key: 'all', label: 'Todas', value: undefined },
    { key: 'in', label: 'Entradas', value: 'IN' as const },
    { key: 'out', label: 'Saídas', value: 'OUT' as const },
  ];

  return (
    <ScreenLayout scroll={false} padded={false} glow>
      <View style={styles.header}>
        <ThemedText variant="title">Transações</ThemedText>
        <View style={styles.tabs}>
          {filters.map((f) => {
            const active = direction === f.value;
            return (
              <Pressable
                key={f.key}
                onPress={() => setDirection(f.value)}
                style={[
                  styles.tab,
                  active && { backgroundColor: theme.dark ? 'rgba(0,122,255,0.18)' : 'rgba(0,122,255,0.12)' },
                ]}>
                <ThemedText
                  variant="caption"
                  style={{ color: active ? accent.primary : theme.colors.textMuted, fontWeight: active ? '600' : '500' }}>
                  {f.label}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      </View>

      {isLoading ? (
        <View style={styles.padded}><Skeleton height={72} /><Skeleton height={72} /></View>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : items.length === 0 ? (
        <EmptyState title="Nenhuma transação" description="Suas transações aparecerão aqui após conectar um banco." />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />}
          onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push(`/(app)/accounts/${item.accountId}` as never)}>
              <Card compact style={styles.item}>
                <View style={styles.row}>
                  <View style={[styles.iconCircle, { backgroundColor: theme.colors.surfaceMuted }]}>
                    <AppIcon
                      name={item.direction === 'IN' ? 'receive' : 'send'}
                      size={18}
                      color={item.direction === 'IN' ? accent.success : accent.error}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <ThemedText variant="label">{item.description}</ThemedText>
                    <ThemedText variant="caption" muted>
                      {item.accountName} · {formatDate(item.date)}
                    </ThemedText>
                  </View>
                  <ThemedText
                    variant="label"
                    style={{ color: item.direction === 'IN' ? accent.success : accent.error }}>
                    {item.direction === 'IN' ? '+' : '-'}{formatCurrency(item.amount)}
                  </ThemedText>
                </View>
              </Card>
            </Pressable>
          )}
          ListFooterComponent={isFetchingNextPage ? <Skeleton height={40} /> : null}
        />
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: spacing.md, paddingTop: spacing.sm },
  tabs: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, marginBottom: spacing.md },
  tab: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.pill },
  padded: { padding: spacing.md },
  list: { padding: spacing.md, paddingBottom: 120 },
  item: { marginBottom: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
