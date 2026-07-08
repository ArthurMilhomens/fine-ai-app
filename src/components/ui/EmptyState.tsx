import { StyleSheet, View } from 'react-native';

import { Button } from './Button';
import { ThemedText } from './ThemedText';
import { spacing } from '@/theme/tokens';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <ThemedText variant="subtitle">{title}</ThemedText>
      {description ? <ThemedText muted style={styles.description}>{description}</ThemedText> : null}
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <Button label={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: spacing.xl },
  description: { marginTop: spacing.sm, textAlign: 'center' },
  action: { marginTop: spacing.lg, width: '100%' },
});
