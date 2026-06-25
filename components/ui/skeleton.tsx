import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '@/constants/app-theme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  style?: any;
}

export function Skeleton({ width = '100%', height = 20, style }: SkeletonProps) {
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.skeleton,
        { width, height, backgroundColor: theme.border.default },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    borderRadius: 4,
    opacity: 0.5,
  },
});
