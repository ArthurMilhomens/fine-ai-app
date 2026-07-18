import { ArrowDownLeft, ArrowUpRight, Search } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/components/AppShell';
import { ListSkeleton, Skeleton } from '@/components/patterns/Skeleton';
import { useTransactions } from '@/features/transactions/useTransactions';
import type { Transaction, TransactionDirection } from '@/types/api';
import { useAppTheme } from '@/theme/ThemeProvider';
import type { Theme } from '@/theme/tokens';
import { formatCurrency, formatDate } from '@/utils/format';

type Filter = 'all' | 'IN' | 'OUT';

const CATEGORY_COLORS = ['#34C759', '#AF52DE', '#007AFF', '#FF9500', '#FF3B30', '#8E8E93'];

function categoryColor(category?: string): string {
  if (!category) return CATEGORY_COLORS[5]!;
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = (hash + category.charCodeAt(i)) % CATEGORY_COLORS.length;
  }
  return CATEGORY_COLORS[hash]!;
}

export default function TransactionsScreen() {
  const [filter, setFilter] = useState<Filter>('all');
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  const direction: TransactionDirection | undefined =
    filter === 'all' ? undefined : filter;

  const {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTransactions({ direction });

  const items = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <AppShell>
      <View style={styles.header}>
        <Text style={styles.title}>Extrato</Text>
        <Pressable accessibilityLabel="Buscar" style={styles.iconButton}>
          <Search size={18} strokeWidth={1.8} color={theme.colors.textMuted} />
        </Pressable>
      </View>

      <View style={styles.filterWrap}>
        <View style={styles.filterBar}>
          <FilterPill active={filter === 'all'} onPress={() => setFilter('all')} theme={theme}>
            Todas
          </FilterPill>
          <FilterPill active={filter === 'IN'} onPress={() => setFilter('IN')} theme={theme}>
            Entradas
          </FilterPill>
          <FilterPill active={filter === 'OUT'} onPress={() => setFilter('OUT')} theme={theme}>
            Saídas
          </FilterPill>
        </View>
      </View>

      {isLoading && !data ? (
        <ListSkeleton rows={6} />
      ) : isError ? (
        <View style={styles.centered}>
          <Text style={styles.empty}>Erro ao carregar transações.</Text>
          <Pressable onPress={() => refetch()} style={styles.retryButton}>
            <Text style={styles.retryText}>{isRefetching ? 'Carregando…' : 'Tentar de novo'}</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.list}>
          {items.map((t) => (
            <TransactionRow key={t.id} t={t} theme={theme} />
          ))}
          {items.length === 0 && (
            <Text style={styles.empty}>
              Nenhuma transação. Conecte um banco via Pluggy para sincronizar.
            </Text>
          )}
          {hasNextPage ? (
            <Pressable
              onPress={() => fetchNextPage()}
              style={styles.loadMore}
              disabled={isFetchingNextPage}>
              {isFetchingNextPage ? (
                <View style={{ width: '100%', alignItems: 'center' }}>
                  <Skeleton height={14} width="40%" />
                </View>
              ) : (
                <Text style={styles.loadMoreText}>Carregar mais</Text>
              )}
            </Pressable>
          ) : null}
        </View>
      )}
    </AppShell>
  );
}

function FilterPill({
  active,
  onPress,
  children,
  theme,
}: {
  active: boolean;
  onPress: () => void;
  children: string;
  theme: Theme;
}) {
  const styles = createStyles(theme);
  return (
    <Pressable onPress={onPress} style={[styles.pill, active && styles.pillActive]}>
      <Text style={[styles.pillText, active && styles.pillTextActive]}>{children}</Text>
    </Pressable>
  );
}

function TransactionRow({ t, theme }: { t: Transaction; theme: Theme }) {
  const styles = createStyles(theme);
  const income = t.direction === 'IN';
  const color = categoryColor(t.category);
  const signed = income ? t.amount : -t.amount;
  return (
    <View style={styles.row}>
      <View style={[styles.rowIcon, { backgroundColor: `${color}22` }]}>
        {income ? (
          <ArrowDownLeft size={20} strokeWidth={2.2} color={color} />
        ) : (
          <ArrowUpRight size={20} strokeWidth={2.2} color={color} />
        )}
      </View>
      <View style={styles.rowBody}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {t.description}
        </Text>
        <Text style={styles.rowSubtitle} numberOfLines={1}>
          {t.accountName} · {formatDate(t.date)}
          {t.status === 'PENDING' && (
            <Text style={{ color: theme.colors.warning }}> · Pendente</Text>
          )}
        </Text>
      </View>
      <Text style={[styles.rowAmount, income && { color: theme.colors.success }]}>
        {income ? '+' : ''}
        {formatCurrency(signed)}
      </Text>
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
    title: { fontSize: 24, fontWeight: '700', letterSpacing: -0.4, color: theme.colors.text },
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
    filterWrap: { paddingHorizontal: 24 },
    filterBar: {
      flexDirection: 'row',
      gap: 8,
      borderRadius: 999,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 4,
    },
    pill: {
      flex: 1,
      borderRadius: 999,
      paddingVertical: 8,
      alignItems: 'center',
    },
    pillActive: {
      backgroundColor: theme.colors.primary,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.45,
      shadowRadius: 12,
      elevation: 6,
    },
    pillText: { fontSize: 12, fontWeight: '600', color: theme.colors.textMuted },
    pillTextActive: { color: '#FFFFFF' },
    list: { marginTop: 24, paddingHorizontal: 24, gap: 8, paddingBottom: 24 },
    centered: { paddingVertical: 64, alignItems: 'center', gap: 12 },
    empty: {
      paddingVertical: 64,
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
    loadMore: {
      marginTop: 8,
      paddingVertical: 14,
      borderRadius: 12,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
    },
    loadMoreText: { fontSize: 13, fontWeight: '600', color: theme.colors.primary },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 16,
    },
    rowIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowBody: { flex: 1, minWidth: 0 },
    rowTitle: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
    rowSubtitle: { fontSize: 11, color: theme.colors.textMuted, marginTop: 2 },
    rowAmount: {
      fontSize: 14,
      fontWeight: '700',
      fontVariant: ['tabular-nums'],
      color: theme.colors.text,
    },
  });
