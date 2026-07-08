import { useInfiniteQuery } from '@tanstack/react-query';

import { transactionsApi, type TransactionFilters } from '@/api/endpoints/transactions';
import { queryKeys } from '@/api/queryClient';

export function useTransactions(filters: Omit<TransactionFilters, 'cursor'> = {}) {
  return useInfiniteQuery({
    queryKey: queryKeys.transactions(filters),
    queryFn: ({ pageParam }) =>
      transactionsApi.list({ ...filters, cursor: pageParam as string | undefined }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
  });
}
