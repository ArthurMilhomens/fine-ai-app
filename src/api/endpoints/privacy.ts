import { unwrapData } from '../adapters';
import { apiRequest } from '../client';
import type { Consent, PrivacyExport } from '@/types/api';

export const privacyApi = {
  exportData: () => apiRequest<PrivacyExport>('GET', '/privacy/export'),
  deleteAccount: async () => {
    await apiRequest<{ message: string }>('DELETE', '/privacy/account', { confirm: true });
  },
  consents: async () => unwrapData(await apiRequest<{ data: Consent[] }>('GET', '/privacy/consents')),
  revokeConsent: async (id: string) => {
    await apiRequest<{ message: string }>('POST', `/privacy/consents/${id}/revoke`);
  },
};
