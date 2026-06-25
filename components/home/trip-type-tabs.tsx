import React, { useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useAppTheme } from '@/constants/app-theme';
import { AppText } from '@/components/ui/app-text';

export type TripType = 'oneWay' | 'roundTrip' | 'hourly';

type TripTab = {
  label: string;
  value: TripType;
};

const TABS: TripTab[] = [
  { label: 'One Way', value: 'oneWay' },
  { label: 'Round Trip', value: 'roundTrip' },
  { label: 'Hourly', value: 'hourly' },
];

type TripTypeTabsProps = {
  value: TripType;
  onChange: (value: TripType) => void;
};

export function TripTypeTabs({ value, onChange }: TripTypeTabsProps) {
  const theme = useAppTheme();
  const [containerWidth, setContainerWidth] = useState(0);
  const translateX = useSharedValue(0);

  const activeIndex = TABS.findIndex((t) => t.value === value);
  const tabWidth = containerWidth ? (containerWidth - 8) / TABS.length : 0;

  React.useEffect(() => {
    if (tabWidth > 0) {
      translateX.value = withSpring(activeIndex * tabWidth, {
        damping: 18,
        stiffness: 150,
      });
    }
  }, [activeIndex, tabWidth]);

  const onLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const animatedPillStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      width: tabWidth,
    };
  });

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: '#F1F5F9' },
      ]}
      onLayout={onLayout}
    >
      {tabWidth > 0 && (
        <Animated.View
          style={[
            styles.indicator,
            { backgroundColor: '#E31837' },
            animatedPillStyle,
          ]}
        />
      )}

      {TABS.map((tab) => {
        const isActive = tab.value === value;
        return (
          <Pressable
            key={tab.value}
            onPress={() => onChange(tab.value)}
            style={styles.tab}
          >
            <AppText
              style={[
                styles.label,
                {
                  color: isActive ? '#FFFFFF' : '#64748B',
                  fontWeight: isActive ? '700' : '600',
                },
              ]}
            >
              {tab.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    borderRadius: 22,
    flexDirection: 'row',
    padding: 4,
    position: 'relative',
    alignItems: 'center',
  },
  indicator: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 4,
    borderRadius: 18,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    height: '100%',
  },
  label: {
    fontSize: 13,
    textAlign: 'center',
  },
});
