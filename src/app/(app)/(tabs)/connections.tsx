import { useRouter } from 'expo-router';
import { Plus, RefreshCw, Trash2 } from 'lucide-react-native';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/components/AppShell';
import { ListSkeleton } from '@/components/patterns/Skeleton';
import { StatusBadge } from '@/components/StatusBadge';
import {
  useConnections,
  useDeleteConnection,
  useSyncConnection,
} from '@/features/connections/useConnections';
import type { Connection } from '@/types/api';
import { useAppTheme } from '@/theme/ThemeProvider';
import type { Theme } from '@/theme/tokens';
import { formatRelativeTime } from '@/utils/format';
import { getApiErrorMessage } from '@/utils/helpers';

const BANK_COLORS = ['#8A05BE', '#EC7000', '#FF7A00', '#CC092F', '#0070AF', '#242424', '#0F1B2D'];

function bankColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash + name.charCodeAt(i)) % BANK_COLORS.length;
  return BANK_COLORS[hash]!;
}

function bankShort(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function ConnectionsScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const { data, isLoading, isError, refetch, isRefetching } = useConnections();
  const syncMutation = useSyncConnection();
  const deleteMutation = useDeleteConnection();
  const connections = data ?? [];
  const limitReached = connections.length >= 20;

  const confirmDelete = (connection: Connection) => {
    Alert.alert(
      'Excluir conexão',
      `Remover ${connection.institution.name}? Os dados sincronizados deste banco deixarão de aparecer no app.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync(connection.id);
            } catch (error) {
              Alert.alert('Erro', getApiErrorMessage(error, 'Não foi possível excluir a conexão.'));
            }
          },
        },
      ],
    );
  };

  return (
    <AppShell>
      <View style={styles.header}>
        <Text style={styles.title}>Conexões</Text>
        <Text style={styles.subtitle}>Bancos conectados via Open Finance (Pluggy)</Text>
      </View>

      {isLoading && !data ? (
        <ListSkeleton rows={4} />
      ) : isError ? (
        <View style={styles.centered}>
          <Text style={styles.empty}>Erro ao carregar conexões.</Text>
          <Pressable onPress={() => refetch()} style={styles.retryButton}>
            <Text style={styles.retryText}>{isRefetching ? 'Carregando…' : 'Tentar de novo'}</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.list}>
          <Pressable
            disabled={limitReached}
            onPress={() => router.push('/(app)/connections/connect')}
            style={[styles.addCard, limitReached && { opacity: 0.5 }]}>
            <View style={styles.addLeft}>
              <View style={styles.addIcon}>
                <Plus size={20} strokeWidth={2.2} color={theme.colors.primary} />
              </View>
              <View>
                <Text style={styles.addTitle}>Adicionar banco</Text>
                <Text style={styles.addSubtitle}>
                  {limitReached
                    ? 'Limite de 20 atingido'
                    : `${connections.length} de 20 conectados`}
                </Text>
              </View>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>

          {connections.length === 0 ? (
            <Text style={styles.empty}>
              Nenhuma conexão. Toque em “Adicionar banco” para conectar via Pluggy.
            </Text>
          ) : null}

          {connections.map((c) => {
            const color = bankColor(c.institution.name);
            const canSync = c.status === 'CONNECTED' || c.status === 'ERROR';
            const busy =
              (syncMutation.isPending && syncMutation.variables === c.id) ||
              (deleteMutation.isPending && deleteMutation.variables === c.id);

            return (
              <Pressable
                key={c.id}
                onPress={() => router.push(`/(app)/connections/${c.id}` as never)}
                style={[styles.connectionCard, busy && { opacity: 0.7 }]}>
                <View style={styles.connectionRow}>
                  <View style={[styles.bankIcon, { backgroundColor: color }]}>
                    <Text style={styles.bankShort}>{bankShort(c.institution.name)}</Text>
                  </View>
                  <View style={styles.connectionBody}>
                    <Text style={styles.bankName} numberOfLines={1}>
                      {c.institution.name}
                    </Text>
                    <Text style={styles.bankMeta}>
                      {c.lastSyncAt
                        ? `Sync ${formatRelativeTime(c.lastSyncAt)}`
                        : 'Aguardando sync'}
                    </Text>
                  </View>
                  <StatusBadge status={c.status} />
                </View>

                <View style={styles.actionsRow}>
                  {canSync ? (
                    <Pressable
                      style={styles.renewButton}
                      disabled={busy}
                      onPress={(e) => {
                        e.stopPropagation?.();
                        syncMutation.mutate(c.id);
                      }}>
                      <Text style={styles.renewText}>
                        {syncMutation.isPending && syncMutation.variables === c.id
                          ? 'Sincronizando…'
                          : 'Atualizar'}
                      </Text>
                    </Pressable>
                  ) : (
                    <View style={styles.actionsSpacer} />
                  )}

                  {canSync ? (
                    <Pressable
                      style={styles.iconButton}
                      disabled={busy}
                      onPress={(e) => {
                        e.stopPropagation?.();
                        syncMutation.mutate(c.id);
                      }}
                      accessibilityLabel="Sincronizar">
                      <RefreshCw size={16} strokeWidth={2} color={theme.colors.textMuted} />
                    </Pressable>
                  ) : null}

                  <Pressable
                    style={styles.deleteButton}
                    disabled={busy}
                    onPress={(e) => {
                      e.stopPropagation?.();
                      confirmDelete(c);
                    }}
                    accessibilityLabel="Excluir conexão">
                    <Trash2 size={16} strokeWidth={2} color={theme.colors.destructive} />
                  </Pressable>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </AppShell>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    header: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 },
    title: { fontSize: 24, fontWeight: '700', letterSpacing: -0.4, color: theme.colors.text },
    subtitle: { marginTop: 4, fontSize: 14, color: theme.colors.textMuted },
    list: { paddingHorizontal: 24, gap: 12, paddingBottom: 24 },
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
    addCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 16,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: 'rgba(0,122,255,0.4)',
      padding: 16,
    },
    addLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    addIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: 'rgba(0,122,255,0.1)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    addTitle: { fontSize: 14, fontWeight: '600', color: theme.colors.primary },
    addSubtitle: { fontSize: 11, color: theme.colors.textMuted, marginTop: 2 },
    chevron: { fontSize: 18, color: theme.colors.primary },
    connectionCard: {
      gap: 12,
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 16,
    },
    connectionRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    bankIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bankShort: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
    connectionBody: { flex: 1, minWidth: 0 },
    bankName: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
    bankMeta: { fontSize: 11, color: theme.colors.textMuted, marginTop: 2 },
    actionsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingTop: 12,
    },
    actionsSpacer: { flex: 1 },
    renewButton: {
      flex: 1,
      borderRadius: 12,
      backgroundColor: 'rgba(255,149,0,0.15)',
      paddingVertical: 8,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 36,
    },
    renewText: {
      fontSize: 11,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      color: theme.colors.warning,
    },
    iconButton: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: theme.colors.secondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    deleteButton: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: 'rgba(255,59,48,0.12)',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
