import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon, type AppIconName } from '@/components/ui/AppIcon';
import { Card } from '@/components/ui/Card';
import { ScreenLayout } from '@/components/ui/ScreenLayout';
import { ThemedText } from '@/components/ui/ThemedText';
import { spacing } from '@/theme/tokens';

const MENU_ITEMS: Array<{ label: string; href: string; icon: AppIconName }> = [
  { label: 'Contas', href: '/(app)/accounts', icon: 'accounts' },
  { label: 'Cartões', href: '/(app)/cards', icon: 'cards' },
  { label: 'Investimentos', href: '/(app)/investments', icon: 'investments' },
  { label: 'Configurações', href: '/(app)/settings', icon: 'settings' },
];

export default function MoreScreen() {
  const router = useRouter();

  return (
    <ScreenLayout glow>
      <ThemedText variant="title" style={styles.title}>Mais</ThemedText>
      <View style={styles.grid}>
        {MENU_ITEMS.map((item) => (
          <Pressable key={item.label} onPress={() => router.push(item.href as never)} style={styles.cell}>
            <Card style={styles.menuItem}>
              <View style={styles.iconWrap}>
                <AppIcon name={item.icon} size={26} />
              </View>
              <ThemedText variant="label">{item.label}</ThemedText>
            </Card>
          </Pressable>
        ))}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.sm, marginBottom: spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  cell: { width: '47%' },
  menuItem: { alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.sm },
  iconWrap: { marginBottom: spacing.xs },
});
