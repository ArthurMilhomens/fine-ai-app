import { useQuery } from '@tanstack/react-query';

import { accountsApi } from '@/api/endpoints/accounts';
import { queryKeys } from '@/api/queryClient';

export function useAccounts() {
  return useQuery({
    queryKey: queryKeys.accounts,
    queryFn: () => accountsApi.list(),
  });
}

export function useAccount(id: string) {
  return useQuery({
    queryKey: queryKeys.account(id),
    queryFn: () => accountsApi.get(id),
    enabled: !!id,
  });
}
