import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon, type AppIconName } from './AppIcon';
import { ThemedText } from './ThemedText';
import { useAppTheme } from '@/theme/ThemeProvider';
import { radius, spacing } from '@/theme/tokens';

const ACTIONS: Array<{ label: string; icon: AppIconName }> = [
  { label: 'Adicionar', icon: 'add' },
  { label: 'Receber', icon: 'receive' },
  { label: 'Enviar', icon: 'send' },
  { label: 'Pagar', icon: 'pay' },
];

export function QuickActions() {
  const { theme } = useAppTheme();

  return (
    <View style={styles.row}>
      {ACTIONS.map((action) => (
        <Pressable key={action.label} style={styles.item}>
          <View style={[styles.button, { backgroundColor: theme.colors.quickActionBg }]}>
            <AppIcon name={action.icon} color={theme.colors.text} size={20} />
          </View>
          <ThemedText variant="caption" muted style={styles.label}>
            {action.label}
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
  },
  item: { alignItems: 'center', flex: 1 },
  button: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  label: { textAlign: 'center' },
});
