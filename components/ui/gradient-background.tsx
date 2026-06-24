import { LinearGradient } from 'expo-linear-gradient';
import { PropsWithChildren } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { useAppTheme } from '@/constants/app-theme';

export function GradientBackground({
  children,
  colors,
  style,
}: PropsWithChildren<{ colors?: [string, string, ...string[]]; style?: StyleProp<ViewStyle> }>) {
  const theme = useAppTheme();

  return (
    <LinearGradient
      colors={colors ?? (theme.brand.gradient as [string, string])}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={style}>
      {children}
    </LinearGradient>
  );
}
