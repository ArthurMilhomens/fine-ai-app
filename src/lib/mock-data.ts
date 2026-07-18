// Dados mock compartilhados do protótipo fine-ai (Lovable)
export const USER = {
  name: 'Alfikri Djati',
  greeting: 'Bom dia',
};

export const BALANCE = {
  available: { integer: '13.984', cents: '73' },
  netWorth: { integer: '245.680', cents: '42' },
  invested: { integer: '198.500', cents: '00' },
  monthSpend: { integer: '8.420', cents: '50' },
  monthIncome: { integer: '12.500', cents: '00' },
  cardLast4: '3493',
  cardBrand: 'Nubank',
};

export type Transaction = {
  id: string;
  title: string;
  account: string;
  date: string;
  amount: number; // positivo receita, negativo despesa
  category: 'income' | 'food' | 'entertainment' | 'invest' | 'transport' | 'shopping';
  status: 'settled' | 'pending';
};

export const TRANSACTIONS: Transaction[] = [
  { id: 't1', title: 'Salário Mensal', account: 'Itaú • Corrente', date: 'Hoje', amount: 8500, category: 'income', status: 'settled' },
  { id: 't2', title: 'Supermercado Extra', account: 'Nubank • Crédito', date: 'Ontem', amount: -342.5, category: 'food', status: 'settled' },
  { id: 't3', title: 'Netflix Premium', account: 'Inter • Débito', date: '12 nov', amount: -55.9, category: 'entertainment', status: 'settled' },
  { id: 't4', title: 'Aporte Tesouro Direto', account: 'XP • Investimentos', date: '10 nov', amount: -2000, category: 'invest', status: 'settled' },
  { id: 't5', title: 'Uber', account: 'Nubank • Crédito', date: '09 nov', amount: -28.4, category: 'transport', status: 'pending' },
  { id: 't6', title: 'Amazon', account: 'Itaú • Crédito', date: '07 nov', amount: -189.9, category: 'shopping', status: 'settled' },
  { id: 't7', title: 'iFood', account: 'Nubank • Crédito', date: '05 nov', amount: -76.3, category: 'food', status: 'settled' },
  { id: 't8', title: 'Reembolso', account: 'Itaú • Corrente', date: '03 nov', amount: 120, category: 'income', status: 'settled' },
];

export type ConnectionStatus = 'connected' | 'syncing' | 'expired' | 'pending' | 'error';

export type Connection = {
  id: string;
  bank: string;
  short: string;
  color: string;
  status: ConnectionStatus;
  lastSync: string;
  accounts: number;
};

export const CONNECTIONS: Connection[] = [
  { id: 'c1', bank: 'Nubank', short: 'NU', color: '#8A05BE', status: 'connected', lastSync: 'há 2 min', accounts: 2 },
  { id: 'c2', bank: 'Itaú Unibanco', short: 'IT', color: '#EC7000', status: 'connected', lastSync: 'há 12 min', accounts: 3 },
  { id: 'c3', bank: 'Banco Inter', short: 'IN', color: '#FF7A00', status: 'expired', lastSync: 'há 3 dias', accounts: 1 },
  { id: 'c4', bank: 'XP Investimentos', short: 'XP', color: '#FFDD00', status: 'syncing', lastSync: 'agora', accounts: 4 },
  { id: 'c5', bank: 'Bradesco', short: 'BR', color: '#CC092F', status: 'error', lastSync: 'há 1 dia', accounts: 1 },
];

export const BANKS_AVAILABLE = [
  { id: 'b1', name: 'Nubank', color: '#8A05BE', short: 'NU' },
  { id: 'b2', name: 'Itaú', color: '#EC7000', short: 'IT' },
  { id: 'b3', name: 'Bradesco', color: '#CC092F', short: 'BR' },
  { id: 'b4', name: 'Banco Inter', color: '#FF7A00', short: 'IN' },
  { id: 'b5', name: 'Santander', color: '#EC0000', short: 'SA' },
  { id: 'b6', name: 'Banco do Brasil', color: '#FFEF00', short: 'BB' },
  { id: 'b7', name: 'Caixa Econômica', color: '#0070AF', short: 'CX' },
  { id: 'b8', name: 'C6 Bank', color: '#242424', short: 'C6' },
  { id: 'b9', name: 'XP Investimentos', color: '#FFDD00', short: 'XP' },
  { id: 'b10', name: 'BTG Pactual', color: '#0F1B2D', short: 'BT' },
];

export const ACCOUNTS = [
  { id: 'a1', bank: 'Itaú', type: 'Corrente', balance: 4820.35 },
  { id: 'a2', bank: 'Nubank', type: 'Conta', balance: 6410.28 },
  { id: 'a3', bank: 'Inter', type: 'Poupança', balance: 2754.1 },
];

export const CARDS = [
  { id: 'cr1', bank: 'Nubank', brand: 'Mastercard', last4: '3493', limit: 12000, used: 3420 },
  { id: 'cr2', bank: 'Itaú', brand: 'Visa Infinite', last4: '8821', limit: 25000, used: 8790 },
  { id: 'cr3', bank: 'Inter', brand: 'Mastercard Black', last4: '5142', limit: 15000, used: 1250 },
];

export const INVESTMENTS = [
  { id: 'i1', name: 'Tesouro IPCA+ 2035', category: 'Renda Fixa', institution: 'XP', value: 82400 },
  { id: 'i2', name: 'CDB Banco Inter', category: 'Renda Fixa', institution: 'Inter', value: 34200 },
  { id: 'i3', name: 'IVVB11', category: 'ETF Internacional', institution: 'XP', value: 42100 },
  { id: 'i4', name: 'BOVA11', category: 'ETF Brasil', institution: 'XP', value: 18400 },
  { id: 'i5', name: 'Fundo Multimercado Verde', category: 'Fundo', institution: 'BTG', value: 21400 },
];

export const CATEGORY_META: Record<Transaction['category'], { label: string; color: string }> = {
  income: { label: 'Receita', color: '#34C759' },
  food: { label: 'Alimentação', color: '#AF52DE' },
  entertainment: { label: 'Lazer', color: '#007AFF' },
  invest: { label: 'Investimento', color: '#34C759' },
  transport: { label: 'Transporte', color: '#FF9500' },
  shopping: { label: 'Compras', color: '#FF3B30' },
};

export function formatBRL(value: number): string {
  const abs = Math.abs(value);
  const formatted = abs.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${value < 0 ? '-' : ''}R$ ${formatted}`;
}
