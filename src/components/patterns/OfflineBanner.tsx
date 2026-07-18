import { Box } from '@/components/ui/box';

import { ThemedText } from './ThemedText';

export function OfflineBanner() {
  return (
    <Box className="items-center bg-secondary px-4 py-2">
      <ThemedText variant="caption" className="text-warning">
        Sem conexão — exibindo últimos dados salvos
      </ThemedText>
    </Box>
  );
}
