import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/tokens';

export function Skeleton({ height = 16, width = '100%' as number | `${number}%` | '100%' }) {
  const { theme } = useAppTheme();
  return (
    <View
      style={[
        styles.skeleton,
        { height, width, backgroundColor: theme.colors.skeleton },
      ]}
    />
  );
}

export function LoadingScreen() {
  const { theme } = useAppTheme();
  return (
    <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: { borderRadius: radius.sm, marginBottom: 8 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
