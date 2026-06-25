// Centralized Theme Configuration for Rydeu App
// All colors, styles, and conventions should come from this file

export const BRAND_COLORS = {
  primary: '#E31837', // Rydeu Red
  primaryLight: '#FF4D6D',
  primaryDark: '#B0102A',
  secondary: '#0F172A', // Dark Blue
  accent: '#FFB800', // Gold/Yellow
} as const;

export const NEUTRAL_COLORS = {
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
} as const;

export const STATUS_COLORS = {
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 9999,
} as const;

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;

export const FONT_WEIGHTS = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
} as const;

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: BRAND_COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
} as const;

export const SCREEN_CONFIG = {
  headerHeight: 60,
  tabBarHeight: 60,
  bottomSheetClearance: 180,
} as const;

// Theme object for dark/light mode
export const createTheme = (isDark: boolean = false) => ({
  brand: BRAND_COLORS,
  neutral: NEUTRAL_COLORS,
  status: STATUS_COLORS,
  bg: {
    app: isDark ? NEUTRAL_COLORS.black : NEUTRAL_COLORS.white,
    surface: isDark ? NEUTRAL_COLORS.gray800 : NEUTRAL_COLORS.gray50,
    card: isDark ? NEUTRAL_COLORS.gray900 : NEUTRAL_COLORS.white,
  },
  text: {
    primary: isDark ? NEUTRAL_COLORS.white : NEUTRAL_COLORS.gray900,
    secondary: isDark ? NEUTRAL_COLORS.gray400 : NEUTRAL_COLORS.gray500,
    placeholder: isDark ? NEUTRAL_COLORS.gray600 : NEUTRAL_COLORS.gray400,
    inverse: isDark ? NEUTRAL_COLORS.black : NEUTRAL_COLORS.white,
  },
  border: {
    default: isDark ? NEUTRAL_COLORS.gray700 : NEUTRAL_COLORS.gray200,
    light: isDark ? NEUTRAL_COLORS.gray600 : NEUTRAL_COLORS.gray300,
  },
});

export type Theme = ReturnType<typeof createTheme>;
