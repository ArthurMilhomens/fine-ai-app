import { apiRequest } from '../client';
import type { Account } from '@/types/api';

export const accountsApi = {
  list: () => apiRequest<Account[]>('GET', '/accounts'),
  get: (id: string) => apiRequest<Account>('GET', `/accounts/${id}`),
};
