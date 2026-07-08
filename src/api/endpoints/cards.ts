import { apiRequest } from '../client';
import type { Card } from '@/types/api';

export const cardsApi = {
  list: () => apiRequest<Card[]>('GET', '/cards'),
  get: (id: string) => apiRequest<Card>('GET', `/cards/${id}`),
};
