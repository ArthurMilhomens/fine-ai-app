import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Alert, StyleSheet } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScreenLayout } from '@/components/ui/ScreenLayout';
import { ThemedText } from '@/components/ui/ThemedText';
import { useExportData } from '@/features/privacy/usePrivacy';
import { getApiErrorMessage } from '@/utils/helpers';
import { spacing } from '@/theme/tokens';

export default function ExportDataScreen() {
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
      Alert.alert('Erro', getApiErrorMessage(error, 'Não foi possível exportar. Tente novamente em 1 hora.'));
    }
  };

  return (
    <ScreenLayout>
      <Card>
        <ThemedText variant="label">Exportar meus dados</ThemedText>
        <ThemedText variant="caption" muted style={styles.text}>
          Você receberá um arquivo JSON com seus dados. Limite: 1 exportação por hora.
        </ThemedText>
        <Button label="Exportar" onPress={handleExport} loading={exportMutation.isPending} />
      </Card>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  text: { marginVertical: spacing.md, lineHeight: 20 },
});
