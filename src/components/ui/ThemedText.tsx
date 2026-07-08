import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme/tokens';

interface ThemedTextProps extends TextProps {
  variant?: 'display' | 'title' | 'subtitle' | 'body' | 'caption' | 'label';
  muted?: boolean;
}

export function ThemedText({ variant = 'body', muted, style, ...props }: ThemedTextProps) {
  const { theme } = useAppTheme();

  const variantStyle = typography[variant === 'display' ? 'display' : variant] as TextStyle;

  return (
    <Text
      style={[
        variantStyle,
        { color: muted ? theme.colors.textMuted : theme.colors.text },
        style,
      ]}
      {...props}
    />
  );
}

export const errorText = StyleSheet.create({
  text: { color: '#FF3B30' },
});
