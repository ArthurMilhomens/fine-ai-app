import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/components/AppShell';
import { ListSkeleton } from '@/components/patterns/Skeleton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useConsents, useRevokeConsent } from '@/features/privacy/usePrivacy';
import { useAppTheme } from '@/theme/ThemeProvider';
import type { Theme } from '@/theme/tokens';
import { formatDateTime } from '@/utils/format';

export default function ConsentsScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const { data, isError, refetch, isLoading } = useConsents();
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

  return (
    <AppShell showNav={false} scroll={false}>
      <ScreenHeader title="Consentimentos" />

      {isError ? (
        <View style={styles.centered}>
          <Text style={styles.empty}>Não foi possível carregar os consentimentos.</Text>
          <Pressable onPress={() => refetch()} style={styles.retryButton}>
            <Text style={styles.retryText}>Tentar de novo</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            isLoading ? <ListSkeleton rows={3} /> : (
              <Text style={styles.empty}>Nenhum consentimento ativo.</Text>
            )
          }
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.label}>{item.purpose}</Text>
              <Text style={styles.caption}>Concedido: {formatDateTime(item.grantedAt)}</Text>
              {item.revokedAt ? (
                <Text style={styles.caption}>Revogado: {formatDateTime(item.revokedAt)}</Text>
              ) : (
                <Pressable
                  style={styles.dangerButton}
                  onPress={() => handleRevoke(item.id)}
                  disabled={revokeMutation.isPending}>
                  <Text style={styles.dangerButtonText}>Revogar</Text>
                </Pressable>
              )}
            </View>
          )}
        />
      )}
    </AppShell>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    centered: { paddingVertical: 64, alignItems: 'center', gap: 12 },
    empty: {
      paddingVertical: 32,
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
    list: { paddingHorizontal: 24, paddingBottom: 40, gap: 12 },
    item: {
      gap: 8,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 20,
    },
    label: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
    caption: { fontSize: 12, color: theme.colors.textMuted },
    dangerButton: {
      marginTop: 8,
      alignSelf: 'flex-start',
      borderRadius: 12,
      backgroundColor: 'rgba(255,59,48,0.15)',
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    dangerButtonText: { color: theme.colors.destructive, fontWeight: '700', fontSize: 13 },
  });
