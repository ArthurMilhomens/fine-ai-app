export type ThemePreference = 'light' | 'dark' | 'system';

export const THEME_PREFERENCE_KEY = 'fine-ai-theme-preference';

export const THEME_PREFERENCE_LABELS: Record<ThemePreference, string> = {
  light: 'Claro',
  dark: 'Escuro',
  system: 'Sistema',
};
