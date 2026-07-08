import { useRouter } from 'expo-router';
import { FlatList, Pressable, RefreshControl, StyleSheet } from 'react-native';

import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { ScreenLayout } from '@/components/ui/ScreenLayout';
import { Skeleton } from '@/components/ui/Skeleton';
import { ThemedText } from '@/components/ui/ThemedText';
import { useAccounts } from '@/features/accounts/useAccounts';
import { ACCOUNT_TYPE_LABELS } from '@/types/labels';
import { formatCurrency } from '@/utils/format';
import { spacing } from '@/theme/tokens';

export default function AccountsScreen() {
  const router = useRouter();
  const { data, isLoading, isError, refetch, isRefetching } = useAccounts();

  if (isLoading) {
    return (
      <ScreenLayout scroll={false}>
        <Skeleton height={80} />
      </ScreenLayout>
    );
  }

  if (isError) {
    return <ScreenLayout scroll={false}><ErrorState onRetry={() => refetch()} /></ScreenLayout>;
  }

  if (!data?.length) {
    return (
      <ScreenLayout scroll={false}>
        <EmptyState title="Nenhuma conta" description="Conecte um banco para ver suas contas." />
      </ScreenLayout>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />}
      renderItem={({ item }) => (
        <Pressable onPress={() => router.push(`/(app)/accounts/${item.id}` as never)}>
          <Card style={styles.item}>
            <ThemedText variant="label">{item.name}</ThemedText>
            <ThemedText variant="caption" muted>
              {ACCOUNT_TYPE_LABELS[item.type]} · {item.institution.name}
            </ThemedText>
            <ThemedText variant="subtitle" style={styles.balance}>
              {formatCurrency(item.balance, item.currency)}
            </ThemedText>
          </Card>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.md },
  item: { marginBottom: spacing.md },
  balance: { marginTop: spacing.sm },
});
