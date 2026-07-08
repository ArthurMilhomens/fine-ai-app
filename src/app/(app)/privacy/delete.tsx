import { useState } from 'react';
import { Alert, StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScreenLayout } from '@/components/ui/ScreenLayout';
import { ThemedText } from '@/components/ui/ThemedText';
import { useAuth } from '@/auth/useAuth';
import { useDeleteAccount } from '@/features/privacy/usePrivacy';
import { useAppTheme } from '@/theme/ThemeProvider';
import { getApiErrorMessage } from '@/utils/helpers';
import { spacing } from '@/theme/tokens';

export default function DeleteAccountScreen() {
  const { logout } = useAuth();
  const { theme } = useAppTheme();
  const deleteMutation = useDeleteAccount();
  const [confirmed, setConfirmed] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = () => {
    Alert.alert(
      'Excluir conta',
      'Esta ação é irreversível. Todos os seus dados serão removidos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir permanentemente',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync();
              await logout();
            } catch (error) {
              Alert.alert('Erro', getApiErrorMessage(error));
            }
          },
        },
      ],
    );
  };

  return (
    <ScreenLayout>
      <Card>
        <ThemedText variant="label" style={styles.danger}>Excluir conta</ThemedText>
        <ThemedText variant="caption" muted style={styles.text}>
          Para confirmar, digite EXCLUIR e marque a caixa abaixo.
        </ThemedText>
        <TextInput
          placeholder="EXCLUIR"
          placeholderTextColor={theme.colors.textMuted}
          value={confirmText}
          onChangeText={setConfirmText}
          style={[styles.input, { backgroundColor: theme.colors.inputBg, color: theme.colors.text }]}
        />
        <Button
          label={confirmed ? '☑ Confirmo a exclusão' : '☐ Confirmo a exclusão'}
          variant="ghost"
          onPress={() => setConfirmed((v) => !v)}
        />
        <View style={styles.action}>
          <Button
            label="Excluir minha conta"
            variant="danger"
            disabled={!confirmed || confirmText !== 'EXCLUIR'}
            loading={deleteMutation.isPending}
            onPress={handleDelete}
          />
        </View>
      </Card>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  danger: { color: '#FF3B30' },
  text: { marginVertical: spacing.md, lineHeight: 20 },
  input: { borderRadius: 12, padding: spacing.md, marginBottom: spacing.md },
  action: { marginTop: spacing.md },
});
