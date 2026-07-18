import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Search, ShieldCheck } from 'lucide-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppShell } from '@/components/AppShell';
import { ListSkeleton, Skeleton } from '@/components/patterns/Skeleton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { PluggyConnectWrapper } from '@/features/connections/PluggyConnectWrapper';
import {
  useActivateConnection,
  useCreateConnection,
  useInstitutions,
} from '@/features/connections/useConnections';
import { useConnectionPolling } from '@/hooks/useConnectionPolling';
import type { Institution } from '@/types/api';
import { useAppTheme } from '@/theme/ThemeProvider';
import type { Theme } from '@/theme/tokens';
import { getApiErrorMessage } from '@/utils/helpers';

type Step = 'consent' | 'banks' | 'widget' | 'success';

const BANK_COLORS = ['#8A05BE', '#EC7000', '#FF7A00', '#CC092F', '#0070AF', '#242424', '#0F1B2D'];

function bankColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash + name.charCodeAt(i)) % BANK_COLORS.length;
  return BANK_COLORS[hash]!;
}

function bankShort(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function sortInstitutions(list: Institution[]): Institution[] {
  return [...list].sort((a, b) => {
    const aSandbox = /pluggy/i.test(a.name) ? 0 : 1;
    const bSandbox = /pluggy/i.test(b.name) ? 0 : 1;
    if (aSandbox !== bSandbox) return aSandbox - bSandbox;
    return a.name.localeCompare(b.name, 'pt-BR');
  });
}

export default function ConnectScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const [step, setStep] = useState<Step>('consent');
  const [selected, setSelected] = useState<Institution | null>(null);
  const [connectToken, setConnectToken] = useState<string | null>(null);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [widgetVisible, setWidgetVisible] = useState(false);
  const [query, setQuery] = useState('');
  const connectionIdRef = useRef<string | null>(null);

  useEffect(() => {
    connectionIdRef.current = connectionId;
  }, [connectionId]);

  const { data: institutions, isLoading, isError, refetch, isRefetching } = useInstitutions();
  const createConnection = useCreateConnection();
  const activateConnection = useActivateConnection();

  const filtered = useMemo(() => {
    const list = sortInstitutions(institutions ?? []);
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((i) => i.name.toLowerCase().includes(q));
  }, [institutions, query]);

  useConnectionPolling({
    connectionId,
    enabled: step === 'widget' && !!connectionId && !widgetVisible,
    onComplete: (connection) => {
      if (connection.status === 'CONNECTED' || connection.status === 'SYNCING') {
        setStep('success');
      }
    },
  });

  const titles: Record<Step, string> = {
    consent: 'Termo de consentimento',
    banks: 'Selecione seu banco',
    widget: `Conectar ${selected?.name ?? ''}`,
    success: 'Conectado com sucesso',
  };

  const handleSelectInstitution = async (institution: Institution) => {
    setSelected(institution);
    setStep('widget');
    try {
      const result = await createConnection.mutateAsync(institution.id);
      connectionIdRef.current = result.connectionId;
      setConnectToken(result.connectToken);
      setConnectionId(result.connectionId);
      setWidgetVisible(true);
    } catch (error) {
      Alert.alert('Erro', getApiErrorMessage(error, 'Não foi possível iniciar a conexão.'));
      setStep('banks');
      setSelected(null);
    }
  };

  const handlePluggySuccess = async (providerConnectionId: string) => {
    setWidgetVisible(false);
    const id = connectionIdRef.current;
    if (!id) {
      Alert.alert('Erro', 'Conexão local não encontrada. Tente novamente.');
      setStep('banks');
      return;
    }
    try {
      await activateConnection.mutateAsync({ id, providerConnectionId });
      setStep('success');
    } catch (error) {
      Alert.alert(
        'Falha ao vincular',
        getApiErrorMessage(
          error,
          'A autenticação no Pluggy funcionou, mas o app não conseguiu ativar a conexão. Tente de novo.',
        ),
      );
      setStep('banks');
    }
  };

  return (
    <AppShell showNav={false}>
      <ScreenHeader title={titles[step]} />

      <View style={styles.main}>
        {step === 'consent' && (
          <View style={{ gap: 24 }}>
            <LinearGradient
              colors={['#8B0000', '#FF8C00']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.consentHero}>
              <ShieldCheck size={32} strokeWidth={1.8} color="#FFFFFF" />
              <Text style={styles.consentHeroText}>
                Ao conectar, você autoriza o fine-ai a acessar dados financeiros exclusivamente
                para agregação Open Finance via Pluggy.
              </Text>
            </LinearGradient>

            <ConsentItem
              title="Finalidade"
              body="Agregação Open Finance (open_finance_aggregation) — leitura de saldos, extratos, cartões e investimentos."
              theme={theme}
            />
            <ConsentItem
              title="Base legal"
              body="Consentimento — LGPD Art. 7º, inciso I. Você pode revogar a qualquer momento."
              theme={theme}
            />
            <ConsentItem
              title="Dados coletados"
              body="Somente leitura. Nunca solicitamos senha, PIN ou realizamos operações em seu nome."
              theme={theme}
            />

            <Text style={styles.legalText}>
              Ao continuar, você concorda com nossa Política de Privacidade e o compartilhamento
              de dados via Open Finance regulado pelo Banco Central.
            </Text>

            <View style={styles.consentActions}>
              <Pressable onPress={() => router.back()} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </Pressable>
              <Pressable onPress={() => setStep('banks')} style={styles.acceptButton}>
                <Text style={styles.acceptText}>Aceito e continuar</Text>
              </Pressable>
            </View>
          </View>
        )}

        {step === 'banks' && (
          <View style={{ gap: 12 }}>
            <View style={styles.searchBox}>
              <Search size={16} color={theme.colors.textMuted} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Buscar banco (ex: Pluggy Bank)"
                placeholderTextColor={theme.colors.textMuted}
                style={styles.searchInput}
                autoCorrect={false}
                autoCapitalize="none"
              />
            </View>

            {isLoading ? (
              <ListSkeleton rows={5} padded={false} />
            ) : isError ? (
              <View style={styles.centered}>
                <Text style={styles.errorText}>Erro ao carregar instituições.</Text>
                <Pressable onPress={() => refetch()} style={styles.acceptButton}>
                  <Text style={styles.acceptText}>
                    {isRefetching ? 'Carregando…' : 'Tentar de novo'}
                  </Text>
                </Pressable>
              </View>
            ) : filtered.length === 0 ? (
              <Text style={styles.errorText}>Nenhum banco encontrado para “{query}”.</Text>
            ) : (
              filtered.map((b) => {
                const color = bankColor(b.name);
                const isPluggy = /pluggy/i.test(b.name);
                return (
                  <Pressable
                    key={b.id}
                    onPress={() => handleSelectInstitution(b)}
                    disabled={createConnection.isPending}
                    style={({ pressed }) => [
                      styles.bankRow,
                      isPluggy && styles.bankRowHighlight,
                      pressed && { transform: [{ scale: 0.99 }] },
                    ]}>
                    <View style={[styles.bankIcon, { backgroundColor: color }]}>
                      <Text style={styles.bankShort}>{bankShort(b.name)}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.bankName}>{b.name}</Text>
                      {isPluggy ? (
                        <Text style={styles.sandboxHint}>Sandbox · ideal para testes</Text>
                      ) : null}
                    </View>
                    <Text style={styles.chevron}>›</Text>
                  </Pressable>
                );
              })
            )}
          </View>
        )}

        {step === 'widget' && selected && (
          <View style={styles.widgetCard}>
            <View style={styles.widgetBody}>
              <View style={[styles.widgetBankIcon, { backgroundColor: bankColor(selected.name) }]}>
                <Text style={styles.widgetBankShort}>{bankShort(selected.name)}</Text>
              </View>
              <Text style={styles.widgetTitle}>
                {createConnection.isPending || activateConnection.isPending
                  ? 'Preparando conexão…'
                  : widgetVisible
                    ? 'Widget Pluggy aberto'
                    : 'Aguardando autenticação Pluggy'}
              </Text>
              <Text style={styles.widgetDesc}>
                {widgetVisible
                  ? `Complete o login do ${selected.name} na janela do Pluggy.`
                  : `Abrindo autenticação segura do ${selected.name}…`}
              </Text>
              <View style={{ width: '100%', gap: 8, alignItems: 'center' }}>
                <Skeleton height={12} width="55%" />
                <Skeleton height={12} width="40%" />
              </View>
              <Pressable
                onPress={() => {
                  setWidgetVisible(false);
                  setStep('banks');
                }}
                style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        )}

        {step === 'success' && (
          <View style={styles.successBody}>
            <View style={styles.successIcon}>
              <ShieldCheck size={40} strokeWidth={1.8} color={theme.colors.success} />
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.successTitle}>Tudo pronto!</Text>
              <Text style={styles.successDesc}>
                {selected?.name} foi conectado. Os dados serão sincronizados via Pluggy.
              </Text>
            </View>
            <Pressable
              onPress={() => router.replace('/(app)/(tabs)')}
              style={[styles.acceptButton, { width: '100%' }]}>
              <Text style={styles.acceptText}>Ir para o Dashboard</Text>
            </Pressable>
          </View>
        )}
      </View>

      <PluggyConnectWrapper
        connectToken={connectToken}
        visible={widgetVisible}
        onSuccess={handlePluggySuccess}
        onError={(error) => {
          setWidgetVisible(false);
          Alert.alert('Erro Pluggy', getApiErrorMessage(error, 'Falha na autenticação.'));
          setStep('banks');
        }}
        onClose={() => {
          setWidgetVisible(false);
          setStep('banks');
        }}
      />
    </AppShell>
  );
}

function ConsentItem({ title, body, theme }: { title: string; body: string; theme: Theme }) {
  const styles = createStyles(theme);
  return (
    <View style={styles.consentItem}>
      <Text style={styles.consentItemTitle}>{title}</Text>
      <Text style={styles.consentItemBody}>{body}</Text>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    main: { paddingHorizontal: 24, paddingBottom: 40 },
    centered: { paddingVertical: 48, alignItems: 'center', gap: 12 },
    errorText: { color: theme.colors.textMuted, fontSize: 14, textAlign: 'center' },
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      borderRadius: 14,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      color: theme.colors.text,
      padding: 0,
    },
    consentHero: {
      borderRadius: 24,
      padding: 24,
      shadowColor: '#8B0000',
      shadowOffset: { width: 0, height: 24 },
      shadowOpacity: 0.45,
      shadowRadius: 30,
      elevation: 12,
    },
    consentHeroText: {
      marginTop: 16,
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 20,
      color: 'rgba(255,255,255,0.9)',
    },
    consentItem: {
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 16,
    },
    consentItemTitle: {
      fontSize: 10,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 1.2,
      color: theme.colors.primary,
    },
    consentItemBody: {
      marginTop: 4,
      fontSize: 12,
      lineHeight: 18,
      color: theme.colors.textMuted,
    },
    legalText: { fontSize: 11, lineHeight: 17, color: theme.colors.textMuted },
    consentActions: { flexDirection: 'row', gap: 12 },
    cancelButton: {
      flex: 1,
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingVertical: 16,
      alignItems: 'center',
    },
    cancelText: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
    acceptButton: {
      flex: 2,
      borderRadius: 16,
      backgroundColor: theme.colors.primary,
      paddingVertical: 16,
      alignItems: 'center',
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.45,
      shadowRadius: 12,
      elevation: 8,
    },
    acceptText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
    bankRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 16,
    },
    bankRowHighlight: {
      borderColor: 'rgba(0,122,255,0.45)',
      backgroundColor: 'rgba(0,122,255,0.08)',
    },
    bankIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bankShort: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
    bankName: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
    sandboxHint: { marginTop: 2, fontSize: 11, color: theme.colors.primary },
    chevron: { fontSize: 18, color: theme.colors.textMuted },
    widgetCard: {
      borderRadius: 24,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 24,
    },
    widgetBody: { alignItems: 'center', gap: 16, paddingVertical: 32 },
    widgetBankIcon: {
      width: 64,
      height: 64,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    widgetBankShort: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
    widgetTitle: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
    widgetDesc: {
      maxWidth: 280,
      textAlign: 'center',
      fontSize: 12,
      lineHeight: 18,
      color: theme.colors.textMuted,
    },
    successBody: { alignItems: 'center', gap: 24, paddingVertical: 40 },
    successIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: 'rgba(52,199,89,0.15)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    successTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.text },
    successDesc: {
      marginTop: 4,
      fontSize: 14,
      color: theme.colors.textMuted,
      textAlign: 'center',
      paddingHorizontal: 16,
    },
  });
