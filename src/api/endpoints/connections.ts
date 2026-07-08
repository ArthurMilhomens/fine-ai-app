import { mapConnection, unwrapData } from '../adapters';
import { apiRequest } from '../client';
import type { Connection, CreateConnectionResponse, Institution } from '@/types/api';

type RawConnection = Omit<Connection, 'institutionId'>;

export const connectionsApi = {
  list: async () =>
    unwrapData(await apiRequest<{ data: RawConnection[] }>('GET', '/connections')).map(mapConnection),
  get: async (id: string) => mapConnection(await apiRequest<RawConnection>('GET', `/connections/${id}`)),
  create: (institutionId: string) =>
    apiRequest<CreateConnectionResponse>('POST', '/connections', { institutionId }),
  delete: async (id: string) => {
    await apiRequest<{ message: string }>('DELETE', `/connections/${id}`);
  },
  sync: async (id: string) => {
    await apiRequest<{ message: string }>('POST', `/connections/${id}/sync`);
    return connectionsApi.get(id);
  },
  institutions: async () => unwrapData(await apiRequest<{ data: Institution[] }>('GET', '/institutions')),
};
