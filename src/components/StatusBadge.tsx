import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import type { ConnectionStatus } from '@/types/api';
import { CONNECTION_STATUS_COLORS, CONNECTION_STATUS_LABELS } from '@/types/labels';

export function StatusBadge({ status }: { status: ConnectionStatus }) {
  const color = CONNECTION_STATUS_COLORS[status];
  const label = CONNECTION_STATUS_LABELS[status];
  return (
    <HStack
      className="items-center gap-1.5 rounded-full px-2.5 py-1"
      style={{ backgroundColor: `${color}1A` }}>
      <Box className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      <Text
        className="text-[10px] font-semibold uppercase tracking-wider"
        style={{ color }}>
        {label}
      </Text>
    </HStack>
  );
}
