import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';

import { queryKeys } from '@/api/queryClient';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { ScreenLayout } from '@/components/ui/ScreenLayout';
import { ThemedText } from '@/components/ui/ThemedText';
import { PluggyConnectWrapper } from '@/features/connections/PluggyConnectWrapper';
import { useConnectionPolling } from '@/hooks/useConnectionPolling';
import { useCreateConnection, useInstitutions } from '@/features/connections/useConnections';
import { spacing } from '@/theme/tokens';

const LGPD_TEXT = `Ao conectar seu banco, você consente com a finalidade de agregação de dados financeiros via Open Finance (open_finance_aggregation).

Base legal: consentimento (LGPD Art. 7º, I).

Seus dados serão utilizados exclusivamente para exibir saldos, transações e investimentos consolidados no fine-ai. Consulte nossa Política de Privacidade para mais detalhes.`;

export default function ConnectBankScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: institutions, isError, refetch } = useInstitutions();
  const createConnection = useCreateConnection();

  const [lgpdAccepted, setLgpdAccepted] = useState(false);
  const [showLgpd, setShowLgpd] = useState(true);
  const [connectToken, setConnectToken] = useState<string | null>(null);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [showWidget, setShowWidget] = useState(false);
  const [polling, setPolling] = useState(false);

  useConnectionPolling({
    connectionId,
    enabled: polling,
    onComplete: (connection) => {
      setPolling(false);
      setShowWidget(false);
      queryClient.invalidateQueries({ queryKey: queryKeys.connections });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      if (connection.status === 'CONNECTED') {
        Alert.alert('Sucesso', 'Banco conectado com sucesso!', [
          { text: 'OK', onPress: () => router.replace('/(app)/(tabs)') },
        ]);
      } else if (connection.status === 'ERROR') {
        Alert.alert('Erro', connection.errorMessage ?? 'Falha ao conectar banco');
      }
    },
    onTimeout: () => {
      setPolling(false);
      Alert.alert('Tempo esgotado', 'A conexão está demorando. Verifique o status na lista de conexões.');
    },
  });

  const handleSelectInstitution = async (institutionId: string) => {
    try {
      const result = await createConnection.mutateAsync(institutionId);
      setConnectionId(result.connectionId);
      setConnectToken(result.connectToken);
      setShowWidget(true);
    } catch (error: unknown) {
      const msg = (error as { message?: string })?.message ?? 'Erro ao iniciar conexão';
      Alert.alert('Erro', msg);
    }
  };

  const handleWidgetSuccess = () => {
    setPolling(true);
  };

  if (isError) {
    return <ScreenLayout scroll={false}><ErrorState onRetry={() => refetch()} /></ScreenLayout>;
  }

  return (
    <>
      <ScreenLayout scroll={false} padded={false}>
        <View style={styles.header}>
          <ThemedText variant="subtitle">Selecione seu banco</ThemedText>
        </View>
        <FlatList
          data={institutions ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                if (!lgpdAccepted) {
                  setShowLgpd(true);
                  return;
                }
                handleSelectInstitution(item.id);
              }}
              disabled={createConnection.isPending}>
              <Card style={styles.item}>
                <ThemedText variant="label">{item.name}</ThemedText>
              </Card>
            </Pressable>
          )}
        />
      </ScreenLayout>

      <Modal visible={showLgpd} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <Card style={styles.modalContent}>
            <ThemedText variant="subtitle">Termo de consentimento</ThemedText>
            <ThemedText variant="caption" muted style={styles.lgpdText}>{LGPD_TEXT}</ThemedText>
            <Button
              label="Aceito e continuar"
              onPress={() => {
                setLgpdAccepted(true);
                setShowLgpd(false);
              }}
            />
            <Button label="Cancelar" variant="ghost" onPress={() => router.back()} />
          </Card>
        </View>
      </Modal>

      <PluggyConnectWrapper
        connectToken={connectToken}
        visible={showWidget}
        onSuccess={handleWidgetSuccess}
        onError={(err) => {
          Alert.alert('Erro', String(err));
          setShowWidget(false);
        }}
        onClose={() => setShowWidget(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: { padding: spacing.md },
  list: { padding: spacing.md },
  item: { marginBottom: spacing.sm },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { margin: spacing.md, marginBottom: spacing.xxl },
  lgpdText: { marginVertical: spacing.md, lineHeight: 20 },
});
