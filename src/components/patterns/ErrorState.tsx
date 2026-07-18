import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';

import { Button } from './Button';
import { ThemedText } from './ThemedText';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Não foi possível carregar os dados.',
  onRetry,
}: ErrorStateProps) {
  return (
    <VStack className="items-center p-8" space="sm">
      <ThemedText variant="subtitle">Algo deu errado</ThemedText>
      <ThemedText muted className="text-center">
        {message}
      </ThemedText>
      {onRetry ? (
        <Box className="mt-4 w-full">
          <Button label="Tentar novamente" onPress={onRetry} variant="secondary" />
        </Box>
      ) : null}
    </VStack>
  );
}
