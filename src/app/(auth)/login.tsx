import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { ThemedText } from '@/components/ui/ThemedText';
import { useAuth } from '@/auth/useAuth';
import { useAppTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme/tokens';

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres').max(128, 'Máximo 128 caracteres'),
});

type FormData = z.infer<typeof schema>;

export default function LoginScreen() {
  const { login } = useAuth();
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
    const result = await login(data.email, data.password);
    if (!result.success) setError(result.message ?? 'Credenciais inválidas');
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <ThemedText variant="title">fine-ai</ThemedText>
        <ThemedText muted style={styles.subtitle}>Suas finanças em um só lugar</ThemedText>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value }, fieldState: { error: fieldError } }) => (
            <View style={styles.field}>
              <TextInput
                placeholder="E-mail"
                placeholderTextColor={theme.colors.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
                value={value}
                onChangeText={onChange}
                style={[styles.input, { backgroundColor: theme.colors.inputBg, color: theme.colors.text }]}
              />
              {fieldError ? <ThemedText variant="caption" style={styles.error}>{fieldError.message}</ThemedText> : null}
            </View>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value }, fieldState: { error: fieldError } }) => (
            <View style={styles.field}>
              <TextInput
                placeholder="Senha"
                placeholderTextColor={theme.colors.textMuted}
                secureTextEntry
                value={value}
                onChangeText={onChange}
                style={[styles.input, { backgroundColor: theme.colors.inputBg, color: theme.colors.text }]}
              />
              {fieldError ? <ThemedText variant="caption" style={styles.error}>{fieldError.message}</ThemedText> : null}
            </View>
          )}
        />

        {error ? <ThemedText variant="caption" style={styles.error}>{error}</ThemedText> : null}

        <Button label="Entrar" onPress={handleSubmit(onSubmit)} loading={loading} />

        <Link href="/(auth)/register" asChild>
          <ThemedText muted style={styles.link}>Criar conta</ThemedText>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  content: { padding: spacing.xl, gap: spacing.md },
  subtitle: { marginBottom: spacing.lg },
  field: { gap: 4 },
  input: { borderRadius: 16, padding: spacing.md, fontSize: 16 },
  error: { color: '#FF3B30' },
  link: { textAlign: 'center', marginTop: spacing.md },
});
