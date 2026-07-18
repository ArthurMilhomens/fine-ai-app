import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAuth } from '@/auth/useAuth';
import { AppShell } from '@/components/AppShell';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useDeleteAccount } from '@/features/privacy/usePrivacy';
import { useAppTheme } from '@/theme/ThemeProvider';
import type { Theme } from '@/theme/tokens';
import { getApiErrorMessage } from '@/utils/helpers';

export default function DeleteAccountScreen() {
  const { logout } = useAuth();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
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

  const canDelete = confirmed && confirmText === 'EXCLUIR' && !deleteMutation.isPending;

  return (
    <AppShell showNav={false}>
      <ScreenHeader title="Excluir conta" />
      <View style={styles.main}>
        <View style={styles.card}>
          <Text style={styles.danger}>Excluir conta</Text>
          <Text style={styles.text}>
            Para confirmar, digite EXCLUIR e marque a confirmação abaixo.
          </Text>
          <TextInput
            placeholder="EXCLUIR"
            placeholderTextColor={theme.colors.textMuted}
            value={confirmText}
            onChangeText={setConfirmText}
            autoCapitalize="characters"
            style={styles.input}
          />
          <Pressable onPress={() => setConfirmed((v) => !v)} style={styles.checkRow}>
            <Text style={styles.checkLabel}>
              {confirmed ? '☑ Confirmo a exclusão' : '☐ Confirmo a exclusão'}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.dangerButton, !canDelete && { opacity: 0.4 }]}
            disabled={!canDelete}
            onPress={handleDelete}>
            <Text style={styles.dangerButtonText}>
              {deleteMutation.isPending ? 'Excluindo…' : 'Excluir minha conta'}
            </Text>
          </Pressable>
        </View>
      </View>
    </AppShell>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    main: { paddingHorizontal: 24 },
    card: {
      gap: 12,
      borderRadius: 24,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 24,
    },
    danger: { fontSize: 16, fontWeight: '700', color: theme.colors.destructive },
    text: { fontSize: 14, lineHeight: 20, color: theme.colors.textMuted },
    input: {
      borderRadius: 12,
      padding: 14,
      backgroundColor: theme.colors.inputBg,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    checkRow: { paddingVertical: 4 },
    checkLabel: { fontSize: 14, color: theme.colors.text },
    dangerButton: {
      marginTop: 8,
      borderRadius: 16,
      backgroundColor: theme.colors.destructive,
      paddingVertical: 14,
      alignItems: 'center',
    },
    dangerButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  });
