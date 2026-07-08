import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatCurrency } from '@/utils/format';
import { gradient, radius, spacing } from '@/theme/tokens';

interface BalanceCardProps {
  balance: number;
  currency?: string;
  hidden?: boolean;
  onToggleHidden?: () => void;
}

export function BalanceCard({ balance, currency = 'BRL', hidden, onToggleHidden }: BalanceCardProps) {
  const [whole, decimal] = formatCurrency(balance, currency).split(',');

  return (
    <LinearGradient
      colors={[gradient.cardStart, gradient.cardEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label}>Saldo disponível</Text>
        {onToggleHidden ? (
          <Pressable onPress={onToggleHidden}>
            <Text style={styles.eye}>{hidden ? '🙈' : '👁'}</Text>
          </Pressable>
        ) : null}
      </View>
      <Text style={styles.balance}>
        {hidden ? '••••••' : whole}
        {!hidden && <Text style={styles.decimal}>,{decimal}</Text>}
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    minHeight: 140,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  eye: { fontSize: 18 },
  balance: { color: '#FFF', fontSize: 36, fontWeight: '700', marginTop: spacing.sm },
  decimal: { fontSize: 24, fontWeight: '400', opacity: 0.8 },
});
