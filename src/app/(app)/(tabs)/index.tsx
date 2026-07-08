import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, RefreshControl, StyleSheet, View } from 'react-native';

import { queryKeys } from '@/api/queryClient';
import { IncomeOutcomeChart } from '@/components/charts/IncomeOutcomeChart';
import { defaultSpendingSegments, SegmentedProgressBar } from '@/components/charts/SegmentedProgressBar';
import { AppHeader } from '@/components/ui/AppHeader';
import { AppIcon } from '@/components/ui/AppIcon';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { ScreenLayout } from '@/components/ui/ScreenLayout';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { ThemedText } from '@/components/ui/ThemedText';
import { WalletHero } from '@/components/ui/WalletHero';
import { useConnections } from '@/features/connections/useConnections';
import { useDashboard } from '@/features/dashboard/useDashboard';
import { formatCurrency, formatRelativeTime } from '@/utils/format';
import { accent, spacing } from '@/theme/tokens';

const QUICK_LINKS = [
  { label: 'Contas', href: '/(app)/accounts', icon: 'accounts' as const },
  { label: 'Cartões', href: '/(app)/cards', icon: 'cards' as const },
  { label: 'Investimentos', href: '/(app)/investments', icon: 'investments' as const },
  { label: 'Conexões', href: '/(app)/(tabs)/connections', icon: 'connections' as const },
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
      <ScreenLayout scroll={false} glow>
        <Skeleton height={260} />
        <Skeleton height={100} />
        <Skeleton height={180} />
      </ScreenLayout>
    );
  }

  if (isError) {
    return (
      <ScreenLayout scroll={false} glow>
        <ErrorState onRetry={() => refetch()} />
      </ScreenLayout>
    );
  }

  if (hasNoConnections) {
    return (
      <ScreenLayout
        glow
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
      glow
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={() => {
            refetch();
            queryClient.invalidateQueries({ queryKey: queryKeys.connections });
          }}
        />
      }>
      <AppHeader subtitle={`Atualizado ${formatRelativeTime(data!.computedAt)}`} />

      {hasExpired ? (
        <Pressable onPress={() => router.push('/(app)/(tabs)/connections')}>
          <Card compact style={styles.banner}>
            <View style={styles.bannerRow}>
              <AppIcon name="warning" color={accent.warning} size={18} />
              <ThemedText style={styles.bannerText}>Conexão expirada — toque para renovar</ThemedText>
            </View>
          </Card>
        </Pressable>
      ) : null}

      <WalletHero
        balance={data!.availableBalance}
        currency={data!.currency}
        hidden={balanceHidden}
        onToggleHidden={() => setBalanceHidden((v) => !v)}
      />

      <View style={styles.statsRow}>
        <Card compact style={styles.statCard}>
          <ThemedText variant="caption" muted>Patrimônio total</ThemedText>
          <ThemedText variant="subtitle">{formatCurrency(data!.totalNetWorth, data!.currency)}</ThemedText>
        </Card>
        <Card compact style={styles.statCard}>
          <ThemedText variant="caption" muted>Total investido</ThemedText>
          <ThemedText variant="subtitle">{formatCurrency(data!.totalInvested, data!.currency)}</ThemedText>
        </Card>
      </View>

      <Card style={styles.section}>
        <SectionHeader title="Gastos do mês" />
        <ThemedText variant="display" style={styles.expenseValue}>
          {formatCurrency(data!.monthlyExpenses, data!.currency)}
        </ThemedText>
        <ThemedText variant="caption" muted style={styles.goal}>
          Meta mensal · Receitas {formatCurrency(data!.monthlyIncome, data!.currency)}
        </ThemedText>
        <SegmentedProgressBar
          segments={defaultSpendingSegments(data!.monthlyExpenses)}
          total={data!.monthlyExpenses}
        />
      </Card>

      <Card style={styles.section}>
        <SectionHeader title="Receitas vs Despesas" />
        <IncomeOutcomeChart data={chartData} />
      </Card>

      <SectionHeader title="Acesso rápido" />
      <View style={styles.quickLinks}>
        {QUICK_LINKS.map((link) => (
          <Pressable key={link.label} onPress={() => router.push(link.href as never)}>
            <Card compact style={styles.quickLink}>
              <AppIcon name={link.icon} size={24} />
              <ThemedText variant="label" style={styles.quickLabel}>{link.label}</ThemedText>
            </Card>
          </Pressable>
        ))}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  banner: { marginBottom: spacing.md, backgroundColor: 'rgba(255,149,0,0.12)' },
  bannerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  bannerText: { color: accent.warning, flex: 1 },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  statCard: { flex: 1 },
  section: { marginBottom: spacing.md },
  expenseValue: { fontSize: 30, marginBottom: spacing.xs },
  goal: { marginBottom: spacing.md },
  quickLinks: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl },
  quickLink: { width: '47%', alignItems: 'flex-start', gap: spacing.sm },
  quickLabel: { marginTop: spacing.xs },
});
