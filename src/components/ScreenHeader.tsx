import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';
import type { Theme } from '@/theme/tokens';

interface ScreenHeaderProps {
  title: string;
  /** Larger title used on nested list screens (Contas, Cartões…). */
  large?: boolean;
  onBack?: () => void;
}

/**
 * In-app header aligned with Fine AI shell (no React Navigation header).
 */
export function ScreenHeader({ title, large = false, onBack }: ScreenHeaderProps) {
  const router = useRouter();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.header}>
      <Pressable
        accessibilityLabel="Voltar"
        onPress={onBack ?? (() => router.back())}
        style={styles.backButton}>
        <ArrowLeft size={16} color={theme.colors.text} />
      </Pressable>
      <Text style={[styles.title, large && styles.titleLarge]} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 16,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      flex: 1,
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
    },
    titleLarge: {
      fontSize: 24,
      letterSpacing: -0.4,
    },
  });
