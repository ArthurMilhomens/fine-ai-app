import { apiRequest } from '../client';
import type { Dashboard } from '@/types/api';

export const dashboardApi = {
  get: () => apiRequest<Dashboard>('GET', '/dashboard'),
};
