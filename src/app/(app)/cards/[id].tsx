import { useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';

import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { ScreenLayout } from '@/components/ui/ScreenLayout';
import { Skeleton } from '@/components/ui/Skeleton';
import { ThemedText } from '@/components/ui/ThemedText';
import { useCard } from '@/features/cards/useCards';
import { CARD_BRAND_LABELS } from '@/types/labels';
import { formatCurrency, maskCardNumber } from '@/utils/format';
import { spacing } from '@/theme/tokens';

export default function CardDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, isError, refetch } = useCard(id);

  if (isLoading) return <ScreenLayout scroll={false}><Skeleton height={120} /></ScreenLayout>;
  if (isError || !data) return <ScreenLayout scroll={false}><ErrorState onRetry={() => refetch()} /></ScreenLayout>;

  return (
    <ScreenLayout>
      <Card>
        <ThemedText variant="title">{data.name}</ThemedText>
        <ThemedText variant="caption" muted>{CARD_BRAND_LABELS[data.brand]} · {data.institution.name}</ThemedText>
        <ThemedText variant="subtitle" style={styles.number}>{maskCardNumber(data.lastFourDigits)}</ThemedText>
        {data.creditLimit != null && (
          <ThemedText variant="body">Limite: {formatCurrency(data.creditLimit)}</ThemedText>
        )}
        {data.availableLimit != null && (
          <ThemedText variant="caption" muted>Disponível: {formatCurrency(data.availableLimit)}</ThemedText>
        )}
      </Card>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  number: { marginVertical: spacing.lg, letterSpacing: 2 },
});
