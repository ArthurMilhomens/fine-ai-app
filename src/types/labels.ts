import type {
  AccountType,
  CardBrand,
  ConnectionStatus,
  InvestmentCategory,
} from './api';

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  CHECKING: 'Conta corrente',
  SAVINGS: 'Poupança',
  CREDIT: 'Crédito',
  INVESTMENT: 'Investimento',
  OTHER: 'Outro',
};

export const CARD_BRAND_LABELS: Record<CardBrand, string> = {
  VISA: 'Visa',
  MASTERCARD: 'Mastercard',
  ELO: 'Elo',
  AMEX: 'Amex',
  OTHER: 'Outro',
};

export const INVESTMENT_CATEGORY_LABELS: Record<InvestmentCategory, string> = {
  FIXED_INCOME: 'Renda fixa',
  EQUITY: 'Ações',
  FUND: 'Fundos',
  ETF: 'ETF',
  CRYPTO: 'Cripto',
  OTHER: 'Outro',
};

export const CONNECTION_STATUS_LABELS: Record<ConnectionStatus, string> = {
  WAITING_CONSENT: 'Aguardando consentimento',
  CONNECTED: 'Conectada',
  SYNCING: 'Sincronizando',
  ERROR: 'Erro',
  EXPIRED: 'Expirada',
  DISCONNECTED: 'Desconectada',
};

export const CONNECTION_STATUS_COLORS: Record<ConnectionStatus, string> = {
  WAITING_CONSENT: '#FF9500',
  CONNECTED: '#34C759',
  SYNCING: '#007AFF',
  ERROR: '#FF3B30',
  EXPIRED: '#FF9500',
  DISCONNECTED: '#8E8E93',
};
