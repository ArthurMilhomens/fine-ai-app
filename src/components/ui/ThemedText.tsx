import { StyleSheet, Text, type TextProps } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';

interface ThemedTextProps extends TextProps {
  variant?: 'title' | 'subtitle' | 'body' | 'caption' | 'label';
  muted?: boolean;
}

export function ThemedText({ variant = 'body', muted, style, ...props }: ThemedTextProps) {
  const { theme } = useAppTheme();

  return (
    <Text
      style={[
        styles.base,
        variant === 'title' && styles.title,
        variant === 'subtitle' && styles.subtitle,
        variant === 'caption' && styles.caption,
        variant === 'label' && styles.label,
        { color: muted ? theme.colors.textMuted : theme.colors.text },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: { fontSize: 16 },
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { fontSize: 20, fontWeight: '600' },
  caption: { fontSize: 13 },
  label: { fontSize: 14, fontWeight: '500' },
});
