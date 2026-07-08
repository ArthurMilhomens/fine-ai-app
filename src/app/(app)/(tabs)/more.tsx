import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { ScreenLayout } from '@/components/ui/ScreenLayout';
import { ThemedText } from '@/components/ui/ThemedText';
import { spacing } from '@/theme/tokens';

const MENU_ITEMS = [
  { label: 'Contas', href: '/(app)/accounts', icon: '🏦' },
  { label: 'Cartões', href: '/(app)/cards', icon: '💳' },
  { label: 'Investimentos', href: '/(app)/investments', icon: '📈' },
  { label: 'Configurações', href: '/(app)/settings', icon: '⚙️' },
] as const;

export default function MoreScreen() {
  const router = useRouter();

  return (
    <ScreenLayout>
      <ThemedText variant="title" style={styles.title}>Mais</ThemedText>
      <View style={styles.grid}>
        {MENU_ITEMS.map((item) => (
          <Pressable key={item.label} onPress={() => router.push(item.href as never)}>
            <Card style={styles.menuItem}>
              <ThemedText style={styles.icon}>{item.icon}</ThemedText>
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
  menuItem: { width: 160, alignItems: 'center', paddingVertical: spacing.xl },
  icon: { fontSize: 32, marginBottom: spacing.sm },
});
