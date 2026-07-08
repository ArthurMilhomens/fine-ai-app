import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { privacyApi } from '@/api/endpoints/privacy';
import { queryKeys } from '@/api/queryClient';

export function useConsents() {
  return useQuery({
    queryKey: queryKeys.consents,
    queryFn: () => privacyApi.consents(),
  });
}

export function useExportData() {
  return useMutation({
    mutationFn: () => privacyApi.exportData(),
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => privacyApi.deleteAccount(),
    onSuccess: () => queryClient.clear(),
  });
}

export function useRevokeConsent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => privacyApi.revokeConsent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.consents });
      queryClient.invalidateQueries({ queryKey: queryKeys.connections });
    },
  });
}
