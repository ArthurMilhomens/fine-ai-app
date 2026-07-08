import { mapInvestmentSummary, unwrapData } from '../adapters';
import { apiRequest } from '../client';
import type { Investment, InvestmentSummary } from '@/types/api';

export const investmentsApi = {
  list: async () => unwrapData(await apiRequest<{ data: Investment[] }>('GET', '/investments')),
  summary: async () =>
    mapInvestmentSummary(
      await apiRequest<{ total: number; byCategory: Array<{ category: string; value: number }> }>(
        'GET',
        '/investments/summary',
      ),
    ),
};
