import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';

import { Button } from './Button';
import { ThemedText } from './ThemedText';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <VStack className="items-center p-8" space="sm">
      <ThemedText variant="subtitle">{title}</ThemedText>
      {description ? (
        <ThemedText muted className="text-center">
          {description}
        </ThemedText>
      ) : null}
      {actionLabel && onAction ? (
        <Box className="mt-4 w-full">
          <Button label={actionLabel} onPress={onAction} />
        </Box>
      ) : null}
    </VStack>
  );
}
