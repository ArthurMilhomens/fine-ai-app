import { useRouter } from 'expo-router';
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { ThemedText } from '@/components/ui/ThemedText';
import { useCards } from '@/features/cards/useCards';
import { CARD_BRAND_LABELS } from '@/types/labels';
import { formatCurrency, maskCardNumber } from '@/utils/format';
import { spacing } from '@/theme/tokens';

export default function CardsScreen() {
  const router = useRouter();
  const { data, isLoading, isError, refetch, isRefetching } = useCards();

  if (isLoading) return <View style={{ margin: spacing.md }}><Skeleton height={80} /></View>;
  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (!data?.length) return <EmptyState title="Nenhum cartão" description="Seus cartões aparecerão após conectar um banco." />;

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />}
      renderItem={({ item }) => (
        <Pressable onPress={() => router.push(`/(app)/cards/${item.id}` as never)}>
          <Card style={styles.item}>
            <ThemedText variant="label">{item.name}</ThemedText>
            <ThemedText variant="caption" muted>{CARD_BRAND_LABELS[item.brand]}</ThemedText>
            <ThemedText variant="body" style={styles.number}>{maskCardNumber(item.lastFourDigits)}</ThemedText>
            {item.availableLimit != null && (
              <ThemedText variant="caption" muted>
                Limite disponível: {formatCurrency(item.availableLimit)}
              </ThemedText>
            )}
          </Card>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.md },
  item: { marginBottom: spacing.md },
  number: { marginVertical: spacing.sm, letterSpacing: 2 },
});
