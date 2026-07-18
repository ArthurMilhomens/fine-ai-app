import { useRouter } from 'expo-router';
import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/components/AppShell';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useAuth } from '@/auth/useAuth';
import { useAppTheme } from '@/theme/ThemeProvider';
import type { Theme } from '@/theme/tokens';
import type { ThemePreference } from '@/theme/types';

const THEME_OPTIONS: Array<{ value: ThemePreference; icon: LucideIcon; label: string }> = [
  { value: 'light', icon: Sun, label: 'Claro' },
  { value: 'dark', icon: Moon, label: 'Escuro' },
  { value: 'system', icon: Monitor, label: 'Sistema' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const { theme, preference, setPreference } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <AppShell>
      <ScreenHeader title="Configurações" large />

      <View style={styles.main}>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Conta</Text>
          <Text style={styles.accountEmail}>{user?.email ?? 'alfikri@fine-ai.com'}</Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={[styles.sectionLabel, { marginBottom: 12 }]}>Aparência</Text>
          <View style={styles.themeRow}>
            {THEME_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const active = preference === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => setPreference(opt.value)}
                  style={[styles.themeOption, active ? styles.themeOptionActive : styles.themeOptionInactive]}>
                  <Icon
                    size={16}
                    strokeWidth={2}
                    color={active ? '#FFFFFF' : theme.colors.textMuted}
                  />
                  <Text style={[styles.themeOptionText, active && { color: '#FFFFFF' }]}>
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.linksCard}>
          <Pressable
            onPress={() => router.push('/(app)/privacy')}
            style={[styles.linkRow, { borderBottomWidth: 1, borderBottomColor: theme.colors.border }]}>
            <Text style={styles.linkText}>Privacidade & LGPD</Text>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
          <Pressable onPress={() => logout()} style={styles.linkRow}>
            <Text style={[styles.linkText, { color: theme.colors.destructive }]}>Sair</Text>
          </Pressable>
        </View>
      </View>
    </AppShell>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    main: { paddingHorizontal: 24, gap: 24 },
    sectionCard: {
      gap: 8,
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 16,
    },
    sectionLabel: {
      fontSize: 10,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 1.2,
      color: theme.colors.textMuted,
    },
    accountEmail: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
    themeRow: { flexDirection: 'row', gap: 8 },
    themeOption: {
      flex: 1,
      alignItems: 'center',
      gap: 8,
      borderRadius: 12,
      paddingVertical: 12,
    },
    themeOptionActive: { backgroundColor: theme.colors.primary },
    themeOptionInactive: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    themeOptionText: {
      fontSize: 10,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      color: theme.colors.textMuted,
    },
    linksCard: {
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    linkRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
    },
    linkText: { fontSize: 14, fontWeight: '500', color: theme.colors.text },
    chevron: { fontSize: 16, color: theme.colors.textMuted },
  });
