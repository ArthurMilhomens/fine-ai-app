import { Modal, Platform, StyleSheet, View } from 'react-native';

import { isMockMode } from '@/api/mocks';
import { PLUGGY_INCLUDE_SANDBOX } from '@/api/config';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';

interface PluggyConnectWrapperProps {
  connectToken: string | null;
  visible: boolean;
  onSuccess: () => void;
  onError: (error: unknown) => void;
  onClose: () => void;
}

function MockPluggyWidget({ visible, onSuccess, onClose }: Omit<PluggyConnectWrapperProps, 'connectToken' | 'onError'>) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.mockOverlay}>
        <View style={styles.mockContent}>
          <ThemedText variant="subtitle">Pluggy Connect (Mock)</ThemedText>
          <ThemedText muted style={styles.mockText}>
            Em produção, o widget oficial será exibido aqui com o connectToken da API.
          </ThemedText>
          <Button label="Simular sucesso" onPress={onSuccess} />
          <Button label="Fechar" onPress={onClose} variant="ghost" />
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
  if (!visible || !connectToken) return null;

  if (isMockMode() || Platform.OS === 'web') {
    return <MockPluggyWidget visible={visible} onSuccess={onSuccess} onClose={onClose} />;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PluggyConnect } = require('react-native-pluggy-connect');
    return (
      <PluggyConnect
        connectToken={connectToken}
        includeSandbox={PLUGGY_INCLUDE_SANDBOX || __DEV__}
        onSuccess={onSuccess}
        onError={onError}
        onClose={onClose}
      />
    );
  } catch {
    return <MockPluggyWidget visible={visible} onSuccess={onSuccess} onClose={onClose} />;
  }
}

const styles = StyleSheet.create({
  mockOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 24,
  },
  mockContent: { gap: 16 },
  mockText: { marginVertical: 8 },
});
