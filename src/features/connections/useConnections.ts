import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { connectionsApi } from '@/api/endpoints/connections';
import { queryKeys } from '@/api/queryClient';

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
    },
  });
}
