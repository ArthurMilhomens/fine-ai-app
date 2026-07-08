import { apiRequest } from '../client';
import type { Investment, InvestmentSummary } from '@/types/api';

export const investmentsApi = {
  list: () => apiRequest<Investment[]>('GET', '/investments'),
  summary: () => apiRequest<InvestmentSummary>('GET', '/investments/summary'),
};
