import { StyleSheet, View } from 'react-native';

import { Button } from './Button';
import { ThemedText } from './ThemedText';
import { spacing } from '@/theme/tokens';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'Não foi possível carregar os dados.', onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <ThemedText variant="subtitle">Algo deu errado</ThemedText>
      <ThemedText muted style={styles.message}>{message}</ThemedText>
      {onRetry ? (
        <View style={styles.action}>
          <Button label="Tentar novamente" onPress={onRetry} variant="secondary" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: spacing.xl },
  message: { marginTop: spacing.sm, textAlign: 'center' },
  action: { marginTop: spacing.lg, width: '100%' },
});
