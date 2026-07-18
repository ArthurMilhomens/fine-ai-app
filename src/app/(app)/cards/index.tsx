import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/components/AppShell';
import { ListSkeleton } from '@/components/patterns/Skeleton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useCards } from '@/features/cards/useCards';
import { CARD_BRAND_LABELS } from '@/types/labels';
import { useAppTheme } from '@/theme/ThemeProvider';
import type { Theme } from '@/theme/tokens';
import { formatCurrency } from '@/utils/format';

export default function CardsScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const { data, isLoading, isError, refetch, isRefetching } = useCards();
  const cards = data ?? [];

  return (
    <AppShell>
      <ScreenHeader title="Cartões" large />

      {isLoading && !data ? (
        <ListSkeleton rows={3} />
      ) : isError ? (
        <View style={styles.centered}>
          <Text style={styles.empty}>Erro ao carregar cartões.</Text>
          <Pressable onPress={() => refetch()} style={styles.retryButton}>
            <Text style={styles.retryText}>{isRefetching ? 'Carregando…' : 'Tentar de novo'}</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.main}>
          {cards.length === 0 ? (
            <Text style={styles.empty}>
              Nenhum cartão. Conecte um banco via Pluggy para sincronizar.
            </Text>
          ) : (
            cards.map((c) => {
              const limit = c.creditLimit ?? 0;
              const available = c.availableLimit ?? 0;
              const used = Math.max(0, limit - available);
              const pct = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
              return (
                <Pressable
                  key={c.id}
                  onPress={() => router.push(`/(app)/cards/${c.id}` as never)}>
                  <LinearGradient
                    colors={['#8B0000', '#FF8C00']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.card}>
                    <View style={styles.cardTop}>
                      <View>
                        <Text style={styles.cardBank}>{c.institution.name}</Text>
                        <Text style={styles.cardBrand}>
                          {c.name} · {CARD_BRAND_LABELS[c.brand]}
                        </Text>
                      </View>
                      <Text style={styles.cardType}>Crédito</Text>
                    </View>
                    <Text style={styles.cardNumber}>
                      •••• •••• •••• {c.lastFourDigits ?? '----'}
                    </Text>
                    <View style={styles.cardBottom}>
                      <View style={styles.limitRow}>
                        <Text style={styles.limitLabel}>Disponível</Text>
                        <Text style={styles.limitLabel}>{formatCurrency(available)}</Text>
                      </View>
                      <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: `${pct}%` }]} />
                      </View>
                      <Text style={styles.limitTotal}>
                        Limite total: {formatCurrency(limit)}
                      </Text>
                    </View>
                  </LinearGradient>
                </Pressable>
              );
            })
          )}
        </View>
      )}
    </AppShell>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    main: { paddingHorizontal: 24, gap: 16 },
    centered: { paddingVertical: 64, alignItems: 'center', gap: 12 },
    empty: {
      paddingVertical: 48,
      textAlign: 'center',
      fontSize: 14,
      color: theme.colors.textMuted,
    },
    retryButton: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: theme.colors.primary,
    },
    retryText: { color: '#fff', fontWeight: '600', fontSize: 13 },
    card: {
      borderRadius: 24,
      padding: 24,
      overflow: 'hidden',
      shadowColor: '#8B0000',
      shadowOffset: { width: 0, height: 24 },
      shadowOpacity: 0.45,
      shadowRadius: 30,
      elevation: 12,
    },
    cardTop: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    cardBank: {
      fontSize: 10,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 1.2,
      color: 'rgba(255,255,255,0.7)',
    },
    cardBrand: { marginTop: 4, fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
    cardType: {
      fontSize: 10,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 1.2,
      color: 'rgba(255,255,255,0.7)',
    },
    cardNumber: {
      marginTop: 32,
      fontSize: 14,
      letterSpacing: 4,
      color: 'rgba(255,255,255,0.8)',
      fontFamily: 'monospace',
    },
    cardBottom: { marginTop: 24, gap: 8 },
    limitRow: { flexDirection: 'row', justifyContent: 'space-between' },
    limitLabel: {
      fontSize: 11,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      color: 'rgba(255,255,255,0.8)',
    },
    progressTrack: {
      height: 6,
      borderRadius: 999,
      backgroundColor: 'rgba(255,255,255,0.2)',
      overflow: 'hidden',
    },
    progressFill: { height: '100%', backgroundColor: '#FFFFFF' },
    limitTotal: { fontSize: 10, color: 'rgba(255,255,255,0.6)' },
  });
