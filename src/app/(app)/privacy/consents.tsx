import { Alert, FlatList, StyleSheet } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { ThemedText } from '@/components/ui/ThemedText';
import { useConsents, useRevokeConsent } from '@/features/privacy/usePrivacy';
import { formatDateTime } from '@/utils/format';
import { spacing } from '@/theme/tokens';

export default function ConsentsScreen() {
  const { data, isError, refetch } = useConsents();
  const revokeMutation = useRevokeConsent();

  const handleRevoke = (id: string) => {
    Alert.alert(
      'Revogar consentimento',
      'Isso desconectará o banco associado. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Revogar',
          style: 'destructive',
          onPress: () => revokeMutation.mutate(id),
        },
      ],
    );
  };

  if (isError) return <ErrorState onRetry={() => refetch()} />;

  return (
    <FlatList
      data={data ?? []}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <Card style={styles.item}>
          <ThemedText variant="label">{item.purpose}</ThemedText>
          <ThemedText variant="caption" muted>Concedido: {formatDateTime(item.grantedAt)}</ThemedText>
          {item.revokedAt ? (
            <ThemedText variant="caption" muted>Revogado: {formatDateTime(item.revokedAt)}</ThemedText>
          ) : (
            <Button label="Revogar" variant="danger" onPress={() => handleRevoke(item.id)} />
          )}
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.md },
  item: { marginBottom: spacing.md, gap: spacing.sm },
});
