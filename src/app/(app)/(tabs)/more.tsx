import { useRouter } from 'expo-router';
import {
  CreditCard,
  LogOut,
  PiggyBank,
  Settings,
  Shield,
  Wallet2,
  type LucideIcon,
} from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/components/AppShell';
import { useAuth } from '@/auth/useAuth';
import { useAppTheme } from '@/theme/ThemeProvider';
import type { Theme } from '@/theme/tokens';

const ITEMS: Array<{ href: string; icon: LucideIcon; label: string; desc: string }> = [
  { href: '/(app)/accounts', icon: Wallet2, label: 'Contas', desc: 'Corrente e poupança' },
  { href: '/(app)/cards', icon: CreditCard, label: 'Cartões', desc: 'Crédito e débito' },
  { href: '/(app)/investments', icon: PiggyBank, label: 'Investimentos', desc: 'Renda fixa, ETFs, fundos' },
  { href: '/(app)/settings', icon: Settings, label: 'Configurações', desc: 'Tema, conta, notificações' },
];

export default function MoreScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <AppShell>
      <View style={styles.header}>
        <Text style={styles.title}>Mais</Text>
      </View>

      <View style={styles.main}>
        <View style={styles.grid}>
          {ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Pressable
                key={item.href}
                onPress={() => router.push(item.href as never)}
                style={({ pressed }) => [styles.gridItem, pressed && { transform: [{ scale: 0.98 }] }]}>
                <View style={styles.gridIcon}>
                  <Icon size={20} strokeWidth={2} color={theme.colors.primary} />
                </View>
                <View>
                  <Text style={styles.gridLabel}>{item.label}</Text>
                  <Text style={styles.gridDesc}>{item.desc}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.listCard}>
          <Pressable
            onPress={() => router.push('/(app)/privacy')}
            style={styles.listItem}>
            <Shield size={16} strokeWidth={1.8} color={theme.colors.textMuted} />
            <Text style={styles.listItemText}>Privacidade & LGPD</Text>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
          <Pressable onPress={() => logout()} style={styles.listItem}>
            <LogOut size={16} strokeWidth={1.8} color={theme.colors.destructive} />
            <Text style={[styles.listItemText, { color: theme.colors.destructive }]}>Sair</Text>
          </Pressable>
        </View>

        <Text style={styles.version}>fine-ai · v1.0.0</Text>
      </View>
    </AppShell>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    header: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 },
    title: { fontSize: 24, fontWeight: '700', letterSpacing: -0.4, color: theme.colors.text },
    main: { paddingHorizontal: 24, gap: 24 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    gridItem: {
      width: '48%',
      flexGrow: 1,
      gap: 12,
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 20,
    },
    gridIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: 'rgba(0,122,255,0.1)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    gridLabel: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
    gridDesc: { marginTop: 2, fontSize: 11, color: theme.colors.textMuted },
    listCard: {
      gap: 8,
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 8,
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      borderRadius: 12,
      padding: 12,
    },
    listItemText: { flex: 1, fontSize: 14, fontWeight: '500', color: theme.colors.text },
    chevron: { fontSize: 16, color: theme.colors.textMuted },
    version: {
      paddingTop: 8,
      textAlign: 'center',
      fontSize: 10,
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: 1.2,
      color: 'rgba(142,142,147,0.6)',
    },
  });
