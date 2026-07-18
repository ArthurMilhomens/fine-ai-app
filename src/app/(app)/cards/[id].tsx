import { useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/components/AppShell';
import { DetailSkeleton } from '@/components/patterns/Skeleton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useCard } from '@/features/cards/useCards';
import { CARD_BRAND_LABELS } from '@/types/labels';
import { useAppTheme } from '@/theme/ThemeProvider';
import type { Theme } from '@/theme/tokens';
import { formatCurrency, maskCardNumber } from '@/utils/format';

export default function CardDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const { data, isLoading, isError, refetch } = useCard(id);

  return (
    <AppShell showNav={false}>
      <ScreenHeader title="Detalhe do cartão" />

      {isLoading && !data ? (
        <DetailSkeleton />
      ) : isError || !data ? (
        <View style={styles.centered}>
          <Text style={styles.empty}>Não foi possível carregar o cartão.</Text>
          <Pressable onPress={() => refetch()} style={styles.retryButton}>
            <Text style={styles.retryText}>Tentar de novo</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.main}>
          <View style={styles.card}>
            <Text style={styles.name}>{data.name}</Text>
            <Text style={styles.caption}>
              {CARD_BRAND_LABELS[data.brand]} · {data.institution.name}
            </Text>
            <Text style={styles.number}>{maskCardNumber(data.lastFourDigits)}</Text>
            {data.creditLimit != null ? (
              <Text style={styles.body}>Limite: {formatCurrency(data.creditLimit)}</Text>
            ) : null}
            {data.availableLimit != null ? (
              <Text style={styles.caption}>Disponível: {formatCurrency(data.availableLimit)}</Text>
            ) : null}
          </View>
        </View>
      )}
    </AppShell>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    centered: { paddingVertical: 64, alignItems: 'center', gap: 12 },
    empty: { fontSize: 14, color: theme.colors.textMuted, textAlign: 'center' },
    retryButton: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: theme.colors.primary,
    },
    retryText: { color: '#fff', fontWeight: '600', fontSize: 13 },
    main: { paddingHorizontal: 24 },
    card: {
      gap: 8,
      borderRadius: 24,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 24,
    },
    name: { fontSize: 20, fontWeight: '700', color: theme.colors.text },
    caption: { fontSize: 13, color: theme.colors.textMuted },
    body: { fontSize: 15, color: theme.colors.text, marginTop: 8 },
    number: {
      marginVertical: 16,
      fontSize: 22,
      fontWeight: '600',
      letterSpacing: 2,
      color: theme.colors.text,
    },
  });
