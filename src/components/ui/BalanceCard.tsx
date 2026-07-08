import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppIcon } from './AppIcon';
import { formatCurrency } from '@/utils/format';
import { gradient, radius, spacing } from '@/theme/tokens';

interface BalanceCardProps {
  balance: number;
  currency?: string;
  hidden?: boolean;
  onToggleHidden?: () => void;
  cardholderName?: string;
  lastFour?: string;
  expiry?: string;
}

export function BalanceCard({
  balance,
  currency = 'BRL',
  hidden,
  onToggleHidden,
  cardholderName = 'TITULAR',
  lastFour = '3493',
  expiry = '03/2026',
}: BalanceCardProps) {
  const formatted = formatCurrency(balance, currency);
  const [whole, decimal] = formatted.split(',');

  return (
    <LinearGradient
      colors={[gradient.cardStart, gradient.cardEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label}>Saldo do cartão</Text>
        {onToggleHidden ? (
          <Pressable onPress={onToggleHidden} hitSlop={12}>
            <AppIcon name={hidden ? 'eye-off' : 'eye'} color="rgba(255,255,255,0.9)" size={20} />
          </Pressable>
        ) : null}
      </View>

      <Text style={styles.balance}>
        {hidden ? 'R$ ••••••' : whole}
        {!hidden && decimal ? <Text style={styles.decimal}>,{decimal}</Text> : null}
      </Text>

      <View style={styles.footer}>
        <View style={styles.chipRow}>
          <View style={styles.chip} />
          <View>
            <Text style={styles.cardholder}>{cardholderName.toUpperCase()}</Text>
            <Text style={styles.meta}>{expiry}</Text>
          </View>
        </View>
        <Text style={styles.number}>
          {hidden ? '•••• •••• •••• ••••' : `4688 •••• •••• ${lastFour}`}
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    minHeight: 168,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: { color: 'rgba(255,255,255,0.78)', fontSize: 14, fontWeight: '500' },
  balance: { color: '#FFF', fontSize: 36, fontWeight: '700', marginTop: spacing.sm, letterSpacing: -0.5 },
  decimal: { fontSize: 22, fontWeight: '400', opacity: 0.82 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: spacing.lg,
  },
  chipRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  chip: {
    width: 34,
    height: 26,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  cardholder: { color: '#FFF', fontSize: 12, fontWeight: '700', letterSpacing: 0.8 },
  meta: { color: 'rgba(255,255,255,0.72)', fontSize: 11, marginTop: 2 },
  number: { color: 'rgba(255,255,255,0.92)', fontSize: 13, letterSpacing: 1.2 },
});
