import { useColorScheme } from 'react-native';

const palette = {
  white: '#FFFFFF',
  mist: '#F4F7F9',
  cloud: '#E8EEF2',
  pureBlack: '#000000',
  ink: '#111827',
  slate: '#334155',
  muted: '#64748B',
  placeholder: 'rgba(51, 65, 85, 0.42)',
  border: '#D9E2E8',
  teal: '#0F766E',
  tealBright: '#14B8A6',
  tealSoft: '#E0F2F1',
  blue: '#153E75',
  sky: '#DFF2FF',
  coral: '#E85D3F',
  amber: '#F2A93B',
  green: '#138167',
  red: '#D64550',
  darkSurface: '#17212B',
  darkElevated: '#202C38',
  darkBorder: '#334455',
  transparent: '#00000000',
};

const lightTheme = {
  palette,
  bg: {
    app: palette.mist,
    card: palette.white,
    surface: palette.cloud,
    elevated: palette.white,
    backdrop: 'rgba(0, 0, 0, 0.35)',
  },
  text: {
    primary: palette.ink,
    secondary: palette.muted,
    muted: palette.slate,
    inverse: palette.white,
    placeholder: palette.placeholder,
  },
  border: {
    default: palette.border,
    strong: palette.slate,
  },
  brand: {
    primary: palette.teal,
    primaryDark: palette.blue,
    accent: palette.coral,
    gradient: [palette.blue, palette.teal, palette.coral],
  },
  status: {
    success: palette.green,
    warning: palette.amber,
    error: palette.red,
    info: palette.blue,
  },
  shadow: 'rgba(17, 24, 39, 0.16)',
  bottomSheet: {
    handle: 'rgba(0, 0, 0, 0.24)',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
};

const darkTheme = {
  ...lightTheme,
  bg: {
    app: '#0C1218',
    card: palette.darkSurface,
    surface: palette.darkElevated,
    elevated: '#243240',
    backdrop: 'rgba(0, 0, 0, 0.72)',
  },
  text: {
    primary: palette.mist,
    secondary: '#B6C4CF',
    muted: '#91A2AF',
    inverse: palette.pureBlack,
    placeholder: 'rgba(255, 255, 255, 0.42)',
  },
  border: {
    default: palette.darkBorder,
    strong: '#667789',
  },
  brand: {
    primary: palette.tealBright,
    primaryDark: palette.blue,
    accent: palette.coral,
    gradient: [palette.blue, palette.teal, palette.coral],
  },
  shadow: 'rgba(0, 0, 0, 0.45)',
  bottomSheet: {
    handle: 'rgba(255, 255, 255, 0.65)',
    backdrop: 'rgba(0, 0, 0, 0.82)',
  },
};

export type AppTheme = typeof lightTheme;

export function useAppTheme() {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? darkTheme : lightTheme;
}

export const appThemes = {
  light: lightTheme,
  dark: darkTheme,
};
