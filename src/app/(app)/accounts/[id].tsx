import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { ScreenLayout } from '@/components/ui/ScreenLayout';
import { Skeleton } from '@/components/ui/Skeleton';
import { ThemedText } from '@/components/ui/ThemedText';
import { useAccount } from '@/features/accounts/useAccounts';
import { ACCOUNT_TYPE_LABELS } from '@/types/labels';
import { formatCurrency, formatDateTime } from '@/utils/format';
import { spacing } from '@/theme/tokens';

export default function AccountDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useAccount(id);

  if (isLoading) {
    return <ScreenLayout scroll={false}><Skeleton height={120} /></ScreenLayout>;
  }

  if (isError || !data) {
    return <ScreenLayout scroll={false}><ErrorState onRetry={() => refetch()} /></ScreenLayout>;
  }

  return (
    <ScreenLayout>
      <Card>
        <ThemedText variant="title">{data.name}</ThemedText>
        <ThemedText variant="caption" muted>{ACCOUNT_TYPE_LABELS[data.type]}</ThemedText>
        <ThemedText variant="subtitle" style={styles.balance}>
          {formatCurrency(data.balance, data.currency)}
        </ThemedText>
        <ThemedText variant="caption" muted>
          Disponível: {formatCurrency(data.availableBalance, data.currency)}
        </ThemedText>
        <ThemedText variant="caption" muted>
          Atualizado: {formatDateTime(data.lastUpdatedAt)}
        </ThemedText>
      </Card>
      <View style={styles.action}>
        <Button
          label="Ver transações"
          onPress={() =>
            router.push({ pathname: '/(app)/(tabs)/transactions', params: { accountId: data.id } } as never)
          }
        />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  balance: { marginVertical: spacing.md },
  action: { marginTop: spacing.lg },
});
