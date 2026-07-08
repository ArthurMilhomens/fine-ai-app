import {
  mapConnection,
  mapInvestmentSummary,
  mapTransactionsResponse,
  unwrapData,
} from '@/api/adapters';

describe('api adapters', () => {
  it('unwraps list responses', () => {
    expect(unwrapData({ data: [{ id: '1' }] })).toEqual([{ id: '1' }]);
  });

  it('maps transaction pagination', () => {
    expect(
      mapTransactionsResponse({
        data: [{ id: 'tx-1' } as never],
        nextCursor: 'cursor-1',
        hasMore: true,
      }),
    ).toEqual({
      items: [{ id: 'tx-1' }],
      nextCursor: 'cursor-1',
      hasMore: true,
    });
  });

  it('maps investment summary with percentages', () => {
    expect(
      mapInvestmentSummary({
        total: 200,
        byCategory: [
          { category: 'EQUITY', value: 50 },
          { category: 'CRYPTO', value: 150 },
        ],
      }),
    ).toEqual({
      totalValue: 200,
      items: [
        { category: 'EQUITY', totalValue: 50, percentage: 25 },
        { category: 'CRYPTO', totalValue: 150, percentage: 75 },
      ],
    });
  });

  it('maps connection institutionId from institution', () => {
    expect(
      mapConnection({
        id: 'conn-1',
        institution: { id: 'inst-1', name: 'Nubank' },
        status: 'CONNECTED',
        createdAt: '2026-01-01T00:00:00.000Z',
      }),
    ).toEqual({
      id: 'conn-1',
      institutionId: 'inst-1',
      institution: { id: 'inst-1', name: 'Nubank' },
      status: 'CONNECTED',
      createdAt: '2026-01-01T00:00:00.000Z',
    });
  });
});
