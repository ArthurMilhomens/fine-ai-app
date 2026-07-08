import { BlurView } from 'expo-blur';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';

import { useAppTheme } from '@/theme/ThemeProvider';
import { radius, spacing } from '@/theme/tokens';

const TABS: Array<{
  name: string;
  label: string;
  href: string;
  icon: string;
  center?: boolean;
}> = [
  { name: 'index', label: 'Início', href: '/(app)/(tabs)', icon: '🏠' },
  { name: 'transactions', label: 'Transações', href: '/(app)/(tabs)/transactions', icon: '📋' },
  { name: 'connections', label: 'Conexões', href: '/(app)/(tabs)/connections', icon: '🔗', center: true },
  { name: 'more', label: 'Mais', href: '/(app)/(tabs)/more', icon: '☰' },
];

export function FloatingGlassTabBar() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useAppTheme();

  const isActive = (href: string, name: string) => {
    if (name === 'index') {
      return pathname === '/' || pathname.endsWith('/(tabs)') || pathname.match(/\/(tabs)\/?$/);
    }
    return pathname.includes(name);
  };

  return (
    <View style={[styles.wrapper, { bottom: insets.bottom + spacing.md }]} pointerEvents="box-none">
      <BlurView
        intensity={Platform.OS === 'ios' ? 60 : 80}
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
                <View style={styles.centerGlow}>
                  <View style={styles.centerButton}>
                    <Text style={styles.centerIcon}>{tab.icon}</Text>
                  </View>
                </View>
                <Text style={[styles.centerLabel, active && styles.activeLabel]}>{tab.label}</Text>
              </Pressable>
            );
          }
          return (
            <Pressable
              key={tab.name}
              onPress={() => router.push(tab.href as never)}
              style={styles.tab}>
              <Text style={[styles.icon, { opacity: active ? 1 : 0.5 }]}>{tab.icon}</Text>
              <Text
                style={[
                  styles.label,
                  { color: active ? theme.colors.tabBarActive : theme.colors.tabBarInactive },
                ]}>
                {tab.label}
              </Text>
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
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: spacing.xs },
  icon: { fontSize: 20, marginBottom: 2 },
  label: { fontSize: 11, fontWeight: '500' },
  centerTab: { flex: 1, alignItems: 'center', marginTop: -20 },
  centerGlow: {
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  centerButton: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerIcon: { fontSize: 22 },
  centerLabel: { fontSize: 11, marginTop: 4, color: '#8E8E93' },
  activeLabel: { color: '#007AFF', fontWeight: '600' },
});
