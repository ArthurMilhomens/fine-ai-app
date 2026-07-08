import type {
  Connection,
  InvestmentCategory,
  InvestmentSummary,
  Transaction,
  TransactionsResponse,
} from '@/types/api';

export function unwrapData<T>(response: { data: T }): T {
  return response.data;
}

export function mapTransactionsResponse(response: {
  data: Transaction[];
  nextCursor?: string | null;
  hasMore: boolean;
}): TransactionsResponse {
  return {
    items: response.data,
    nextCursor: response.nextCursor ?? undefined,
    hasMore: response.hasMore,
  };
}

export function mapInvestmentSummary(response: {
  total: number;
  byCategory: Array<{ category: string; value: number }>;
}): InvestmentSummary {
  const total = response.total;
  return {
    totalValue: total,
    items: response.byCategory.map(({ category, value }) => ({
      category: category as InvestmentCategory,
      totalValue: value,
      percentage: total > 0 ? (value / total) * 100 : 0,
    })),
  };
}

export function mapConnection(connection: Omit<Connection, 'institutionId'> & {
  institution: Connection['institution'];
}): Connection {
  return {
    ...connection,
    institutionId: connection.institution.id,
  };
}
