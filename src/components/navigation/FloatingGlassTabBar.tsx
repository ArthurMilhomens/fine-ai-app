import { BlurView } from 'expo-blur';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';

import { AppIcon, CenterTabIcon } from '@/components/ui/AppIcon';
import { ThemedText } from '@/components/ui/ThemedText';
import { useAppTheme } from '@/theme/ThemeProvider';
import { accent, radius, shadows, spacing } from '@/theme/tokens';

const TABS: Array<{
  name: string;
  label: string;
  href: string;
  icon: 'home' | 'transactions' | 'connections' | 'more';
  center?: boolean;
}> = [
  { name: 'index', label: 'Início', href: '/(app)/(tabs)', icon: 'home' },
  { name: 'transactions', label: 'Transações', href: '/(app)/(tabs)/transactions', icon: 'transactions' },
  { name: 'connections', label: 'Conexões', href: '/(app)/(tabs)/connections', icon: 'connections', center: true },
  { name: 'more', label: 'Mais', href: '/(app)/(tabs)/more', icon: 'more' },
];

export function FloatingGlassTabBar() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useAppTheme();

  const isActive = (href: string, name: string) => {
    if (name === 'index') {
      return pathname === '/' || pathname.endsWith('/(tabs)') || !!pathname.match(/\/(tabs)\/?$/);
    }
    return pathname.includes(name);
  };

  return (
    <View style={[styles.wrapper, { bottom: insets.bottom + spacing.md }]} pointerEvents="box-none">
      <BlurView
        intensity={Platform.OS === 'ios' ? 72 : 90}
        tint={theme.dark ? 'dark' : 'light'}
        style={[
          styles.bar,
          {
            backgroundColor: theme.colors.tabBarBg,
            borderColor: theme.colors.tabBarBorder,
          },
        ]}>
        {TABS.map((tab) => {
          const active = isActive(tab.href, tab.name);
          if (tab.center) {
            return (
              <Pressable
                key={tab.name}
                onPress={() => router.push(tab.href as never)}
                style={styles.centerTab}>
                <View style={[styles.centerGlow, shadows.float]}>
                  <View style={styles.centerButton}>
                    <CenterTabIcon active={active} />
                  </View>
                </View>
                <ThemedText
                  variant="caption"
                  style={[styles.centerLabel, active && { color: accent.primary, fontWeight: '600' }]}>
                  {tab.label}
                </ThemedText>
              </Pressable>
            );
          }
          return (
            <Pressable
              key={tab.name}
              onPress={() => router.push(tab.href as never)}
              style={styles.tab}>
              <AppIcon
                name={tab.icon}
                size={22}
                active={active}
                color={active ? theme.colors.tabBarActive : theme.colors.tabBarInactive}
              />
              <ThemedText
                variant="caption"
                style={{
                  color: active ? theme.colors.tabBarActive : theme.colors.tabBarInactive,
                  fontWeight: active ? '600' : '500',
                  marginTop: 4,
                }}>
                {tab.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: spacing.xs },
  centerTab: { flex: 1, alignItems: 'center', marginTop: -22 },
  centerGlow: {
    borderRadius: radius.md,
  },
  centerButton: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: { marginTop: 6 },
});
