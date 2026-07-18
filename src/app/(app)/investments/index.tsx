import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/components/AppShell';
import { ListSkeleton, Skeleton } from '@/components/patterns/Skeleton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useInvestments, useInvestmentSummary } from '@/features/investments/useInvestments';
import { INVESTMENT_CATEGORY_LABELS } from '@/types/labels';
import { useAppTheme } from '@/theme/ThemeProvider';
import type { Theme } from '@/theme/tokens';
import { formatCurrency } from '@/utils/format';

const PALETTE = ['#34C759', '#007AFF', '#AF52DE', '#FF9500'];

export default function InvestmentsScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const { data, isLoading, isError, refetch, isRefetching } = useInvestments();
  const summary = useInvestmentSummary();
  const investments = data ?? [];
  const total = summary.data?.totalValue ?? investments.reduce((s, i) => s + i.currentValue, 0);

  return (
    <AppShell>
      <ScreenHeader title="Investimentos" large />

      {isLoading && !data ? (
        <View style={{ gap: 16 }}>
          <View style={{ paddingHorizontal: 24 }}>
            <Skeleton height={100} radius={24} />
          </View>
          <ListSkeleton rows={4} />
        </View>
      ) : isError ? (
        <View style={styles.centered}>
          <Text style={styles.empty}>Erro ao carregar investimentos.</Text>
          <Pressable onPress={() => refetch()} style={styles.retryButton}>
            <Text style={styles.retryText}>{isRefetching ? 'Carregando…' : 'Tentar de novo'}</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.main}>
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Total investido</Text>
            <Text style={styles.totalValue}>{formatCurrency(total)}</Text>

            {summary.data?.items?.length ? (
              <View style={styles.categories}>
                {summary.data.items.map((item, idx) => (
                  <View key={item.category}>
                    <View style={styles.categoryHeader}>
                      <Text style={styles.categoryName}>
                        {INVESTMENT_CATEGORY_LABELS[item.category] ?? item.category}
                      </Text>
                      <Text style={styles.categoryPct}>{item.percentage.toFixed(1)}%</Text>
                    </View>
                    <View style={styles.categoryTrack}>
                      <View
                        style={[
                          styles.categoryFill,
                          {
                            width: `${item.percentage}%`,
                            backgroundColor: PALETTE[idx % PALETTE.length],
                          },
                        ]}
                      />
                    </View>
                  </View>
                ))}
              </View>
            ) : null}
          </View>

          {investments.length === 0 ? (
            <Text style={styles.empty}>
              Nenhum investimento. Conecte um banco via Pluggy para sincronizar.
            </Text>
          ) : (
            <View style={{ gap: 8 }}>
              {investments.map((i) => (
                <View key={i.id} style={styles.investRow}>
                  <View style={styles.investBody}>
                    <Text style={styles.investName} numberOfLines={1}>
                      {i.name}
                    </Text>
                    <Text style={styles.investMeta}>
                      {INVESTMENT_CATEGORY_LABELS[i.category] ?? i.category} · {i.institution.name}
                    </Text>
                  </View>
                  <Text style={styles.investValue}>{formatCurrency(i.currentValue)}</Text>
                </View>
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
    main: { paddingHorizontal: 24, gap: 24 },
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
      color: theme.colors.success,
    },
    categories: { marginTop: 24, gap: 12 },
    categoryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    categoryName: { fontSize: 11, fontWeight: '500', color: theme.colors.textMuted },
    categoryPct: { fontSize: 11, fontWeight: '600', color: theme.colors.text },
    categoryTrack: {
      height: 6,
      borderRadius: 999,
      backgroundColor: 'rgba(255,255,255,0.05)',
      overflow: 'hidden',
    },
    categoryFill: { height: '100%', borderRadius: 999 },
    investRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 16,
    },
    investBody: { flex: 1, minWidth: 0, marginRight: 12 },
    investName: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
    investMeta: { marginTop: 2, fontSize: 11, color: theme.colors.textMuted },
    investValue: {
      fontSize: 14,
      fontWeight: '700',
      fontVariant: ['tabular-nums'],
      color: theme.colors.text,
    },
  });
