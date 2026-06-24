import { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

import { useAppTheme } from '@/constants/app-theme';

export function AppCard({ children, style, ...props }: PropsWithChildren<ViewProps>) {
  const theme = useAppTheme();

  return (
    <View
      {...props}
      style={[
        styles.card,
        {
          backgroundColor: theme.bg.card,
          borderColor: theme.border.default,
          shadowColor: theme.shadow,
        },
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    elevation: 5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
  },
});
