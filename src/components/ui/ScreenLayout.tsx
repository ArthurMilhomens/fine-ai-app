import { ScrollView, StyleSheet, View, type ScrollViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/tokens';

const TAB_BAR_HEIGHT = 108;

interface ScreenLayoutProps extends ScrollViewProps {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  glow?: boolean;
}

export function ScreenLayout({
  children,
  scroll = true,
  padded = true,
  glow = false,
  ...props
}: ScreenLayoutProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const { isOffline } = useNetworkStatus();

  const content = (
    <>
      {isOffline ? <OfflineBanner /> : null}
      <View style={[padded && styles.padded]}>{children}</View>
    </>
  );

  const background = (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.background }]}>
      {glow && theme.dark ? (
        <LinearGradient
          colors={['rgba(122,0,0,0.18)', 'transparent', 'rgba(0,80,255,0.08)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
    </View>
  );

  if (!scroll) {
    return (
      <View style={styles.container}>
        {background}
        <View
          style={{
            flex: 1,
            paddingTop: insets.top,
            paddingBottom: TAB_BAR_HEIGHT + insets.bottom,
          }}>
          {content}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {background}
      <ScrollView
        style={styles.flex}
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingBottom: TAB_BAR_HEIGHT + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
        {...props}>
        {content}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  padded: { paddingHorizontal: spacing.md },
});
