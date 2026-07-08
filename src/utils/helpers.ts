import type { ApiError } from '@/types/api';

const ERROR_MESSAGES: Record<string, string> = {
  UNAUTHORIZED: 'Credenciais inválidas',
  NOT_FOUND: 'Recurso não encontrado',
  VALIDATION_ERROR: 'Dados inválidos. Verifique os campos.',
  CONFLICT: 'Este recurso já existe',
  FORBIDDEN: 'Você não tem permissão para esta ação',
  TOO_MANY_REQUESTS: 'Muitas tentativas. Tente novamente mais tarde.',
};

export function getApiErrorMessage(error: unknown, fallback = 'Ocorreu um erro'): string {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const apiError = error as ApiError;
    if (apiError.error && ERROR_MESSAGES[apiError.error]) {
      return ERROR_MESSAGES[apiError.error];
    }
    if (typeof apiError.message === 'string' && apiError.message.length > 0) {
      return apiError.message;
    }
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
