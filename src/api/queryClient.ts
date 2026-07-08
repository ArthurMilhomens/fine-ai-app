import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: true,
    },
  },
});

export const queryKeys = {
  dashboard: ['dashboard'] as const,
  accounts: ['accounts'] as const,
  account: (id: string) => ['accounts', id] as const,
  transactions: (filters: Record<string, unknown>) => ['transactions', filters] as const,
  cards: ['cards'] as const,
  card: (id: string) => ['cards', id] as const,
  investments: ['investments'] as const,
  investmentSummary: ['investments', 'summary'] as const,
  connections: ['connections'] as const,
  connection: (id: string) => ['connections', id] as const,
  institutions: ['institutions'] as const,
  consents: ['privacy', 'consents'] as const,
};
