import { formatCurrency, formatRelativeTime } from '@/utils/format';
import { getApiErrorMessage } from '@/utils/helpers';

describe('formatCurrency', () => {
  it('formats BRL values', () => {
    expect(formatCurrency(13984.73)).toContain('13');
  });
});

describe('formatRelativeTime', () => {
  it('returns Agora for recent dates', () => {
    expect(formatRelativeTime(new Date())).toBe('Agora');
  });
});

describe('getApiErrorMessage', () => {
  it('maps known error codes', () => {
    expect(getApiErrorMessage({ error: 'UNAUTHORIZED', message: 'x' })).toBe('Credenciais inválidas');
  });

  it('uses message from api error', () => {
    expect(getApiErrorMessage({ error: 'CUSTOM', message: 'Custom msg' })).toBe('Custom msg');
  });
});
