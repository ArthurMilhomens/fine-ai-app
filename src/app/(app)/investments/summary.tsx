import { FlatList, StyleSheet } from 'react-native';

import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { ScreenLayout } from '@/components/ui/ScreenLayout';
import { ThemedText } from '@/components/ui/ThemedText';
import { useInvestmentSummary } from '@/features/investments/useInvestments';
import { INVESTMENT_CATEGORY_LABELS } from '@/types/labels';
import { formatCurrency } from '@/utils/format';
import { spacing } from '@/theme/tokens';

export default function InvestmentSummaryScreen() {
  const { data, isError, refetch } = useInvestmentSummary();

  if (isError) {
    return <ScreenLayout scroll={false}><ErrorState onRetry={() => refetch()} /></ScreenLayout>;
  }

  return (
    <ScreenLayout scroll={false} padded={false}>
      <FlatList
        data={data?.items ?? []}
        keyExtractor={(item) => item.category}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          data ? (
            <Card style={styles.header}>
              <ThemedText variant="caption" muted>Total</ThemedText>
              <ThemedText variant="title">{formatCurrency(data.totalValue)}</ThemedText>
            </Card>
          ) : null
        }
        renderItem={({ item }) => (
          <Card style={styles.item}>
            <ThemedText variant="label">{INVESTMENT_CATEGORY_LABELS[item.category]}</ThemedText>
            <ThemedText variant="subtitle">{formatCurrency(item.totalValue)}</ThemedText>
            <ThemedText variant="caption" muted>{item.percentage.toFixed(1)}%</ThemedText>
          </Card>
        )}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.md },
  header: { marginBottom: spacing.md },
  item: { marginBottom: spacing.md },
});
