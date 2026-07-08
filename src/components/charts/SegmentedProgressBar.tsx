import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ui/ThemedText';
import { categoryColors } from '@/theme/tokens';
import { spacing } from '@/theme/tokens';

interface Segment {
  label: string;
  value: number;
  color: string;
}

interface SegmentedProgressBarProps {
  segments: Segment[];
  total: number;
  showLegend?: boolean;
}

export function SegmentedProgressBar({ segments, total, showLegend = true }: SegmentedProgressBarProps) {
  return (
    <View>
      <View style={styles.container}>
        {segments.map((segment) => {
          const widthPercent = total > 0 ? (segment.value / total) * 100 : 0;
          if (widthPercent <= 0) return null;
          return (
            <View
              key={segment.label}
              style={[styles.segment, { width: `${widthPercent}%`, backgroundColor: segment.color }]}
            />
          );
        })}
      </View>
      {showLegend ? (
        <View style={styles.legend}>
          {segments.map((segment) => (
            <View key={segment.label} style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: segment.color }]} />
              <ThemedText variant="caption" muted>{segment.label}</ThemedText>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

export const defaultSpendingSegments = (expenses: number) => [
  { label: 'Investimento', value: expenses * 0.4, color: categoryColors.investment },
  { label: 'Entretenimento', value: expenses * 0.35, color: categoryColors.entertainment },
  { label: 'Alimentação', value: expenses * 0.25, color: categoryColors.food },
];

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    gap: 3,
  },
  segment: { height: '100%', borderRadius: 5 },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
