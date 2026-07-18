import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  CreditCard,
  Eye,
  EyeOff,
  Link2,
  PiggyBank,
  Plus,
  QrCode,
  TrendingUp,
  Wallet,
  Wallet2,
  type LucideIcon,
} from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { connectionsApi } from '@/api/endpoints/connections';
import { useAuthStore } from '@/auth/authStore';
import { AppShell } from '@/components/AppShell';
import { Skeleton } from '@/components/patterns/Skeleton';
import { useConnections } from '@/features/connections/useConnections';
import { useDashboard } from '@/features/dashboard/useDashboard';
import { useAppTheme } from '@/theme/ThemeProvider';
import type { Theme } from '@/theme/tokens';
import { formatRelativeTime, greetingForNow, splitCurrency } from '@/utils/format';

export default function Dashboard() {
  const [hideBalance, setHideBalance] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const user = useAuthStore((s) => s.user);
  const { data, isLoading, isError, refetch, isRefetching } = useDashboard();
  const { data: connections, refetch: refetchConnections } = useConnections();

  const greeting = greetingForNow();
  const displayName = user?.email?.split('@')[0] ?? 'você';
  const initials = displayName.slice(0, 2).toUpperCase();
  const expired = connections?.find((c) => c.status === 'EXPIRED');
  const available = data ? splitCurrency(data.availableBalance) : null;
  const netWorth = data ? splitCurrency(data.totalNetWorth) : null;
  const invested = data ? splitCurrency(data.totalInvested) : null;
  const monthSpend = data ? splitCurrency(data.monthlyExpenses) : null;
  const monthIncome = data ? splitCurrency(data.monthlyIncome) : null;

  const showSkeleton = (isLoading && !data) || refreshing;

  async function onRefresh() {
    setRefreshing(true);
    try {
      const connected = (connections ?? []).filter((c) => c.status === 'CONNECTED');
      void Promise.allSettled(connected.map((c) => connectionsApi.sync(c.id)));
      await Promise.all([refetch(), refetchConnections()]);
      setTimeout(() => {
        void refetch();
        void refetchConnections();
      }, 4000);
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <AppShell refreshing={refreshing} onRefresh={onRefresh}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.userName}>{displayName}</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <Pressable accessibilityLabel="Escanear" style={styles.iconButton}>
            <QrCode size={18} strokeWidth={1.8} color={theme.colors.textMuted} />
          </Pressable>
          <Pressable accessibilityLabel="Notificações" style={styles.iconButton}>
            <Bell size={18} strokeWidth={1.8} color={theme.colors.textMuted} />
          </Pressable>
        </View>
      </View>

      {isError && !data && !refreshing ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Não foi possível carregar o dashboard.</Text>
          <Pressable onPress={() => refetch()} style={styles.retryButton}>
            <Text style={styles.retryText}>{isRefetching ? 'Carregando…' : 'Tentar de novo'}</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.main}>
          {showSkeleton ? (
            <DashboardDataSkeleton theme={theme} />
          ) : (
            <>
              <LinearGradient
                colors={['#8B0000', '#FF8C00']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroCard}>
                <View style={styles.heroGlow} />
                <View style={styles.heroTop}>
                  <View style={{ gap: 4 }}>
                    <Text style={styles.heroLabel}>Saldo disponível</Text>
                    <View style={styles.heroBalanceRow}>
                      {hideBalance || !available ? (
                        <Text style={styles.heroBalance}>R$ ••••••</Text>
                      ) : (
                        <Text style={styles.heroBalance}>
                          R$ {available.integer}
                          <Text style={styles.heroCents}>,{available.cents}</Text>
                        </Text>
                      )}
                      <Pressable
                        onPress={() => setHideBalance((v) => !v)}
                        accessibilityLabel={hideBalance ? 'Mostrar saldo' : 'Ocultar saldo'}
                        style={styles.eyeButton}>
                        {hideBalance ? (
                          <EyeOff size={16} strokeWidth={2} color="rgba(255,255,255,0.7)" />
                        ) : (
                          <Eye size={16} strokeWidth={2} color="rgba(255,255,255,0.7)" />
                        )}
                      </Pressable>
                    </View>
                  </View>
                  <View style={styles.heroChip} />
                </View>
                <View style={styles.heroBottom}>
                  <Text style={styles.heroCardNumber}>
                    {data?.cardCount
                      ? `${data.cardCount} cartão${data.cardCount > 1 ? 'ões' : ''}`
                      : 'Sem cartões'}
                  </Text>
                  <Text style={styles.heroBrand}>fine-ai · Open Finance</Text>
                </View>
              </LinearGradient>
            </>
          )}

          <View style={styles.quickActions}>
            <QuickAction
              icon={Plus}
              label="Adicionar"
              theme={theme}
              onPress={() => router.push('/(app)/connections/connect')}
            />
            <QuickAction icon={ArrowDownLeft} label="Receber" theme={theme} />
            <QuickAction icon={ArrowUpRight} label="Enviar" theme={theme} />
            <QuickAction icon={Wallet} label="Pagar" theme={theme} />
          </View>

          {showSkeleton ? (
            <DashboardStatsSkeleton theme={theme} />
          ) : (
            <>
              <View style={styles.statRow}>
                <StatCard
                  label="Patrimônio"
                  integer={netWorth?.integer ?? '0'}
                  cents={netWorth?.cents ?? '00'}
                  theme={theme}
                />
                <StatCard
                  label="Investido"
                  integer={invested?.integer ?? '0'}
                  cents={invested?.cents ?? '00'}
                  accent
                  theme={theme}
                />
              </View>

              <View style={styles.sectionCard}>
                <View style={styles.spendHeader}>
                  <View>
                    <Text style={styles.sectionLabel}>Gastos do mês</Text>
                    <Text style={styles.spendValue}>
                      R$ {monthSpend?.integer ?? '0'}
                      <Text style={styles.spendCents}>,{monthSpend?.cents ?? '00'}</Text>
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.incomeLabel}>Receitas</Text>
                    <Text style={styles.incomeValue}>
                      R$ {monthIncome?.integer ?? '0'},{monthIncome?.cents ?? '00'}
                    </Text>
                  </View>
                </View>
              </View>
            </>
          )}

          <View>
            <Text style={[styles.sectionLabel, { marginBottom: 12 }]}>Atalhos</Text>
            <View style={styles.quickActions}>
              <Shortcut
                icon={Wallet2}
                label="Contas"
                onPress={() => router.push('/(app)/accounts')}
                theme={theme}
              />
              <Shortcut
                icon={CreditCard}
                label="Cartões"
                onPress={() => router.push('/(app)/cards')}
                theme={theme}
              />
              <Shortcut
                icon={PiggyBank}
                label="Invest."
                onPress={() => router.push('/(app)/investments')}
                theme={theme}
              />
              <Shortcut
                icon={Link2}
                label="Conexões"
                onPress={() => router.push('/(app)/(tabs)/connections')}
                theme={theme}
              />
            </View>
          </View>

          {showSkeleton ? (
            <View style={styles.footerSkeleton}>
              <Skeleton height={10} width="70%" />
            </View>
          ) : (
            <>
              {expired ? (
                <Pressable
                  onPress={() => router.push(`/(app)/connections/${expired.id}` as never)}
                  style={styles.expiredBanner}>
                  <View style={styles.expiredIcon}>
                    <Text style={styles.expiredExclamation}>!</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.expiredTitle}>Conexão expirada</Text>
                    <Text style={styles.expiredDesc}>
                      {expired.institution.name} requer nova autorização Open Finance.
                    </Text>
                  </View>
                  <Text style={styles.expiredCta}>Renovar</Text>
                </Pressable>
              ) : null}

              <Text style={styles.footerText}>
                {data?.computedAt
                  ? `Atualizado ${formatRelativeTime(data.computedAt)} · Open Finance / Pluggy`
                  : 'Open Finance / Pluggy'}
              </Text>
            </>
          )}
        </View>
      )}
    </AppShell>
  );
}

function DashboardDataSkeleton({ theme }: { theme: Theme }) {
  const styles = createStyles(theme);
  return (
    <View style={[styles.heroCard, styles.heroSkeleton]}>
      <Skeleton height={12} width="40%" />
      <Skeleton height={32} width="65%" />
      <View style={styles.heroBottom}>
        <Skeleton height={10} width="30%" />
        <Skeleton height={10} width="35%" />
      </View>
    </View>
  );
}

function DashboardStatsSkeleton({ theme }: { theme: Theme }) {
  const styles = createStyles(theme);
  return (
    <>
      <View style={styles.statRow}>
        <View style={styles.statCard}>
          <Skeleton height={10} width="50%" />
          <Skeleton height={22} width="70%" />
          <Skeleton height={10} width="40%" />
        </View>
        <View style={styles.statCard}>
          <Skeleton height={10} width="50%" />
          <Skeleton height={22} width="70%" />
          <Skeleton height={10} width="40%" />
        </View>
      </View>
      <View style={styles.sectionCard}>
        <View style={styles.spendHeader}>
          <View style={{ flex: 1, gap: 8 }}>
            <Skeleton height={10} width="45%" />
            <Skeleton height={28} width="60%" />
          </View>
          <View style={{ alignItems: 'flex-end', gap: 8, flex: 1 }}>
            <Skeleton height={10} width="40%" />
            <Skeleton height={14} width="50%" />
          </View>
        </View>
      </View>
    </>
  );
}

function QuickAction({
  icon: Icon,
  label,
  theme,
  onPress,
}: {
  icon: LucideIcon;
  label: string;
  theme: Theme;
  onPress?: () => void;
}) {
  const styles = createStyles(theme);
  return (
    <Pressable onPress={onPress} style={styles.quickActionItem}>
      <View style={styles.quickActionIcon}>
        <Icon size={20} strokeWidth={1.8} color={theme.colors.text} />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </Pressable>
  );
}

function Shortcut({
  icon: Icon,
  label,
  onPress,
  theme,
}: {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  theme: Theme;
}) {
  const styles = createStyles(theme);
  return (
    <Pressable onPress={onPress} style={styles.quickActionItem}>
      <View style={styles.quickActionIcon}>
        <Icon size={20} strokeWidth={1.8} color={theme.colors.text} />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </Pressable>
  );
}

function StatCard({
  label,
  integer,
  cents,
  accent = false,
  theme,
}: {
  label: string;
  integer: string;
  cents: string;
  accent?: boolean;
  theme: Theme;
}) {
  const styles = createStyles(theme);
  return (
    <View style={styles.statCard}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <Text style={[styles.statValue, accent && { color: theme.colors.success }]}>
        R$ {integer}
        <Text style={styles.statCents}>,{cents}</Text>
      </Text>
      <View style={styles.trendRow}>
        <TrendingUp size={12} color={theme.colors.success} />
        <Text style={styles.trendText}>via Pluggy</Text>
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 16,
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
    greeting: {
      fontSize: 10,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 1.2,
      color: theme.colors.textMuted,
    },
    userName: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
    headerActions: { flexDirection: 'row', gap: 8 },
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    centered: { paddingVertical: 80, alignItems: 'center', gap: 12 },
    errorText: { color: theme.colors.textMuted, fontSize: 14 },
    retryButton: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: theme.colors.primary,
    },
    retryText: { color: '#fff', fontWeight: '600', fontSize: 13 },
    main: { paddingHorizontal: 24, gap: 32 },
    heroCard: {
      borderRadius: 32,
      padding: 24,
      overflow: 'hidden',
      shadowColor: '#8B0000',
      shadowOffset: { width: 0, height: 24 },
      shadowOpacity: 0.45,
      shadowRadius: 30,
      elevation: 16,
    },
    heroSkeleton: {
      gap: 16,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowOpacity: 0,
      elevation: 0,
      minHeight: 168,
      justifyContent: 'space-between',
    },
    heroGlow: {
      position: 'absolute',
      right: -32,
      top: -32,
      width: 160,
      height: 160,
      borderRadius: 80,
      backgroundColor: 'rgba(255,255,255,0.1)',
    },
    heroTop: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 40,
    },
    heroLabel: { fontSize: 14, fontWeight: '500', color: 'rgba(255,255,255,0.8)' },
    heroBalanceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    heroBalance: {
      fontSize: 30,
      fontWeight: '700',
      letterSpacing: -0.5,
      color: '#FFFFFF',
    },
    heroCents: { fontSize: 24, fontWeight: '600', color: 'rgba(255,255,255,0.6)' },
    eyeButton: { marginLeft: 4, padding: 4 },
    heroChip: {
      width: 40,
      height: 24,
      borderRadius: 6,
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.2)',
    },
    heroBottom: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    },
    heroCardNumber: {
      fontSize: 12,
      fontWeight: '500',
      letterSpacing: 1,
      color: 'rgba(255,255,255,0.6)',
    },
    heroBrand: {
      fontSize: 10,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      color: 'rgba(255,255,255,0.5)',
    },
    quickActions: { flexDirection: 'row', gap: 12 },
    quickActionItem: { flex: 1, alignItems: 'center', gap: 8 },
    quickActionIcon: {
      width: 56,
      height: 56,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    quickActionLabel: {
      fontSize: 10,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      color: theme.colors.textMuted,
    },
    statRow: { flexDirection: 'row', gap: 12 },
    statCard: {
      flex: 1,
      gap: 8,
      borderRadius: 24,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 20,
    },
    sectionLabel: {
      fontSize: 10,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 1.2,
      color: theme.colors.textMuted,
    },
    statValue: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3, color: theme.colors.text },
    statCents: { fontSize: 14, fontWeight: '500', opacity: 0.5 },
    trendRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    trendText: { fontSize: 10, fontWeight: '600', color: theme.colors.success },
    sectionCard: {
      gap: 24,
      borderRadius: 28,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 24,
    },
    spendHeader: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    },
    spendValue: {
      marginTop: 4,
      fontSize: 24,
      fontWeight: '700',
      letterSpacing: -0.4,
      color: theme.colors.text,
    },
    spendCents: { fontSize: 18, color: theme.colors.textMuted },
    incomeLabel: {
      fontSize: 10,
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      color: theme.colors.textMuted,
    },
    incomeValue: { fontSize: 12, fontWeight: '600', color: theme.colors.success },
    expiredBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: 'rgba(255,149,0,0.25)',
      backgroundColor: 'rgba(255,149,0,0.1)',
      padding: 16,
    },
    expiredIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(255,149,0,0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    expiredExclamation: { fontSize: 18, fontWeight: '700', color: theme.colors.warning },
    expiredTitle: {
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      color: theme.colors.warning,
    },
    expiredDesc: { fontSize: 11, color: 'rgba(255,149,0,0.8)' },
    expiredCta: {
      fontSize: 10,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 1.2,
      color: theme.colors.warning,
    },
    footerText: {
      paddingTop: 8,
      paddingBottom: 16,
      textAlign: 'center',
      fontSize: 10,
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: 1.2,
      color: 'rgba(142,142,147,0.6)',
    },
    footerSkeleton: {
      alignItems: 'center',
      paddingTop: 8,
      paddingBottom: 16,
    },
  });
