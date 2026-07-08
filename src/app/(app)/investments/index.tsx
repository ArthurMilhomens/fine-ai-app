import { useRouter } from 'expo-router';
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { ThemedText } from '@/components/ui/ThemedText';
import { useInvestments, useInvestmentSummary } from '@/features/investments/useInvestments';
import { INVESTMENT_CATEGORY_LABELS } from '@/types/labels';
import { formatCurrency } from '@/utils/format';
import { spacing } from '@/theme/tokens';

export default function InvestmentsScreen() {
  const router = useRouter();
  const { data, isLoading, isError, refetch, isRefetching } = useInvestments();
  const summary = useInvestmentSummary();

  if (isLoading) return null;
  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (!data?.length) return <EmptyState title="Nenhum investimento" description="Seus investimentos aparecerão após conectar um banco." />;

  return (
    <View style={{ flex: 1 }}>
      {summary.data ? (
        <Card style={styles.summary}>
          <ThemedText variant="caption" muted>Total investido</ThemedText>
          <ThemedText variant="title">{formatCurrency(summary.data.totalValue)}</ThemedText>
          <Button label="Ver resumo por categoria" variant="secondary" onPress={() => router.push('/(app)/investments/summary' as never)} />
        </Card>
      ) : null}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />}
        renderItem={({ item }) => (
          <Card style={styles.item}>
            <ThemedText variant="label">{item.name}</ThemedText>
            <ThemedText variant="caption" muted>
              {INVESTMENT_CATEGORY_LABELS[item.category]} · {item.institution.name}
            </ThemedText>
            <ThemedText variant="subtitle">{formatCurrency(item.currentValue)}</ThemedText>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  summary: { margin: spacing.md },
  list: { padding: spacing.md, paddingTop: 0 },
  item: { marginBottom: spacing.md },
});
