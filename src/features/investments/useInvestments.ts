import { useQuery } from '@tanstack/react-query';

import { investmentsApi } from '@/api/endpoints/investments';
import { queryKeys } from '@/api/queryClient';

export function useInvestments() {
  return useQuery({
    queryKey: queryKeys.investments,
    queryFn: () => investmentsApi.list(),
  });
}

export function useInvestmentSummary() {
  return useQuery({
    queryKey: queryKeys.investmentSummary,
    queryFn: () => investmentsApi.summary(),
  });
}
