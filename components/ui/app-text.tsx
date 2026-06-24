import { ComponentProps } from 'react';
import { StyleSheet, Text } from 'react-native';

import { useAppTheme } from '@/constants/app-theme';

type AppTextProps = ComponentProps<typeof Text> & {
  variant?: 'title' | 'subtitle' | 'body' | 'caption' | 'label';
};

export function AppText({ variant = 'body', style, ...props }: AppTextProps) {
  const theme = useAppTheme();

  return (
    <Text
      {...props}
      style={[styles.base, styles[variant], { color: theme.text.primary }, style]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    fontSize: 16,
    lineHeight: 22,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
});
