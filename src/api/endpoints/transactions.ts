import { apiRequest } from '../client';
import type { TransactionsResponse, TransactionDirection } from '@/types/api';

export interface TransactionFilters {
  accountId?: string;
  from?: string;
  to?: string;
  category?: string;
  direction?: TransactionDirection;
  minAmount?: number;
  maxAmount?: number;
  cursor?: string;
  limit?: number;
  sort?: string;
}

export const transactionsApi = {
  list: (filters: TransactionFilters = {}) =>
    apiRequest<TransactionsResponse>('GET', '/transactions', undefined, {
      accountId: filters.accountId,
      from: filters.from,
      to: filters.to,
      category: filters.category,
      direction: filters.direction,
      minAmount: filters.minAmount?.toString(),
      maxAmount: filters.maxAmount?.toString(),
      cursor: filters.cursor,
      limit: filters.limit?.toString() ?? '20',
      sort: filters.sort ?? 'date:desc',
    }),
};
