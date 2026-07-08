import { paginateTransactions } from '@/api/mocks/fixtures';

describe('paginateTransactions', () => {
  it('returns first page', () => {
    const result = paginateTransactions(undefined, 10);
    expect(result.items.length).toBeLessThanOrEqual(10);
    expect(result.hasMore).toBeDefined();
  });

  it('filters by direction', () => {
    const result = paginateTransactions(undefined, 50, { direction: 'IN' });
    expect(result.items.every((t) => t.direction === 'IN')).toBe(true);
  });
});
