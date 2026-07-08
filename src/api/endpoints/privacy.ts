import { apiRequest } from '../client';
import type { Consent, PrivacyExport } from '@/types/api';

export const privacyApi = {
  exportData: () => apiRequest<PrivacyExport>('GET', '/privacy/export'),
  deleteAccount: () => apiRequest<{ success: boolean }>('DELETE', '/privacy/account', { confirm: true }),
  consents: () => apiRequest<Consent[]>('GET', '/privacy/consents'),
  revokeConsent: (id: string) =>
    apiRequest<{ success: boolean }>('POST', `/privacy/consents/${id}/revoke`),
};
