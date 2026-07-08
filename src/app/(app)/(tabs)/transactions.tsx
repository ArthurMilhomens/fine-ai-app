import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { ScreenLayout } from '@/components/ui/ScreenLayout';
import { Skeleton } from '@/components/ui/Skeleton';
import { ThemedText } from '@/components/ui/ThemedText';
import { useTransactions } from '@/features/transactions/useTransactions';
import type { TransactionDirection } from '@/types/api';
import { formatCurrency, formatDate } from '@/utils/format';
import { spacing } from '@/theme/tokens';

export default function TransactionsScreen() {
  const router = useRouter();
  const [direction, setDirection] = useState<TransactionDirection | undefined>(undefined);
  const { data, isLoading, isError, refetch, isRefetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useTransactions({ direction });

  const items = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <ScreenLayout scroll={false} padded={false}>
      <View style={styles.header}>
        <ThemedText variant="title">Transações</ThemedText>
        <View style={styles.tabs}>
          {([undefined, 'IN', 'OUT'] as const).map((d) => (
            <Pressable
              key={String(d)}
              onPress={() => setDirection(d)}
              style={[styles.tab, direction === d && styles.tabActive]}>
              <ThemedText variant="caption">{d === undefined ? 'Todas' : d === 'IN' ? 'Entradas' : 'Saídas'}</ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      {isLoading ? (
        <View style={styles.padded}><Skeleton height={60} /><Skeleton height={60} /></View>
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
              <Card style={styles.item}>
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <ThemedText variant="label">{item.description}</ThemedText>
                    <ThemedText variant="caption" muted>{item.accountName} · {formatDate(item.date)}</ThemedText>
                  </View>
                  <ThemedText
                    variant="label"
                    style={{ color: item.direction === 'IN' ? '#34C759' : '#FF3B30' }}>
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
  tabs: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  tab: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 20 },
  tabActive: { backgroundColor: '#007AFF33' },
  padded: { padding: spacing.md },
  list: { padding: spacing.md, gap: spacing.sm, paddingBottom: 120 },
  item: { marginBottom: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center' },
});
