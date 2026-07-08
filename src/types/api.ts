export type ConnectionStatus =
  | 'WAITING_CONSENT'
  | 'CONNECTED'
  | 'SYNCING'
  | 'ERROR'
  | 'EXPIRED'
  | 'DISCONNECTED';

export type AccountType = 'CHECKING' | 'SAVINGS' | 'CREDIT' | 'INVESTMENT' | 'OTHER';

export type TransactionDirection = 'IN' | 'OUT';

export type TransactionStatus = 'PENDING' | 'POSTED';

export type CardBrand = 'VISA' | 'MASTERCARD' | 'ELO' | 'AMEX' | 'OTHER';

export type InvestmentCategory =
  | 'FIXED_INCOME'
  | 'EQUITY'
  | 'FUND'
  | 'ETF'
  | 'CRYPTO'
  | 'OTHER';

export interface ApiError {
  error: string;
  message: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

export interface User {
  id: string;
  email: string;
}

export interface AuthResponse extends AuthTokens {
  user: User;
}

export interface Dashboard {
  totalNetWorth: number;
  availableBalance: number;
  monthlyExpenses: number;
  monthlyIncome: number;
  cardCount: number;
  totalInvested: number;
  currency: string;
  computedAt: string;
}

export interface Institution {
  id: string;
  name: string;
  logoUrl?: string;
}

export interface Connection {
  id: string;
  institutionId: string;
  institution: Institution;
  status: ConnectionStatus;
  lastSyncAt?: string;
  consentExpiresAt?: string;
  errorMessage?: string;
  createdAt: string;
}

export interface CreateConnectionResponse {
  connectionId: string;
  connectToken: string;
  connectUrl: string;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  availableBalance: number;
  currency: string;
  institution: Institution;
  lastUpdatedAt: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  direction: TransactionDirection;
  category?: string;
  status: TransactionStatus;
  date: string;
  accountId: string;
  accountName: string;
}

export interface TransactionsResponse {
  items: Transaction[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface Card {
  id: string;
  name: string;
  brand: CardBrand;
  lastFourDigits?: string;
  creditLimit?: number;
  availableLimit?: number;
  institution: Institution;
}

export interface Investment {
  id: string;
  name: string;
  category: InvestmentCategory;
  quantity: number;
  currentValue: number;
  institution: Institution;
}

export interface InvestmentSummaryItem {
  category: InvestmentCategory;
  totalValue: number;
  percentage: number;
}

export interface InvestmentSummary {
  totalValue: number;
  items: InvestmentSummaryItem[];
}

export interface Consent {
  id: string;
  purpose: string;
  grantedAt: string;
  revokedAt?: string;
  connectionId?: string;
}

export interface PrivacyExport {
  exportedAt: string;
  data: Record<string, unknown>;
}
