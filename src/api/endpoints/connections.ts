import { apiRequest } from '../client';
import type { Connection, CreateConnectionResponse, Institution } from '@/types/api';

export const connectionsApi = {
  list: () => apiRequest<Connection[]>('GET', '/connections'),
  get: (id: string) => apiRequest<Connection>('GET', `/connections/${id}`),
  create: (institutionId: string) =>
    apiRequest<CreateConnectionResponse>('POST', '/connections', { institutionId }),
  delete: (id: string) => apiRequest<{ success: boolean }>('DELETE', `/connections/${id}`),
  sync: (id: string) => apiRequest<Connection>('POST', `/connections/${id}/sync`),
  institutions: () => apiRequest<Institution[]>('GET', '/institutions'),
};
