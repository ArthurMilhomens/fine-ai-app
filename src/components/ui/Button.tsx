import { Pressable, StyleSheet, Text } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';
import { accent, radius, shadows, spacing } from '@/theme/tokens';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  fullWidth = true,
}: ButtonProps) {
  const { theme } = useAppTheme();

  const bg =
    variant === 'primary'
      ? accent.primary
      : variant === 'danger'
        ? accent.error
        : variant === 'secondary'
          ? theme.colors.surfaceElevated
          : 'transparent';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        fullWidth && styles.fullWidth,
        variant === 'primary' && shadows.soft,
        {
          backgroundColor: bg,
          opacity: disabled || loading ? 0.5 : pressed ? 0.88 : 1,
          borderColor: variant === 'ghost' ? theme.colors.border : 'transparent',
          borderWidth: variant === 'ghost' ? StyleSheet.hairlineWidth : 0,
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
    paddingVertical: 15,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  fullWidth: { width: '100%' },
  label: { fontSize: 16, fontWeight: '600' },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
