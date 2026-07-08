import { StyleSheet, View, type ViewProps } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';
import { radius, shadows, spacing } from '@/theme/tokens';

interface CardProps extends ViewProps {
  elevated?: boolean;
  compact?: boolean;
}

export function Card({ elevated, compact, style, children, ...props }: CardProps) {
  const { theme } = useAppTheme();

  return (
    <View
      style={[
        styles.card,
        shadows.soft,
        {
          backgroundColor: elevated ? theme.colors.surfaceElevated : theme.colors.surface,
        },
        compact && styles.compact,
        style,
      ]}
      {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  compact: {
    padding: spacing.md,
  },
});
