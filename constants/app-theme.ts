import { useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const palette = {
  white: '#FFFFFF',
  mist: '#F8FAFC',
  cloud: '#F1F5F9',
  pureBlack: '#000000',
  ink: '#0F172A',
  slate: '#334155',
  muted: '#64748B',
  placeholder: 'rgba(15, 23, 42, 0.35)',
  border: '#E2E8F0',

  monoBlack: '#000000',
  monoWhite: '#FFFFFF',
  monoSoft: '#F1F5F9',
  monoDark: '#1E293B',
  monoGray: '#475569',
  monoLightGray: '#94A3B8',

  amber: '#D97706',
  green: '#15803D',
  red: '#DC2626',

  darkSurface: '#121824',
  darkElevated: '#1E293B',
  darkBorder: '#334155',
};

const lightTheme = {
  palette,
  bg: {
    app: palette.mist,
    card: palette.white,
    surface: palette.cloud,
    elevated: palette.white,
    backdrop: 'rgba(0, 0, 0, 0.45)',
  },
  text: {
    primary: palette.ink,
    secondary: palette.muted,
    muted: palette.slate,
    inverse: palette.white,
    placeholder: palette.placeholder,
  },
  border: { default: palette.border, strong: palette.slate },
  brand: {
    primary: palette.monoBlack,
    primaryDark: palette.monoDark,
    accent: palette.monoDark,
    gradient: [palette.monoBlack, palette.monoDark, palette.monoGray],
  },
  status: {
    success: palette.green,
    warning: palette.amber,
    error: palette.red,
    info: palette.monoDark,
  },
  shadow: 'rgba(15, 23, 42, 0.08)',
  bottomSheet: {
    handle: 'rgba(0, 0, 0, 0.18)',
    backdrop: 'rgba(0, 0, 0, 0.55)',
  },
};

const darkTheme = {
  ...lightTheme,
  bg: {
    app: '#000000',
    card: palette.darkSurface,
    surface: palette.darkElevated,
    elevated: '#1E293B',
    backdrop: 'rgba(0, 0, 0, 0.76)',
  },
  text: {
    primary: palette.cloud,
    secondary: '#94A3B8',
    muted: '#64748B',
    inverse: palette.pureBlack,
    placeholder: 'rgba(255, 255, 255, 0.35)',
  },
  border: {
    default: palette.darkBorder,
    strong: '#475569',
  },
  brand: {
    primary: palette.monoWhite,
    primaryDark: palette.monoLightGray,
    accent: palette.monoLightGray,
    gradient: [palette.monoWhite, palette.monoLightGray, palette.monoGray],
  },
  shadow: 'rgba(0, 0, 0, 0.5)',
  bottomSheet: {
    handle: 'rgba(255, 255, 255, 0.45)',
    backdrop: 'rgba(0, 0, 0, 0.85)',
  },
};

export type AppTheme = typeof lightTheme;

export function useAppTheme() {
  const systemColorScheme = useColorScheme();
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  if (themeMode === 'dark') return darkTheme;
  if (themeMode === 'light') return lightTheme;
  
  return systemColorScheme === 'dark' ? darkTheme : lightTheme;
}

export const appThemes = { light: lightTheme, dark: darkTheme };
