import { useLocalSearchParams, useRouter } from 'expo-router';
import { RefreshCw, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/components/AppShell';
import { DetailSkeleton } from '@/components/patterns/Skeleton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { StatusBadge } from '@/components/StatusBadge';
import {
  useConnection,
  useDeleteConnection,
  useSyncConnection,
} from '@/features/connections/useConnections';
import { useConnectionPolling } from '@/hooks/useConnectionPolling';
import { useAppTheme } from '@/theme/ThemeProvider';
import type { Theme } from '@/theme/tokens';
import { formatDateTime, formatRelativeTime } from '@/utils/format';
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

export default function ConnectionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const { data, isLoading, isError, refetch } = useConnection(id);
  const syncMutation = useSyncConnection();
  const deleteMutation = useDeleteConnection();
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

  const confirmDelete = () => {
    if (!data) return;
    Alert.alert(
      'Excluir conexão',
      `Remover ${data.institution.name}? Os dados sincronizados deste banco deixarão de aparecer no app.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync(id);
              router.replace('/(app)/(tabs)/connections');
            } catch (error) {
              Alert.alert('Erro', getApiErrorMessage(error, 'Não foi possível excluir a conexão.'));
            }
          },
        },
      ],
    );
  };

  const canSync = data?.status === 'CONNECTED' || data?.status === 'ERROR';
  const busy = syncMutation.isPending || polling || deleteMutation.isPending;

  return (
    <AppShell showNav={false}>
      <ScreenHeader title="Detalhe da conexão" />

      {isLoading && !data ? (
        <DetailSkeleton />
      ) : isError || !data ? (
        <View style={styles.centered}>
          <Text style={styles.empty}>Não foi possível carregar a conexão.</Text>
          <Pressable onPress={() => refetch()} style={styles.retryButton}>
            <Text style={styles.retryText}>Tentar de novo</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.main}>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={[styles.bankIcon, { backgroundColor: bankColor(data.institution.name) }]}>
                <Text style={styles.bankShort}>{bankShort(data.institution.name)}</Text>
              </View>
              <View style={styles.body}>
                <Text style={styles.bankName}>{data.institution.name}</Text>
                <Text style={styles.meta}>
                  {data.lastSyncAt
                    ? `Sync ${formatRelativeTime(data.lastSyncAt)}`
                    : 'Aguardando sync'}
                </Text>
              </View>
              <StatusBadge status={data.status} />
            </View>

            <View style={styles.details}>
              {data.lastSyncAt ? (
                <DetailRow
                  label="Última sincronização"
                  value={formatDateTime(data.lastSyncAt)}
                  theme={theme}
                />
              ) : null}
              {data.consentExpiresAt ? (
                <DetailRow
                  label="Consentimento expira"
                  value={formatDateTime(data.consentExpiresAt)}
                  theme={theme}
                />
              ) : null}
              {data.errorMessage ? (
                <Text style={styles.errorText}>{data.errorMessage}</Text>
              ) : null}
            </View>
          </View>

          {canSync ? (
            <Pressable
              style={[styles.primaryAction, busy && { opacity: 0.6 }]}
              disabled={busy}
              onPress={async () => {
                try {
                  await syncMutation.mutateAsync(id);
                  setPolling(true);
                } catch (error) {
                  Alert.alert('Erro', getApiErrorMessage(error, 'Falha ao sincronizar.'));
                }
              }}>
              <RefreshCw size={16} strokeWidth={2} color="#FFFFFF" />
              <Text style={styles.primaryActionText}>
                {syncMutation.isPending || polling ? 'Sincronizando…' : 'Atualizar dados'}
              </Text>
            </Pressable>
          ) : null}

          <Pressable
            style={[styles.deleteAction, busy && { opacity: 0.6 }]}
            disabled={busy}
            onPress={confirmDelete}>
            <Trash2 size={16} strokeWidth={2} color={theme.colors.destructive} />
            <Text style={styles.deleteActionText}>
              {deleteMutation.isPending ? 'Excluindo…' : 'Excluir conexão'}
            </Text>
          </Pressable>
        </View>
      )}
    </AppShell>
  );
}

function DetailRow({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: Theme;
}) {
  const styles = createStyles(theme);
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    main: { paddingHorizontal: 24, gap: 12 },
    centered: { paddingVertical: 64, alignItems: 'center', gap: 12 },
    empty: { fontSize: 14, color: theme.colors.textMuted, textAlign: 'center' },
    retryButton: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: theme.colors.primary,
    },
    retryText: { color: '#fff', fontWeight: '600', fontSize: 13 },
    card: {
      gap: 16,
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 16,
    },
    row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    bankIcon: {
      width: 48,
      height: 48,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bankShort: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
    body: { flex: 1, minWidth: 0 },
    bankName: { fontSize: 16, fontWeight: '700', color: theme.colors.text },
    meta: { marginTop: 2, fontSize: 12, color: theme.colors.textMuted },
    details: { gap: 10, borderTopWidth: 1, borderTopColor: theme.colors.border, paddingTop: 14 },
    detailRow: { gap: 2 },
    detailLabel: {
      fontSize: 10,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 1,
      color: theme.colors.textMuted,
    },
    detailValue: { fontSize: 13, fontWeight: '500', color: theme.colors.text },
    errorText: { fontSize: 12, color: theme.colors.destructive, lineHeight: 18 },
    primaryAction: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderRadius: 16,
      backgroundColor: theme.colors.primary,
      paddingVertical: 16,
    },
    primaryActionText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
    deleteAction: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderRadius: 16,
      backgroundColor: 'rgba(255,59,48,0.12)',
      borderWidth: 1,
      borderColor: 'rgba(255,59,48,0.25)',
      paddingVertical: 16,
    },
    deleteActionText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.destructive,
    },
  });
