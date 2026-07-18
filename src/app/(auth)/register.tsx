import { zodResolver } from '@hookform/resolvers/zod';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { z } from 'zod';

import { useAuth } from '@/auth/useAuth';
import { useAppTheme } from '@/theme/ThemeProvider';
import type { Theme } from '@/theme/tokens';

const schema = z
  .object({
    email: z.string().email('E-mail inválido'),
    password: z.string().min(8, 'Mínimo 8 caracteres').max(128, 'Máximo 128 caracteres'),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    path: ['confirm'],
    message: 'As senhas não coincidem',
  });

type FormData = z.infer<typeof schema>;

export default function RegisterScreen() {
  const { register } = useAuth();
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const styles = createStyles(theme);

  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', confirm: '' },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    const result = await register(data.email, data.password);
    if (!result.success) setError(result.message ?? 'Erro ao criar conta');
    setLoading(false);
  };

  const fields: Array<{ name: keyof FormData; label: string; placeholder: string; secure: boolean; email?: boolean }> = [
    { name: 'email', label: 'E-mail', placeholder: 'voce@exemplo.com', secure: false, email: true },
    { name: 'password', label: 'Senha', placeholder: 'Mínimo 8 caracteres', secure: true },
    { name: 'confirm', label: 'Confirmar senha', placeholder: 'Repita a senha', secure: true },
  ];

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <View pointerEvents="none" style={styles.ambientGlow} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.root}>
        <ScrollView
          contentContainerStyle={[
            styles.container,
            { paddingTop: insets.top + 64, paddingBottom: insets.bottom + 40 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Logo */}
          <View style={styles.logoRow}>
            <LinearGradient
              colors={['#8B0000', '#FF8C00']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoBox}>
              <Text style={styles.logoLetter}>f</Text>
            </LinearGradient>
            <Text style={styles.logoText}>fine-ai</Text>
          </View>

          <View style={styles.body}>
            <Text style={styles.title}>Criar conta</Text>
            <Text style={styles.subtitle}>Comece a consolidar suas finanças hoje.</Text>

            <View style={styles.form}>
              {fields.map((f) => (
                <Controller
                  key={f.name}
                  control={control}
                  name={f.name}
                  render={({ field: { onChange, value }, fieldState: { error: fieldError } }) => (
                    <View>
                      <Text style={styles.fieldLabel}>{f.label}</Text>
                      <TextInput
                        placeholder={f.placeholder}
                        placeholderTextColor="rgba(142,142,147,0.6)"
                        autoCapitalize="none"
                        keyboardType={f.email ? 'email-address' : 'default'}
                        secureTextEntry={f.secure}
                        value={value}
                        onChangeText={onChange}
                        style={styles.input}
                      />
                      {fieldError ? <Text style={styles.error}>{fieldError.message}</Text> : null}
                    </View>
                  )}
                />
              ))}

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <Pressable
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
                style={({ pressed }) => [styles.submitButton, pressed && { transform: [{ scale: 0.98 }] }]}>
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitText}>Cadastrar</Text>
                )}
              </Pressable>

              <Text style={styles.terms}>
                Ao criar uma conta, você concorda com nossos Termos de Uso e nossa Política de
                Privacidade (LGPD).
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Já tem conta?{' '}
              <Link href="/(auth)/login">
                <Text style={styles.footerLink}>Entrar</Text>
              </Link>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    root: { flex: 1 },
    ambientGlow: {
      position: 'absolute',
      top: -160,
      alignSelf: 'center',
      width: 520,
      height: 520,
      borderRadius: 260,
      backgroundColor: 'rgba(255,149,0,0.06)',
    },
    container: { flexGrow: 1, paddingHorizontal: 24 },
    logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 48 },
    logoBox: {
      width: 40,
      height: 40,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoLetter: { fontSize: 14, fontWeight: '900', color: '#FFFFFF' },
    logoText: {
      fontSize: 18,
      fontWeight: '700',
      fontStyle: 'italic',
      letterSpacing: -0.3,
      color: theme.colors.text,
    },
    body: { flex: 1 },
    title: { fontSize: 30, fontWeight: '700', letterSpacing: -0.5, color: theme.colors.text },
    subtitle: { marginTop: 8, fontSize: 14, color: theme.colors.textMuted },
    form: { marginTop: 40, gap: 16 },
    fieldLabel: {
      fontSize: 12,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      color: theme.colors.textMuted,
    },
    input: {
      marginTop: 8,
      height: 48,
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 16,
      fontSize: 14,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    error: { marginTop: 8, fontSize: 12, fontWeight: '500', color: theme.colors.destructive },
    submitButton: {
      marginTop: 24,
      height: 48,
      borderRadius: 16,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.45,
      shadowRadius: 12,
      elevation: 8,
    },
    submitText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
    terms: {
      marginTop: 16,
      textAlign: 'center',
      fontSize: 11,
      lineHeight: 17,
      color: theme.colors.textMuted,
    },
    footer: { paddingTop: 24 },
    footerText: { textAlign: 'center', fontSize: 14, color: theme.colors.textMuted },
    footerLink: { fontWeight: '600', color: theme.colors.primary },
  });
