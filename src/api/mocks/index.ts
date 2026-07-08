import Constants from 'expo-constants';

import {
  createMockAuthResponse,
  getMockTokens,
  mockAccounts,
  mockCards,
  mockConnections,
  mockConsents,
  mockDashboard,
  mockInstitutions,
  mockInvestments,
  mockInvestmentSummary,
  mockUser,
  paginateTransactions,
  setMockTokens,
} from './fixtures';
import { sleep } from '@/utils/helpers';

const extra = Constants.expoConfig?.extra ?? {};

export function isMockMode(): boolean {
  return extra.useMocks === true || process.env.EXPO_PUBLIC_USE_MOCKS === 'true';
}

type MockHandler = (params?: {
  path?: string;
  method?: string;
  data?: unknown;
  params?: Record<string, string | undefined>;
}) => Promise<unknown>;

const handlers: Record<string, MockHandler> = {
  'POST /auth/login': async (req) => {
    const { email, password } = (req?.data ?? {}) as { email?: string; password?: string };
    if (!email || !password || password.length < 8) {
      throw { error: 'VALIDATION_ERROR', message: 'Dados inválidos' };
    }
    return createMockAuthResponse(email);
  },
  'POST /auth/register': async (req) => {
    const { email, password } = (req?.data ?? {}) as { email?: string; password?: string };
    if (!email || !password || password.length < 8) {
      throw { error: 'VALIDATION_ERROR', message: 'Dados inválidos' };
    }
    return createMockAuthResponse(email);
  },
  'POST /auth/refresh': async () => {
    const tokens = getMockTokens();
    setMockTokens({ ...tokens, accessToken: 'mock-access-token-refreshed' });
    return { accessToken: 'mock-access-token-refreshed', refreshToken: tokens.refreshToken, expiresIn: 900 };
  },
  'POST /auth/logout': async () => ({ success: true }),
  'GET /dashboard': async () => ({ ...mockDashboard, computedAt: new Date().toISOString() }),
  'GET /institutions': async () => mockInstitutions,
  'GET /connections': async () => mockConnections.filter((c) => c.status !== 'DISCONNECTED'),
  'GET /connections/:id': async (req) => {
    const id = req?.path?.split('/').pop();
    const conn = mockConnections.find((c) => c.id === id);
    if (!conn) throw { error: 'NOT_FOUND', message: 'Conexão não encontrada' };
    return conn;
  },
  'POST /connections': async (req) => {
    const { institutionId } = (req?.data ?? {}) as { institutionId?: string };
    if (!institutionId) throw { error: 'VALIDATION_ERROR', message: 'Instituição obrigatória' };
    if (mockConnections.length >= 20) throw { error: 'FORBIDDEN', message: 'Limite de 20 conexões atingido' };
    return {
      connectionId: `conn-new-${Date.now()}`,
      connectToken: 'mock-connect-token',
      connectUrl: 'https://connect.pluggy.ai/mock',
    };
  },
  'DELETE /connections/:id': async () => ({ success: true }),
  'POST /connections/:id/sync': async (req) => {
    const id = req?.path?.split('/')[2];
    const conn = mockConnections.find((c) => c.id === id);
    if (!conn) throw { error: 'NOT_FOUND', message: 'Conexão não encontrada' };
    return { ...conn, status: 'SYNCING' };
  },
  'GET /accounts': async () => mockAccounts,
  'GET /accounts/:id': async (req) => {
    const id = req?.path?.split('/').pop();
    const account = mockAccounts.find((a) => a.id === id);
    if (!account) throw { error: 'NOT_FOUND', message: 'Conta não encontrada' };
    return account;
  },
  'GET /transactions': async (req) => {
    const params = req?.params ?? {};
    return paginateTransactions(params.cursor, params.limit ? parseInt(params.limit, 10) : 20, {
      accountId: params.accountId,
      direction: params.direction as 'IN' | 'OUT' | undefined,
    });
  },
  'GET /cards': async () => mockCards,
  'GET /cards/:id': async (req) => {
    const id = req?.path?.split('/').pop();
    const card = mockCards.find((c) => c.id === id);
    if (!card) throw { error: 'NOT_FOUND', message: 'Cartão não encontrado' };
    return card;
  },
  'GET /investments': async () => mockInvestments,
  'GET /investments/summary': async () => mockInvestmentSummary,
  'GET /privacy/consents': async () => mockConsents,
  'POST /privacy/consents/:id/revoke': async () => ({ success: true }),
  'GET /privacy/export': async () => ({
    exportedAt: new Date().toISOString(),
    data: { user: mockUser, dashboard: mockDashboard },
  }),
  'DELETE /privacy/account': async () => ({ success: true }),
};

function matchRoute(method: string, url: string): { key: string; path: string } | null {
  const path = url.replace(/^\//, '');
  const exact = `${method} /${path}`;
  if (handlers[exact]) return { key: exact, path: `/${path}` };

  for (const key of Object.keys(handlers)) {
    const [m, pattern] = key.split(' ');
    if (m !== method) continue;
    const regex = new RegExp(`^${pattern.replace(/:[^/]+/g, '[^/]+')}$`);
    if (regex.test(`/${path}`)) {
      return { key, path: `/${path}` };
    }
  }
  return null;
}

export async function mockRequest<T>(
  method: string,
  url: string,
  data?: unknown,
  params?: Record<string, string | undefined>,
): Promise<T> {
  await sleep(300);
  const matched = matchRoute(method.toUpperCase(), url);
  if (!matched) {
    throw { error: 'NOT_FOUND', message: `Mock não encontrado: ${method} ${url}` };
  }
  const handler = handlers[matched.key];
  return handler({ path: matched.path, method, data, params }) as Promise<T>;
}
