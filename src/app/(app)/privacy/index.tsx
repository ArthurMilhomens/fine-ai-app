import { useRouter } from 'expo-router';
import { Alert, Pressable, StyleSheet } from 'react-native';

import { Card } from '@/components/ui/Card';
import { ScreenLayout } from '@/components/ui/ScreenLayout';
import { ThemedText } from '@/components/ui/ThemedText';
import { spacing } from '@/theme/tokens';

const PRIVACY_LINKS = [
  { label: 'Exportar meus dados', href: '/(app)/privacy/export' as const, description: 'Baixar cópia dos seus dados (limite 1/h)' },
  { label: 'Histórico de consentimentos', href: '/(app)/privacy/consents' as const, description: 'Ver e revogar consentimentos' },
  { label: 'Excluir conta', href: '/(app)/privacy/delete' as const, description: 'Remover permanentemente sua conta', danger: true },
] as const;

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <ScreenLayout>
      <ThemedText variant="caption" muted style={styles.intro}>
        Gerencie seus dados conforme a LGPD. O fine-ai utiliza Open Finance apenas com seu consentimento explícito.
      </ThemedText>
      {PRIVACY_LINKS.map((link) => (
        <Pressable key={link.label} onPress={() => router.push(link.href as never)}>
          <Card style={styles.item}>
            <ThemedText variant="label" style={'danger' in link && link.danger ? styles.danger : undefined}>{link.label}</ThemedText>
            <ThemedText variant="caption" muted>{link.description}</ThemedText>
          </Card>
        </Pressable>
      ))}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  intro: { marginBottom: spacing.lg, lineHeight: 20 },
  item: { marginBottom: spacing.md },
  danger: { color: '#FF3B30' },
});
