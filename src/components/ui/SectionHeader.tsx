import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from './AppIcon';
import { ThemedText } from './ThemedText';
import { spacing } from '@/theme/tokens';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <ThemedText variant="label">{title}</ThemedText>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} style={styles.action}>
          <ThemedText variant="caption" muted>{actionLabel}</ThemedText>
          <AppIcon name="chevron-forward" size={14} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  action: { flexDirection: 'row', alignItems: 'center', gap: 2 },
});
