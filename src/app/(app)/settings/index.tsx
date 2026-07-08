import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { ScreenLayout } from '@/components/ui/ScreenLayout';
import { ThemedText } from '@/components/ui/ThemedText';
import { useAuth } from '@/auth/useAuth';
import { useAppTheme } from '@/theme/ThemeProvider';
import { THEME_PREFERENCE_LABELS, type ThemePreference } from '@/theme/types';
import { spacing } from '@/theme/tokens';

const SETTINGS_LINKS = [
  { label: 'Privacidade e LGPD', href: '/(app)/privacy' },
] as const;

export default function SettingsScreen() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const { preference, setPreference } = useAppTheme();

  const themeOptions: ThemePreference[] = ['system', 'light', 'dark'];

  return (
    <ScreenLayout>
      {user ? (
        <Card style={styles.section}>
          <ThemedText variant="caption" muted>Conta</ThemedText>
          <ThemedText variant="label">{user.email}</ThemedText>
        </Card>
      ) : null}

      <Card style={styles.section}>
        <ThemedText variant="label" style={styles.sectionTitle}>Aparência</ThemedText>
        <View style={styles.themeRow}>
          {themeOptions.map((opt) => (
            <Pressable
              key={opt}
              onPress={() => setPreference(opt)}
              style={[styles.themeOption, preference === opt && styles.themeOptionActive]}>
              <ThemedText variant="caption">{THEME_PREFERENCE_LABELS[opt]}</ThemedText>
            </Pressable>
          ))}
        </View>
      </Card>

      {SETTINGS_LINKS.map((link) => (
        <Pressable key={link.label} onPress={() => router.push(link.href as never)}>
          <Card style={styles.link}>
            <ThemedText variant="label">{link.label}</ThemedText>
          </Card>
        </Pressable>
      ))}

      <Pressable onPress={logout}>
        <Card style={styles.logout}>
          <ThemedText variant="label" style={styles.logoutText}>Sair</ThemedText>
        </Card>
      </Pressable>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: spacing.md },
  sectionTitle: { marginBottom: spacing.md },
  themeRow: { flexDirection: 'row', gap: spacing.sm },
  themeOption: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 20 },
  themeOptionActive: { backgroundColor: '#007AFF33' },
  link: { marginBottom: spacing.sm },
  logout: { marginTop: spacing.lg },
  logoutText: { color: '#FF3B30' },
});
