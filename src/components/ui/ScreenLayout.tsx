import { ScrollView, StyleSheet, View, type ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/tokens';

const TAB_BAR_HEIGHT = 100;

interface ScreenLayoutProps extends ScrollViewProps {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
}

export function ScreenLayout({ children, scroll = true, padded = true, ...props }: ScreenLayoutProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const { isOffline } = useNetworkStatus();

  const content = (
    <>
      {isOffline ? <OfflineBanner /> : null}
      <View style={[padded && styles.padded]}>{children}</View>
    </>
  );

  if (!scroll) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background,
            paddingTop: insets.top,
            paddingBottom: TAB_BAR_HEIGHT + insets.bottom,
          },
        ]}>
        {content}
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingBottom: TAB_BAR_HEIGHT + insets.bottom,
      }}
      showsVerticalScrollIndicator={false}
      {...props}>
      {content}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  padded: { paddingHorizontal: spacing.md },
});
