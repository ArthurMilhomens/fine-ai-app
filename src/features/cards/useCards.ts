import { useQuery } from '@tanstack/react-query';

import { cardsApi } from '@/api/endpoints/cards';
import { queryKeys } from '@/api/queryClient';

export function useCards() {
  return useQuery({
    queryKey: queryKeys.cards,
    queryFn: () => cardsApi.list(),
  });
}

export function useCard(id: string) {
  return useQuery({
    queryKey: queryKeys.card(id),
    queryFn: () => cardsApi.get(id),
    enabled: !!id,
  });
}
