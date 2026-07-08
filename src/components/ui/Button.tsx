import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';
import { radius, spacing } from '@/theme/tokens';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  loading?: boolean;
}

export function Button({ label, onPress, variant = 'primary', disabled, loading }: ButtonProps) {
  const { theme } = useAppTheme();

  const bg =
    variant === 'primary'
      ? '#007AFF'
      : variant === 'danger'
        ? '#FF3B30'
        : variant === 'secondary'
          ? theme.colors.surfaceElevated
          : 'transparent';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: bg,
          opacity: disabled || loading ? 0.5 : pressed ? 0.85 : 1,
          borderColor: variant === 'ghost' ? theme.colors.border : 'transparent',
          borderWidth: variant === 'ghost' ? 1 : 0,
        },
      ]}>
      <Text
        style={[
          styles.label,
          { color: variant === 'secondary' || variant === 'ghost' ? theme.colors.text : '#FFF' },
        ]}>
        {loading ? 'Carregando...' : label}
      </Text>
    </Pressable>
  );
}

export function IconButton({
  icon,
  onPress,
}: {
  icon: React.ReactNode;
  onPress: () => void;
}) {
  const { theme } = useAppTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.iconButton, { backgroundColor: theme.colors.surfaceElevated }]}>
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  label: { fontSize: 16, fontWeight: '600' },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
