import { useRouter } from 'expo-router';
import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { ScreenLayout } from '@/components/ui/ScreenLayout';
import { Skeleton } from '@/components/ui/Skeleton';
import { ThemedText } from '@/components/ui/ThemedText';
import {
  useConnections,
  useDeleteConnection,
  useSyncConnection,
} from '@/features/connections/useConnections';
import { CONNECTION_STATUS_COLORS, CONNECTION_STATUS_LABELS } from '@/types/labels';
import { formatRelativeTime } from '@/utils/format';
import { spacing } from '@/theme/tokens';

const MAX_CONNECTIONS = 20;

export default function ConnectionsScreen() {
  const router = useRouter();
  const { data, isLoading, isError, refetch, isRefetching } = useConnections();
  const deleteMutation = useDeleteConnection();
  const syncMutation = useSyncConnection();

  const atLimit = (data?.length ?? 0) >= MAX_CONNECTIONS;

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Remover conexão', `Deseja remover a conexão com ${name}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => deleteMutation.mutate(id) },
    ]);
  };

  const handleSync = (id: string) => {
    syncMutation.mutate(id);
  };

  return (
    <ScreenLayout scroll={false} padded={false} glow>
      <View style={styles.header}>
        <ThemedText variant="title">Conexões</ThemedText>
        <ThemedText variant="caption" muted>Bancos conectados via Open Finance</ThemedText>
        <Button
          label={atLimit ? 'Limite de 20 conexões' : 'Adicionar banco'}
          onPress={() => router.push('/(app)/connections/connect')}
          disabled={atLimit}
        />
      </View>

      {isLoading ? (
        <View style={styles.padded}><Skeleton height={120} /></View>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !data?.length ? (
        <EmptyState
          title="Nenhum banco conectado"
          description="Conecte suas contas para ver saldos e transações unificados."
          actionLabel="Conectar banco"
          onAction={() => router.push('/(app)/connections/connect')}
        />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push(`/(app)/connections/${item.id}` as never)}>
              <Card style={styles.item}>
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <ThemedText variant="label">{item.institution.name}</ThemedText>
                    {item.lastSyncAt ? (
                      <ThemedText variant="caption" muted>
                        Sincronizado {formatRelativeTime(item.lastSyncAt)}
                      </ThemedText>
                    ) : null}
                  </View>
                  <Badge
                    label={CONNECTION_STATUS_LABELS[item.status]}
                    color={CONNECTION_STATUS_COLORS[item.status]}
                  />
                </View>
                {item.errorMessage ? (
                  <ThemedText variant="caption" style={styles.error}>{item.errorMessage}</ThemedText>
                ) : null}
                <View style={styles.actions}>
                  {(item.status === 'CONNECTED' || item.status === 'ERROR') && (
                    <Button
                      label="Atualizar"
                      variant="secondary"
                      onPress={() => handleSync(item.id)}
                      disabled={syncMutation.isPending}
                      fullWidth={false}
                    />
                  )}
                  {item.status === 'EXPIRED' && (
                    <Button
                      label="Renovar"
                      onPress={() => router.push('/(app)/connections/connect')}
                      fullWidth={false}
                    />
                  )}
                  <Button
                    label="Remover"
                    variant="ghost"
                    onPress={() => handleDelete(item.id, item.institution.name)}
                    fullWidth={false}
                  />
                </View>
              </Card>
            </Pressable>
          )}
        />
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: { padding: spacing.md, gap: spacing.sm },
  padded: { padding: spacing.md },
  list: { padding: spacing.md, paddingBottom: 120 },
  item: { marginBottom: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm },
  error: { color: '#FF3B30', marginTop: spacing.xs },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, flexWrap: 'wrap' },
});
