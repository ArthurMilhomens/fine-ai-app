import { useCallback, useRef } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PluggyConnect } from 'react-native-pluggy-connect';

import { isMockMode } from '@/api/mocks';
import { PLUGGY_INCLUDE_SANDBOX } from '@/api/config';

interface PluggyConnectWrapperProps {
  connectToken: string | null;
  visible: boolean;
  onSuccess: (providerConnectionId: string) => void;
  onError: (error: unknown) => void;
  onClose: () => void;
}

function MockPluggyWidget({
  visible,
  onSuccess,
  onClose,
}: {
  visible: boolean;
  onSuccess: (providerConnectionId: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.mockOverlay}>
        <View style={styles.mockContent}>
          <Text style={styles.mockTitle}>Pluggy Connect (Mock)</Text>
          <Text style={styles.mockText}>
            Modo mock ativo. Em produção o widget Pluggy abre aqui.
          </Text>
          <Pressable
            style={styles.primaryButton}
            onPress={() => onSuccess(`mock-item-${Date.now()}`)}>
            <Text style={styles.primaryButtonText}>Simular sucesso</Text>
          </Pressable>
          <Pressable style={styles.ghostButton} onPress={onClose}>
            <Text style={styles.ghostButtonText}>Fechar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export function PluggyConnectWrapper({
  connectToken,
  visible,
  onSuccess,
  onError,
  onClose,
}: PluggyConnectWrapperProps) {
  const insets = useSafeAreaInsets();
  const includeSandbox = PLUGGY_INCLUDE_SANDBOX || __DEV__;
  const completedRef = useRef(false);

  const finishSuccess = useCallback(
    (itemId?: string | null) => {
      if (completedRef.current) return;
      if (!itemId) {
        onError({ message: 'Pluggy não retornou o ID da conexão (itemId).' });
        return;
      }
      completedRef.current = true;
      onSuccess(itemId);
    },
    [onError, onSuccess],
  );

  if (!visible || !connectToken) return null;

  if (isMockMode() || Platform.OS === 'web') {
    return <MockPluggyWidget visible={visible} onSuccess={onSuccess} onClose={onClose} />;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onShow={() => {
        completedRef.current = false;
      }}>
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Autenticação Pluggy</Text>
          <Pressable
            onPress={() => {
              if (!completedRef.current) onClose();
            }}
            hitSlop={12}
            accessibilityLabel="Fechar">
            <Text style={styles.closeText}>Fechar</Text>
          </Pressable>
        </View>
        <View style={styles.widget}>
          <PluggyConnect
            connectToken={connectToken}
            includeSandbox={includeSandbox}
            onSuccess={(data) => {
              finishSuccess(data?.item?.id);
            }}
            onEvent={(payload) => {
              const item = 'item' in payload ? payload.item : undefined;
              const event = payload.event;
              if (!item?.id) return;
              // Capture item as soon as Pluggy has created it (before/without onSuccess)
              if (
                event === 'LOGIN_SUCCESS' ||
                event === 'LOGIN_STEP_COMPLETED' ||
                event === 'ITEM_RESPONSE'
              ) {
                const status = String(item.status ?? '').toUpperCase();
                if (
                  status === 'UPDATED' ||
                  status === 'UPDATING' ||
                  status === 'MERGING' ||
                  event === 'LOGIN_SUCCESS' ||
                  event === 'LOGIN_STEP_COMPLETED'
                ) {
                  finishSuccess(item.id);
                }
              }
            }}
            onError={(error) => {
              if (completedRef.current) return;
              onError(error);
            }}
            onClose={() => {
              if (completedRef.current) return;
              onClose();
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.12)',
  },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: '600' },
  closeText: { color: '#007AFF', fontSize: 15, fontWeight: '600' },
  widget: { flex: 1 },
  mockOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 24,
  },
  mockContent: {
    gap: 12,
    borderRadius: 16,
    backgroundColor: '#1c1c1e',
    padding: 20,
  },
  mockTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  mockText: { color: 'rgba(255,255,255,0.65)', fontSize: 13, lineHeight: 18 },
  primaryButton: {
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontWeight: '600' },
  ghostButton: { paddingVertical: 12, alignItems: 'center' },
  ghostButtonText: { color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
});
