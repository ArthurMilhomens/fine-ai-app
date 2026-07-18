import { FlatList, StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/components/AppShell';
import { ListSkeleton, Skeleton } from '@/components/patterns/Skeleton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useInvestmentSummary } from '@/features/investments/useInvestments';
import { INVESTMENT_CATEGORY_LABELS } from '@/types/labels';
import { useAppTheme } from '@/theme/ThemeProvider';
import type { Theme } from '@/theme/tokens';
import { formatCurrency } from '@/utils/format';

export default function InvestmentSummaryScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const { data, isLoading, isError, refetch } = useInvestmentSummary();

  return (
    <AppShell showNav={false} scroll={false}>
      <ScreenHeader title="Resumo" />

      {isLoading && !data ? (
        <View style={{ gap: 16 }}>
          <View style={{ paddingHorizontal: 24 }}>
            <Skeleton height={88} radius={24} />
          </View>
          <ListSkeleton rows={4} />
        </View>
      ) : isError ? (
        <View style={styles.centered}>
          <Text style={styles.empty}>Não foi possível carregar o resumo.</Text>
          <Text style={styles.retryLink} onPress={() => refetch()}>
            Tentar de novo
          </Text>
        </View>
      ) : (
        <FlatList
          data={data?.items ?? []}
          keyExtractor={(item) => item.category}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            data ? (
              <View style={styles.totalCard}>
                <Text style={styles.caption}>Total</Text>
                <Text style={styles.total}>{formatCurrency(data.totalValue)}</Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.label}>{INVESTMENT_CATEGORY_LABELS[item.category]}</Text>
              <Text style={styles.value}>{formatCurrency(item.totalValue)}</Text>
              <Text style={styles.caption}>{item.percentage.toFixed(1)}%</Text>
            </View>
          )}
        />
      )}
    </AppShell>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    centered: { paddingVertical: 64, alignItems: 'center', gap: 12 },
    empty: { fontSize: 14, color: theme.colors.textMuted },
    retryLink: { fontSize: 14, fontWeight: '600', color: theme.colors.primary },
    list: { paddingHorizontal: 24, paddingBottom: 40, gap: 12 },
    totalCard: {
      marginBottom: 12,
      borderRadius: 24,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 24,
      gap: 8,
    },
    total: { fontSize: 28, fontWeight: '700', color: theme.colors.text },
    item: {
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 20,
      gap: 6,
    },
    label: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
    value: { fontSize: 18, fontWeight: '700', color: theme.colors.text },
    caption: { fontSize: 12, color: theme.colors.textMuted },
  });
