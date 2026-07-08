import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, RefreshControl, StyleSheet, View } from 'react-native';

import { queryKeys } from '@/api/queryClient';
import { IncomeOutcomeChart } from '@/components/charts/IncomeOutcomeChart';
import { defaultSpendingSegments, SegmentedProgressBar } from '@/components/charts/SegmentedProgressBar';
import { BalanceCard } from '@/components/ui/BalanceCard';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { ScreenLayout } from '@/components/ui/ScreenLayout';
import { Skeleton } from '@/components/ui/Skeleton';
import { ThemedText } from '@/components/ui/ThemedText';
import { useConnections } from '@/features/connections/useConnections';
import { useDashboard } from '@/features/dashboard/useDashboard';
import { formatCurrency, formatRelativeTime } from '@/utils/format';
import { spacing } from '@/theme/tokens';

const QUICK_LINKS = [
  { label: 'Contas', href: '/(app)/accounts' },
  { label: 'Cartões', href: '/(app)/cards' },
  { label: 'Investimentos', href: '/(app)/investments' },
  { label: 'Conexões', href: '/(app)/(tabs)/connections' },
] as const;

export default function DashboardScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch, isRefetching } = useDashboard();
  const { data: connections } = useConnections();
  const [balanceHidden, setBalanceHidden] = useState(false);

  const hasExpired = connections?.some((c) => c.status === 'EXPIRED');
  const hasNoConnections = connections?.length === 0;

  if (isLoading) {
    return (
      <ScreenLayout scroll={false}>
        <Skeleton height={140} />
        <Skeleton height={80} />
        <Skeleton height={200} />
      </ScreenLayout>
    );
  }

  if (isError) {
    return (
      <ScreenLayout scroll={false}>
        <ErrorState onRetry={() => refetch()} />
      </ScreenLayout>
    );
  }

  if (hasNoConnections) {
    return (
      <ScreenLayout
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />}>
        <EmptyState
          title="Conecte seu primeiro banco"
          description="Agregue suas contas via Open Finance para ver patrimônio, gastos e receitas."
          actionLabel="Conectar banco"
          onAction={() => router.push('/(app)/connections/connect')}
        />
      </ScreenLayout>
    );
  }

  const chartData = [
    { label: 'Jan', income: 10000, outcome: 7000 },
    { label: 'Fev', income: 12000, outcome: 8200 },
    { label: 'Mar', income: data!.monthlyIncome, outcome: data!.monthlyExpenses },
  ];

  return (
    <ScreenLayout
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={() => {
            refetch();
            queryClient.invalidateQueries({ queryKey: queryKeys.connections });
          }}
        />
      }>
      <View style={styles.header}>
        <ThemedText variant="title">Olá 👋</ThemedText>
        <ThemedText variant="caption" muted>
          Atualizado {formatRelativeTime(data!.computedAt)}
        </ThemedText>
      </View>

      {hasExpired ? (
        <Pressable onPress={() => router.push('/(app)/(tabs)/connections')}>
          <Card style={styles.banner}>
            <ThemedText style={styles.bannerText}>⚠️ Conexão expirada — toque para renovar</ThemedText>
          </Card>
        </Pressable>
      ) : null}

      <BalanceCard
        balance={data!.availableBalance}
        currency={data!.currency}
        hidden={balanceHidden}
        onToggleHidden={() => setBalanceHidden((v) => !v)}
      />

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <ThemedText variant="caption" muted>Patrimônio</ThemedText>
          <ThemedText variant="subtitle">{formatCurrency(data!.totalNetWorth, data!.currency)}</ThemedText>
        </Card>
        <Card style={styles.statCard}>
          <ThemedText variant="caption" muted>Investido</ThemedText>
          <ThemedText variant="subtitle">{formatCurrency(data!.totalInvested, data!.currency)}</ThemedText>
        </Card>
      </View>

      <Card style={styles.section}>
        <ThemedText variant="label">Gastos do mês</ThemedText>
        <ThemedText variant="title">{formatCurrency(data!.monthlyExpenses, data!.currency)}</ThemedText>
        <ThemedText variant="caption" muted style={styles.goal}>
          Receitas: {formatCurrency(data!.monthlyIncome, data!.currency)}
        </ThemedText>
        <SegmentedProgressBar
          segments={defaultSpendingSegments(data!.monthlyExpenses)}
          total={data!.monthlyExpenses}
        />
      </Card>

      <Card style={styles.section}>
        <ThemedText variant="label">Receitas vs Despesas</ThemedText>
        <IncomeOutcomeChart data={chartData} />
      </Card>

      <View style={styles.quickLinks}>
        {QUICK_LINKS.map((link) => (
          <Pressable key={link.label} onPress={() => router.push(link.href as never)}>
            <Card style={styles.quickLink}>
              <ThemedText variant="label">{link.label}</ThemedText>
            </Card>
          </Pressable>
        ))}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: spacing.lg, marginTop: spacing.sm },
  banner: { marginBottom: spacing.md, backgroundColor: '#FF950022' },
  bannerText: { color: '#FF9500' },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  statCard: { flex: 1 },
  section: { marginTop: spacing.md },
  goal: { marginVertical: spacing.sm },
  quickLinks: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md, marginBottom: spacing.xl },
  quickLink: { minWidth: '47%' },
});
