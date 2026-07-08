import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { ScreenLayout } from '@/components/ui/ScreenLayout';
import { Skeleton } from '@/components/ui/Skeleton';
import { ThemedText } from '@/components/ui/ThemedText';
import { useConnection, useSyncConnection } from '@/features/connections/useConnections';
import { useConnectionPolling } from '@/hooks/useConnectionPolling';
import { CONNECTION_STATUS_COLORS, CONNECTION_STATUS_LABELS } from '@/types/labels';
import { formatDateTime } from '@/utils/format';
import { spacing } from '@/theme/tokens';
import { useState } from 'react';

export default function ConnectionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, isError, refetch } = useConnection(id);
  const syncMutation = useSyncConnection();
  const [polling, setPolling] = useState(false);

  useConnectionPolling({
    connectionId: id,
    enabled: polling,
    onUpdate: () => refetch(),
    onComplete: () => {
      setPolling(false);
      refetch();
    },
  });

  if (isLoading) return <ScreenLayout scroll={false}><Skeleton height={120} /></ScreenLayout>;
  if (isError || !data) return <ScreenLayout scroll={false}><ErrorState onRetry={() => refetch()} /></ScreenLayout>;

  return (
    <ScreenLayout>
      <Card>
        <View style={styles.row}>
          <ThemedText variant="title">{data.institution.name}</ThemedText>
          <Badge label={CONNECTION_STATUS_LABELS[data.status]} color={CONNECTION_STATUS_COLORS[data.status]} />
        </View>
        {data.lastSyncAt ? (
          <ThemedText variant="caption" muted>Última sync: {formatDateTime(data.lastSyncAt)}</ThemedText>
        ) : null}
        {data.consentExpiresAt ? (
          <ThemedText variant="caption" muted>Consentimento expira: {formatDateTime(data.consentExpiresAt)}</ThemedText>
        ) : null}
        {data.errorMessage ? (
          <ThemedText variant="caption" style={styles.error}>{data.errorMessage}</ThemedText>
        ) : null}
      </Card>

      {(data.status === 'CONNECTED' || data.status === 'ERROR') && (
        <View style={styles.action}>
          <Button
            label="Atualizar dados"
            onPress={async () => {
              await syncMutation.mutateAsync(id);
              setPolling(true);
            }}
            loading={syncMutation.isPending || polling}
          />
        </View>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  error: { color: '#FF3B30', marginTop: spacing.sm },
  action: { marginTop: spacing.lg },
});
