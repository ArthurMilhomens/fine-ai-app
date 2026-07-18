import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/components/AppShell';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useExportData } from '@/features/privacy/usePrivacy';
import { useAppTheme } from '@/theme/ThemeProvider';
import type { Theme } from '@/theme/tokens';
import { getApiErrorMessage } from '@/utils/helpers';

export default function ExportDataScreen() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const exportMutation = useExportData();

  const handleExport = async () => {
    try {
      const data = await exportMutation.mutateAsync();
      const json = JSON.stringify(data, null, 2);
      const path = `${FileSystem.cacheDirectory}fine-ai-export.json`;
      await FileSystem.writeAsStringAsync(path, json);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(path, { mimeType: 'application/json' });
      } else {
        Alert.alert('Exportado', 'Arquivo salvo com sucesso.');
      }
    } catch (error) {
      Alert.alert(
        'Erro',
        getApiErrorMessage(error, 'Não foi possível exportar. Tente novamente em 1 hora.'),
      );
    }
  };

  return (
    <AppShell showNav={false}>
      <ScreenHeader title="Exportar dados" />
      <View style={styles.main}>
        <View style={styles.card}>
          <Text style={styles.label}>Exportar meus dados</Text>
          <Text style={styles.text}>
            Você receberá um arquivo JSON com seus dados. Limite: 1 exportação por hora.
          </Text>
          <Pressable
            style={[styles.primaryButton, exportMutation.isPending && { opacity: 0.6 }]}
            onPress={handleExport}
            disabled={exportMutation.isPending}>
            <Text style={styles.primaryButtonText}>
              {exportMutation.isPending ? 'Exportando…' : 'Exportar'}
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
    label: { fontSize: 16, fontWeight: '700', color: theme.colors.text },
    text: { fontSize: 14, lineHeight: 20, color: theme.colors.textMuted },
    primaryButton: {
      marginTop: 8,
      borderRadius: 16,
      backgroundColor: theme.colors.primary,
      paddingVertical: 14,
      alignItems: 'center',
    },
    primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  });
