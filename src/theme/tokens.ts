export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 999,
} as const;

export const categoryColors = {
  investment: '#34C759',
  entertainment: '#007AFF',
  food: '#AF52DE',
  income: '#FF9500',
  outcome: '#8E8E93',
} as const;

export const gradient = {
  cardStart: '#8B0000',
  cardEnd: '#FF8C00',
} as const;

export const accent = {
  primary: '#007AFF',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
} as const;

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  text: string;
  textMuted: string;
  border: string;
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
    surface: '#1A1A1A',
    surfaceElevated: '#1C1C1E',
    text: '#FFFFFF',
    textMuted: '#8E8E93',
    border: 'rgba(255,255,255,0.08)',
    tabBarBg: 'rgba(28,28,30,0.72)',
    tabBarBorder: 'rgba(255,255,255,0.12)',
    tabBarActive: '#FFFFFF',
    tabBarInactive: '#8E8E93',
    glassOverlay: 'rgba(255,255,255,0.12)',
    inputBg: '#1C1C1E',
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
    text: '#000000',
    textMuted: '#8E8E93',
    border: 'rgba(0,0,0,0.08)',
    tabBarBg: 'rgba(255,255,255,0.72)',
    tabBarBorder: 'rgba(0,0,0,0.08)',
    tabBarActive: '#000000',
    tabBarInactive: '#8E8E93',
    glassOverlay: 'rgba(255,255,255,0.72)',
    inputBg: '#F2F2F7',
    skeleton: '#E5E5EA',
    overlay: 'rgba(0,0,0,0.4)',
  },
};
