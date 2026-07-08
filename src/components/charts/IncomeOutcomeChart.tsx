import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

import { ThemedText } from '@/components/ui/ThemedText';
import { categoryColors } from '@/theme/tokens';
import { spacing } from '@/theme/tokens';

interface BarData {
  label: string;
  income: number;
  outcome: number;
}

interface IncomeOutcomeChartProps {
  data: BarData[];
  maxValue?: number;
}

export function IncomeOutcomeChart({ data, maxValue }: IncomeOutcomeChartProps) {
  const max = maxValue ?? Math.max(...data.flatMap((d) => [d.income, d.outcome]), 1);
  const chartHeight = 120;
  const barWidth = 24;
  const gap = 16;

  return (
    <View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: categoryColors.income }]} />
          <ThemedText variant="caption" muted>Receitas</ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: categoryColors.outcome }]} />
          <ThemedText variant="caption" muted>Despesas</ThemedText>
        </View>
      </View>
      <Svg width={(barWidth + gap) * data.length} height={chartHeight + 24}>
        {data.map((item, index) => {
          const x = index * (barWidth + gap);
          const incomeH = (item.income / max) * chartHeight;
          const outcomeH = (item.outcome / max) * chartHeight;
          return (
            <React.Fragment key={item.label}>
              <Rect
                x={x}
                y={chartHeight - outcomeH}
                width={barWidth / 2 - 2}
                height={outcomeH}
                rx={4}
                fill={categoryColors.outcome}
                opacity={0.5}
              />
              <Rect
                x={x + barWidth / 2}
                y={chartHeight - incomeH}
                width={barWidth / 2 - 2}
                height={incomeH}
                rx={4}
                fill={categoryColors.income}
              />
            </React.Fragment>
          );
        })}
      </Svg>
      <View style={styles.labels}>
        {data.map((item) => (
          <ThemedText key={item.label} variant="caption" muted style={styles.label}>
            {item.label}
          </ThemedText>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  legend: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  labels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm },
  label: { fontSize: 11 },
});
