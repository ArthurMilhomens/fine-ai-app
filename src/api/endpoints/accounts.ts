import { unwrapData } from '../adapters';
import { apiRequest } from '../client';
import type { Account } from '@/types/api';

export const accountsApi = {
  list: async () => unwrapData(await apiRequest<{ data: Account[] }>('GET', '/accounts')),
  get: (id: string) => apiRequest<Account>('GET', `/accounts/${id}`),
};
