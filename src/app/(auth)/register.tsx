import { zodResolver } from '@hookform/resolvers/zod';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ThemedText, errorText } from '@/components/ui/ThemedText';
import { useAuth } from '@/auth/useAuth';
import { useAppTheme } from '@/theme/ThemeProvider';
import { gradient, radius, spacing } from '@/theme/tokens';

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres').max(128, 'Máximo 128 caracteres'),
});

type FormData = z.infer<typeof schema>;

export default function RegisterScreen() {
  const { register } = useAuth();
  const { theme } = useAppTheme();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    const result = await register(data.email, data.password);
    if (!result.success) setError(result.message ?? 'Erro ao criar conta');
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={theme.dark ? [gradient.cardStart, 'transparent'] : ['#FFE8D6', 'transparent']}
        style={styles.glow}
      />
      <View style={styles.content}>
        <View style={styles.brand}>
          <ThemedText variant="title">Criar conta</ThemedText>
          <ThemedText muted style={styles.subtitle}>Comece a organizar suas finanças</ThemedText>
        </View>

        <Card style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value }, fieldState: { error: fieldError } }) => (
              <View style={styles.field}>
                <ThemedText variant="caption" muted>E-mail</ThemedText>
                <TextInput
                  placeholder="seu@email.com"
                  placeholderTextColor={theme.colors.textMuted}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={value}
                  onChangeText={onChange}
                  style={[styles.input, { backgroundColor: theme.colors.inputBg, color: theme.colors.text }]}
                />
                {fieldError ? <ThemedText variant="caption" style={errorText.text}>{fieldError.message}</ThemedText> : null}
              </View>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value }, fieldState: { error: fieldError } }) => (
              <View style={styles.field}>
                <ThemedText variant="caption" muted>Senha</ThemedText>
                <TextInput
                  placeholder="Mínimo 8 caracteres"
                  placeholderTextColor={theme.colors.textMuted}
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  style={[styles.input, { backgroundColor: theme.colors.inputBg, color: theme.colors.text }]}
                />
                {fieldError ? <ThemedText variant="caption" style={errorText.text}>{fieldError.message}</ThemedText> : null}
              </View>
            )}
          />

          {error ? <ThemedText variant="caption" style={errorText.text}>{error}</ThemedText> : null}

          <Button label="Cadastrar" onPress={handleSubmit(onSubmit)} loading={loading} />
        </Card>

        <Link href="/(auth)/login" asChild>
          <ThemedText muted style={styles.link}>Já tenho conta</ThemedText>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  glow: { ...StyleSheet.absoluteFill, opacity: 0.35 },
  content: { padding: spacing.xl, gap: spacing.lg },
  brand: { alignItems: 'center', marginBottom: spacing.md },
  subtitle: { marginTop: spacing.xs, textAlign: 'center' },
  form: { gap: spacing.md },
  field: { gap: spacing.xs },
  input: { borderRadius: radius.md, padding: spacing.md, fontSize: 16 },
  link: { textAlign: 'center' },
});
