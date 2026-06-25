import { useEffect, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { useAppTheme } from '@/constants/app-theme';

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
  const translateX = useRef(new Animated.Value(0)).current;
  const [tabWidth, setTabWidth] = useState(0);

  const activeIndex = TABS.findIndex((t) => t.value === value);

  const handleLayout = (e: LayoutChangeEvent) => {
    const containerWidth = e.nativeEvent.layout.width;
    // Subtract container padding (6 * 2 = 12)
    setTabWidth((containerWidth - 12) / TABS.length);
  };

  useEffect(() => {
    if (tabWidth <= 0) return;
    Animated.spring(translateX, {
      toValue: activeIndex * tabWidth,
      friction: 20,
      tension: 170,
      useNativeDriver: true,
    }).start();
  }, [activeIndex, tabWidth, translateX]);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg.surface }]} onLayout={handleLayout}>
      {/* Animated pill indicator */}
      {tabWidth > 0 && (
        <Animated.View
          style={[
            styles.indicator,
            {
              width: tabWidth,
              transform: [{ translateX }],
              backgroundColor: theme.brand.primary,
            },
          ]}
        />
      )}

      {/* Tab labels */}
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
                  color: isActive ? theme.text.inverse : theme.text.secondary,
                  fontWeight: isActive ? '700' : '500',
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
    height: 38,
    borderRadius: 19,
    flexDirection: 'row',
    padding: 4,
    position: 'relative',
    marginVertical: 0,
  },
  indicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    bottom: 4,
    borderRadius: 15,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  label: {
    fontSize: 13,
    textAlign: 'center',
  },
});
