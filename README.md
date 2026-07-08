# fine-ai

Aplicativo de finanças pessoais em React Native + Expo SDK 56. Consolida contas, transações, cartões e investimentos via Open Finance (API fine-ai).

## Stack

- **Expo SDK 56** + **Expo Router**
- **@expo/ui** (forms/settings) + componentes custom (dashboard financeiro)
- **TanStack Query** + **Axios** (JWT refresh automático)
- **Zustand** + **SecureStore** (auth)
- **react-native-pluggy-connect** (widget Open Finance)

## Requisitos

- Node.js 20+
- Para Pluggy Connect: **development build** (`eas build --profile development`) — não funciona no Expo Go puro

## Setup

```bash
npm install
cp .env.example .env
npm start
```

## Variáveis de ambiente

| Variável | Descrição |
|----------|-----------|
| `EXPO_PUBLIC_API_BASE_URL` | Base da API (`https://api.fine-ai.com/v1`) |
| `EXPO_PUBLIC_USE_MOCKS` | `true` para mocks locais (dev) |
| `EXPO_PUBLIC_PLUGGY_INCLUDE_SANDBOX` | Sandbox Pluggy em dev |

**Nunca** incluir `PLUGGY_CLIENT_SECRET` ou credenciais bancárias no app.

## Scripts

```bash
npm start          # Expo dev server
npm run android    # Android
npm run ios        # iOS (macOS)
npm run typecheck  # TypeScript
npm test           # Jest
```

## EAS Build

```bash
npx eas build --profile development --platform android
npx eas build --profile development --platform ios
```

## Arquitetura

```
src/
├── api/           # HTTP client, mocks, endpoints
├── auth/          # tokens, login, refresh
├── theme/         # light / dark / system
├── features/      # dashboard, connections, privacy...
├── components/    # UI compartilhada + FloatingGlassTabBar
└── app/           # Expo Router (telas)
```

## Regras de negócio

- Patrimônio e agregações vêm **exclusivamente** de `GET /dashboard`
- Pluggy widget usa **apenas** `connectToken` de `POST /connections`
- Nunca abrir `connectUrl` no browser
- Tokens em SecureStore; refresh automático antes de expirar

## Login (modo mock)

Com `EXPO_PUBLIC_USE_MOCKS=true`, use qualquer e-mail válido e senha com 8+ caracteres.

## Temas

Configurações → Aparência: **Claro**, **Escuro** ou **Sistema**.

## LGPD

- Termo de consentimento antes de conectar banco
- Exportar dados, excluir conta, histórico de consentimentos
