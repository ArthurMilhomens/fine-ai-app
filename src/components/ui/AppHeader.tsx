import { StyleSheet, View } from 'react-native';

import { AppIcon } from './AppIcon';
import { IconButton } from './Button';
import { ThemedText } from './ThemedText';
import { useAuthStore } from '@/auth/authStore';
import { useAppTheme } from '@/theme/ThemeProvider';
import { radius, spacing } from '@/theme/tokens';

interface AppHeaderProps {
  subtitle?: string;
}

export function AppHeader({ subtitle }: AppHeaderProps) {
  const { theme } = useAppTheme();
  const user = useAuthStore((s) => s.user);
  const initial = (user?.email?.[0] ?? 'U').toUpperCase();

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <View style={[styles.avatar, { backgroundColor: theme.colors.surfaceElevated }]}>
          <ThemedText variant="label">{initial}</ThemedText>
        </View>
        <View>
          <ThemedText variant="caption" muted>Olá,</ThemedText>
          <ThemedText variant="subtitle" style={styles.name}>
            {user?.email?.split('@')[0] ?? 'Usuário'}
          </ThemedText>
          {subtitle ? (
            <ThemedText variant="caption" muted>{subtitle}</ThemedText>
          ) : null}
        </View>
      </View>
      <View style={styles.actions}>
        <IconButton icon={<AppIcon name="scan" color={theme.colors.text} />} onPress={() => {}} />
        <View>
          <IconButton icon={<AppIcon name="bell" color={theme.colors.text} />} onPress={() => {}} />
          <View style={styles.dot} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { textTransform: 'capitalize' },
  actions: { flexDirection: 'row', gap: spacing.sm },
  dot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
});
