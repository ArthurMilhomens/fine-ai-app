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

export const typography = {
  display: { fontSize: 34, fontWeight: '700' as const, letterSpacing: -0.5 },
  title: { fontSize: 26, fontWeight: '700' as const, letterSpacing: -0.3 },
  subtitle: { fontSize: 20, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  label: { fontSize: 14, fontWeight: '500' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
  tab: { fontSize: 11, fontWeight: '500' as const },
} as const;

export const categoryColors = {
  investment: '#34C759',
  entertainment: '#007AFF',
  food: '#AF52DE',
  income: '#FF9500',
  outcome: '#636366',
} as const;

export const gradient = {
  cardStart: '#7A0000',
  cardEnd: '#FF8C00',
  backgroundGlow: ['#1a0a00', '#000000', '#000510'] as const,
} as const;

export const accent = {
  primary: '#007AFF',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
} as const;

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  float: {
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
} as const;

export interface ThemeColors {
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceElevated: string;
  surfaceMuted: string;
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
  heroContainer: string;
  quickActionBg: string;
}

export interface Theme {
  dark: boolean;
  colors: ThemeColors;
}

export const darkTheme: Theme = {
  dark: true,
  colors: {
    background: '#000000',
    backgroundSecondary: '#0A0A0A',
    surface: '#141414',
    surfaceElevated: '#1C1C1E',
    surfaceMuted: '#2C2C2E',
    text: '#FFFFFF',
    textMuted: '#8E8E93',
    border: 'rgba(255,255,255,0.06)',
    tabBarBg: 'rgba(22,22,24,0.78)',
    tabBarBorder: 'rgba(255,255,255,0.14)',
    tabBarActive: '#FFFFFF',
    tabBarInactive: '#8E8E93',
    glassOverlay: 'rgba(255,255,255,0.08)',
    inputBg: '#1C1C1E',
    skeleton: '#2C2C2E',
    overlay: 'rgba(0,0,0,0.65)',
    heroContainer: '#0D0D0D',
    quickActionBg: '#1C1C1E',
  },
};

export const lightTheme: Theme = {
  dark: false,
  colors: {
    background: '#F2F2F7',
    backgroundSecondary: '#EAEAEF',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    surfaceMuted: '#E5E5EA',
    text: '#000000',
    textMuted: '#8E8E93',
    border: 'rgba(0,0,0,0.06)',
    tabBarBg: 'rgba(255,255,255,0.82)',
    tabBarBorder: 'rgba(0,0,0,0.08)',
    tabBarActive: '#000000',
    tabBarInactive: '#8E8E93',
    glassOverlay: 'rgba(255,255,255,0.65)',
    inputBg: '#F2F2F7',
    skeleton: '#E5E5EA',
    overlay: 'rgba(0,0,0,0.4)',
    heroContainer: '#FFFFFF',
    quickActionBg: '#F2F2F7',
  },
};
