import { useRouter } from 'expo-router';
import { Download, FileText, Trash2, type LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/components/AppShell';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useAppTheme } from '@/theme/ThemeProvider';
import type { Theme } from '@/theme/tokens';

export default function PrivacyScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <AppShell>
      <ScreenHeader title="Privacidade" large />

      <View style={styles.main}>
        <Text style={styles.intro}>
          Seus dados são seus. Exerça os direitos garantidos pela LGPD a qualquer momento.
        </Text>

        <PrivacyItem
          icon={Download}
          title="Exportar meus dados"
          desc="Receba uma cópia completa dos seus dados em JSON."
          onPress={() => router.push('/(app)/privacy/export')}
          theme={theme}
        />
        <PrivacyItem
          icon={FileText}
          title="Consentimentos ativos"
          desc="5 bancos autorizados. Revogue individualmente."
          onPress={() => router.push('/(app)/privacy/consents')}
          theme={theme}
        />
        <PrivacyItem
          icon={Trash2}
          title="Excluir minha conta"
          desc="Ação permanente. Requer confirmação."
          destructive
          onPress={() => router.push('/(app)/privacy/delete')}
          theme={theme}
        />
      </View>
    </AppShell>
  );
}

function PrivacyItem({
  icon: Icon,
  title,
  desc,
  destructive = false,
  onPress,
  theme,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  destructive?: boolean;
  onPress: () => void;
  theme: Theme;
}) {
  const styles = createStyles(theme);
  const color = destructive ? theme.colors.destructive : theme.colors.primary;
  return (
    <Pressable onPress={onPress} style={styles.item}>
      <View
        style={[
          styles.itemIcon,
          { backgroundColor: destructive ? 'rgba(255,59,48,0.1)' : 'rgba(0,122,255,0.1)' },
        ]}>
        <Icon size={20} strokeWidth={1.8} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.itemTitle, destructive && { color: theme.colors.destructive }]}>
          {title}
        </Text>
        <Text style={styles.itemDesc}>{desc}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    main: { paddingHorizontal: 24, gap: 12 },
    intro: { fontSize: 14, color: theme.colors.textMuted },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 16,
    },
    itemIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemTitle: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
    itemDesc: { marginTop: 2, fontSize: 11, color: theme.colors.textMuted },
    chevron: { fontSize: 16, color: theme.colors.textMuted },
  });
