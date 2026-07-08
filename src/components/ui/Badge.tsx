import { StyleSheet, Text, View } from 'react-native';

import { radius } from '@/theme/tokens';

interface BadgeProps {
  label: string;
  color?: string;
}

export function Badge({ label, color = '#007AFF' }: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: `${color}22` }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  text: { fontSize: 12, fontWeight: '600' },
});
