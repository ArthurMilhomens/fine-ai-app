export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

/**
 * Escala de raios do protótipo (--radius: 1rem):
 * sm 12 · md 14 · lg 16 · xl 20 · 2xl 24 · 3xl 28 · 4xl 32
 */
export const radius = {
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  hero: 32,
  pill: 999,
} as const;

export const categoryColors = {
  income: '#34C759',
  food: '#AF52DE',
  entertainment: '#007AFF',
  invest: '#34C759',
  transport: '#FF9500',
  shopping: '#FF3B30',
} as const;

export const gradient = {
  heroStart: '#8B0000',
  heroEnd: '#FF8C00',
  // aliases legados
  cardStart: '#8B0000',
  cardEnd: '#FF8C00',
} as const;

export const accent = {
  primary: '#007AFF',
  primaryGlow: '#4DA3FF',
  success: '#34C759',
  warning: '#FF9500',
  info: '#007AFF',
  catPurple: '#AF52DE',
  error: '#FF3B30',
  destructive: '#FF3B30',
} as const;

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  secondary: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  primaryForeground: string;
  success: string;
  warning: string;
  info: string;
  destructive: string;
  catPurple: string;
  tabBarBg: string;
  tabBarBorder: string;
  tabBarActive: string;
  tabBarInactive: string;
  glassOverlay: string;
  inputBg: string;
  skeleton: string;
  overlay: string;
}

export interface Theme {
  dark: boolean;
  colors: ThemeColors;
}

export const darkTheme: Theme = {
  dark: true,
  colors: {
    background: '#000000',
    surface: '#1A1A1C',
    surfaceElevated: '#1C1C1E',
    secondary: '#1C1C1E',
    text: '#FFFFFF',
    textMuted: '#8E8E93',
    border: 'rgba(255,255,255,0.08)',
    primary: '#007AFF',
    primaryForeground: '#FFFFFF',
    success: '#34C759',
    warning: '#FF9500',
    info: '#007AFF',
    destructive: '#FF3B30',
    catPurple: '#AF52DE',
    tabBarBg: 'rgba(28,28,30,0.72)',
    tabBarBorder: 'rgba(255,255,255,0.10)',
    tabBarActive: '#FFFFFF',
    tabBarInactive: '#8E8E93',
    glassOverlay: 'rgba(255,255,255,0.12)',
    inputBg: '#1A1A1C',
    skeleton: '#2C2C2E',
    overlay: 'rgba(0,0,0,0.6)',
  },
};

export const lightTheme: Theme = {
  dark: false,
  colors: {
    background: '#F2F2F7',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    secondary: '#E5E5EA',
    text: '#000000',
    textMuted: '#8E8E93',
    border: 'rgba(0,0,0,0.08)',
    primary: '#007AFF',
    primaryForeground: '#FFFFFF',
    success: '#34C759',
    warning: '#FF9500',
    info: '#007AFF',
    destructive: '#FF3B30',
    catPurple: '#AF52DE',
    tabBarBg: 'rgba(255,255,255,0.72)',
    tabBarBorder: 'rgba(0,0,0,0.08)',
    tabBarActive: '#000000',
    tabBarInactive: '#8E8E93',
    glassOverlay: 'rgba(255,255,255,0.72)',
    inputBg: '#FFFFFF',
    skeleton: '#E5E5EA',
    overlay: 'rgba(0,0,0,0.4)',
  },
};
