import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';

interface BadgeProps {
  label: string;
  color?: string;
}

export function Badge({ label, color = '#007AFF' }: BadgeProps) {
  return (
    <Box
      className="self-start rounded-full px-2.5 py-1"
      style={{ backgroundColor: `${color}22` }}>
      <Text className="text-xs font-semibold" style={{ color }}>
        {label}
      </Text>
    </Box>
  );
}
