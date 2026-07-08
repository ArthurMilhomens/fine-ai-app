import { StyleSheet, View } from 'react-native';

import { categoryColors } from '@/theme/tokens';

interface Segment {
  label: string;
  value: number;
  color: string;
}

interface SegmentedProgressBarProps {
  segments: Segment[];
  total: number;
}

export function SegmentedProgressBar({ segments, total }: SegmentedProgressBarProps) {
  return (
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
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    gap: 2,
  },
  segment: { height: '100%', borderRadius: 4 },
});
