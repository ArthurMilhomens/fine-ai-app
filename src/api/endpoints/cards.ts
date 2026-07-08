import { unwrapData } from '../adapters';
import { apiRequest } from '../client';
import type { Card } from '@/types/api';

export const cardsApi = {
  list: async () => unwrapData(await apiRequest<{ data: Card[] }>('GET', '/cards')),
  get: (id: string) => apiRequest<Card>('GET', `/cards/${id}`),
};
