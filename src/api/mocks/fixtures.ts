import type {
  Account,
  AuthResponse,
  Card,
  Connection,
  Consent,
  Dashboard,
  Institution,
  Investment,
  InvestmentSummary,
  Transaction,
  TransactionsResponse,
  User,
} from '@/types/api';

export const mockUser: User = {
  id: 'user-1',
  email: 'demo@fine-ai.com',
};

export const mockDashboard: Dashboard = {
  totalNetWorth: 245680.42,
  availableBalance: 13984.73,
  monthlyExpenses: 8420.5,
  monthlyIncome: 12500.0,
  cardCount: 3,
  totalInvested: 198500.0,
  currency: 'BRL',
  computedAt: new Date().toISOString(),
};

export const mockInstitutions: Institution[] = [
  { id: 'inst-nubank', name: 'Nubank', logoUrl: undefined },
  { id: 'inst-itau', name: 'Itaú', logoUrl: undefined },
  { id: 'inst-bradesco', name: 'Bradesco', logoUrl: undefined },
  { id: 'inst-inter', name: 'Inter', logoUrl: undefined },
];

export const mockConnections: Connection[] = [
  {
    id: 'conn-1',
    institutionId: 'inst-nubank',
    institution: mockInstitutions[0],
    status: 'CONNECTED',
    lastSyncAt: new Date(Date.now() - 30 * 60000).toISOString(),
    consentExpiresAt: new Date(Date.now() + 90 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'conn-2',
    institutionId: 'inst-itau',
    institution: mockInstitutions[1],
    status: 'EXPIRED',
    lastSyncAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    consentExpiresAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 180 * 86400000).toISOString(),
  },
];

export const mockAccounts: Account[] = [
  {
    id: 'acc-1',
    name: 'Conta Nubank',
    type: 'CHECKING',
    balance: 13984.73,
    availableBalance: 13984.73,
    currency: 'BRL',
    institution: mockInstitutions[0],
    lastUpdatedAt: new Date().toISOString(),
  },
  {
    id: 'acc-2',
    name: 'Poupança Itaú',
    type: 'SAVINGS',
    balance: 25000.0,
    availableBalance: 25000.0,
    currency: 'BRL',
    institution: mockInstitutions[1],
    lastUpdatedAt: new Date().toISOString(),
  },
];

export const mockTransactions: Transaction[] = Array.from({ length: 40 }, (_, i) => ({
  id: `tx-${i + 1}`,
  description: i % 3 === 0 ? 'Salário' : i % 2 === 0 ? 'Supermercado Extra' : 'Netflix',
  amount: i % 3 === 0 ? 8500 : i % 2 === 0 ? 342.5 : 55.9,
  direction: i % 3 === 0 ? 'IN' : 'OUT',
  category: i % 3 === 0 ? 'Salário' : i % 2 === 0 ? 'Alimentação' : 'Entretenimento',
  status: 'POSTED',
  date: new Date(Date.now() - i * 86400000).toISOString(),
  accountId: i % 2 === 0 ? 'acc-1' : 'acc-2',
  accountName: i % 2 === 0 ? 'Conta Nubank' : 'Poupança Itaú',
}));

export const mockCards: Card[] = [
  {
    id: 'card-1',
    name: 'Nubank Ultravioleta',
    brand: 'MASTERCARD',
    lastFourDigits: '3493',
    creditLimit: 15000,
    availableLimit: 11200,
    institution: mockInstitutions[0],
  },
  {
    id: 'card-2',
    name: 'Itaú Personnalité',
    brand: 'VISA',
    lastFourDigits: '8821',
    creditLimit: 25000,
    availableLimit: 18500,
    institution: mockInstitutions[1],
  },
];

export const mockInvestments: Investment[] = [
  {
    id: 'inv-1',
    name: 'Tesouro Selic 2029',
    category: 'FIXED_INCOME',
    quantity: 100,
    currentValue: 98500,
    institution: mockInstitutions[0],
  },
  {
    id: 'inv-2',
    name: 'PETR4',
    category: 'EQUITY',
    quantity: 500,
    currentValue: 18500,
    institution: mockInstitutions[1],
  },
  {
    id: 'inv-3',
    name: 'Bitcoin',
    category: 'CRYPTO',
    quantity: 0.15,
    currentValue: 81500,
    institution: mockInstitutions[0],
  },
];

export const mockInvestmentSummary: InvestmentSummary = {
  totalValue: 198500,
  items: [
    { category: 'FIXED_INCOME', totalValue: 98500, percentage: 49.6 },
    { category: 'CRYPTO', totalValue: 81500, percentage: 41.1 },
    { category: 'EQUITY', totalValue: 18500, percentage: 9.3 },
  ],
};

export const mockConsents: Consent[] = [
  {
    id: 'consent-1',
    purpose: 'open_finance_aggregation',
    grantedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    connectionId: 'conn-1',
  },
];

let mockTokens = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
};

export function getMockTokens() {
  return mockTokens;
}

export function setMockTokens(tokens: typeof mockTokens) {
  mockTokens = tokens;
}

export function createMockAuthResponse(email = mockUser.email): AuthResponse {
  return {
    ...getMockTokens(),
    expiresIn: 900,
    user: { ...mockUser, email },
  };
}

export function paginateTransactions(
  cursor?: string,
  limit = 20,
  filters?: {
    accountId?: string;
    direction?: 'IN' | 'OUT';
  },
): TransactionsResponse {
  let items = [...mockTransactions];
  if (filters?.accountId) {
    items = items.filter((t) => t.accountId === filters.accountId);
  }
  if (filters?.direction) {
    items = items.filter((t) => t.direction === filters.direction);
  }

  const start = cursor ? parseInt(cursor, 10) : 0;
  const page = items.slice(start, start + limit);
  const nextStart = start + limit;

  return {
    items: page,
    hasMore: nextStart < items.length,
    nextCursor: nextStart < items.length ? String(nextStart) : undefined,
  };
}
