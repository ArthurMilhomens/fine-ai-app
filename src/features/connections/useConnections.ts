import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { connectionsApi } from '@/api/endpoints/connections';
import { queryKeys } from '@/api/queryClient';

function invalidateFinancialQueries(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
  void queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
  void queryClient.invalidateQueries({ queryKey: queryKeys.cards });
  void queryClient.invalidateQueries({ queryKey: queryKeys.investments });
  void queryClient.invalidateQueries({ queryKey: queryKeys.transactions({}) });
}

/** Sync/activate enqueue BullMQ jobs; screens need a delayed refetch. */
function scheduleFinancialRefresh(queryClient: ReturnType<typeof useQueryClient>) {
  invalidateFinancialQueries(queryClient);
  setTimeout(() => invalidateFinancialQueries(queryClient), 4000);
  setTimeout(() => invalidateFinancialQueries(queryClient), 10000);
}

export function useConnections() {
  return useQuery({
    queryKey: queryKeys.connections,
    queryFn: () => connectionsApi.list(),
  });
}

export function useConnection(id: string) {
  return useQuery({
    queryKey: queryKeys.connection(id),
    queryFn: () => connectionsApi.get(id),
    enabled: !!id,
  });
}

export function useInstitutions() {
  return useQuery({
    queryKey: queryKeys.institutions,
    queryFn: () => connectionsApi.institutions(),
  });
}

export function useCreateConnection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (institutionId: string) => connectionsApi.create(institutionId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.connections }),
  });
}

export function useDeleteConnection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => connectionsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.connections }),
  });
}

export function useSyncConnection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => connectionsApi.sync(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.connection(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.connections });
      scheduleFinancialRefresh(queryClient);
    },
  });
}

export function useActivateConnection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, providerConnectionId }: { id: string; providerConnectionId: string }) =>
      connectionsApi.activate(id, providerConnectionId),
    onSuccess: (connection) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.connection(connection.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.connections });
      scheduleFinancialRefresh(queryClient);
    },
  });
}
