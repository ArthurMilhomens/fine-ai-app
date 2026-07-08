import { StyleSheet, View } from 'react-native';

import { ThemedText } from './ThemedText';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/tokens';

export function OfflineBanner() {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.banner, { backgroundColor: theme.colors.surfaceElevated }]}>
      <ThemedText variant="caption" style={styles.text}>
        Sem conexão — exibindo últimos dados salvos
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  text: { color: '#FF9500' },
});
