import { StyleSheet, View } from 'react-native';

import { BalanceCard } from './BalanceCard';
import { QuickActions } from './QuickActions';
import { useAppTheme } from '@/theme/ThemeProvider';
import { radius, shadows, spacing } from '@/theme/tokens';

interface WalletHeroProps {
  balance: number;
  currency?: string;
  hidden?: boolean;
  onToggleHidden?: () => void;
}

export function WalletHero({ balance, currency, hidden, onToggleHidden }: WalletHeroProps) {
  const { theme } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        shadows.card,
        { backgroundColor: theme.colors.heroContainer },
      ]}>
      <BalanceCard
        balance={balance}
        currency={currency}
        hidden={hidden}
        onToggleHidden={onToggleHidden}
      />
      <QuickActions />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
});
