import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { ComponentProps, useEffect, useRef, useState } from 'react';
import { Animated, Keyboard, Platform, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { useAppTheme } from '@/constants/app-theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

const TAB_HORIZONTAL_PADDING = 10;
const MAX_CAPSULE_WIDTH = 112;

const iconForRoute = (routeName: string, focused: boolean): IconName => {
  if (routeName === 'profile') return focused ? 'person' : 'person-outline';
  if (routeName === 'map') return focused ? 'map' : 'map-outline';
  return focused ? 'home' : 'home-outline';
};

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const theme = useAppTheme();
  const [layoutWidth, setLayoutWidth] = useState(0);
  const [visible, setVisible] = useState(true);
  const translateX = useRef(new Animated.Value(0)).current;
  const tabCount = state.routes.length;
  const rawTabWidth = layoutWidth ? (layoutWidth - TAB_HORIZONTAL_PADDING * 2) / tabCount : 0;
  const tabWidth = Math.min(rawTabWidth, MAX_CAPSULE_WIDTH);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSubscription = Keyboard.addListener(showEvent, () => setVisible(false));
    const hideSubscription = Keyboard.addListener(hideEvent, () => setVisible(true));

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (rawTabWidth <= 0) return;

    Animated.spring(translateX, {
      toValue: state.index * rawTabWidth,
      useNativeDriver: true,
      friction: 12,
      tension: 50,
    }).start();
  }, [rawTabWidth, state.index, translateX]);

  if (!visible) return null;

  return (
    <View
      onLayout={(event) => setLayoutWidth(event.nativeEvent.layout.width)}
      style={[
        styles.container,
        {
          backgroundColor: theme.bg.card,
          borderColor: theme.border.default,
          shadowColor: theme.shadow,
        },
      ]}>
      {rawTabWidth > 0 ? (
        <Animated.View
          style={[
            styles.capsule,
            {
              width: tabWidth,
              left: TAB_HORIZONTAL_PADDING + (rawTabWidth - tabWidth) / 2,
              backgroundColor: theme.bg.surface,
              shadowColor: theme.shadow,
              transform: [{ translateX }],
            },
          ]}
        />
      ) : null}

      <View style={styles.content}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;

          return (
            <TabButton
              key={route.key}
              route={route}
              index={index}
              focused={focused}
              options={options}
              navigation={navigation}
              theme={theme}
            />
          );
        })}
      </View>
    </View>
  );
}

function TabButton({
  route,
  focused,
  options,
  navigation,
  theme,
}: {
  route: any;
  index: number;
  focused: boolean;
  options: any;
  navigation: any;
  theme: any;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const label =
    options.tabBarLabel !== undefined
      ? String(options.tabBarLabel)
      : options.title !== undefined
        ? options.title
        : route.name;

  const onPress = () => {
    // Tactile spring press feedback
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();

    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!focused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={focused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      onPress={onPress}
      style={styles.tab}>
      <Animated.View style={[styles.tabContent, { transform: [{ scale }] }]}>
        <Ionicons
          name={iconForRoute(route.name, focused)}
          size={20}
          color={focused ? theme.brand.primary : theme.text.secondary}
        />
        <AppText
          variant="caption"
          numberOfLines={1}
          style={[
            styles.label,
            {
              color: focused ? theme.brand.primary : theme.text.secondary,
              fontWeight: focused ? '700' : '500',
            },
          ]}>
          {label}
        </AppText>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 24,
    height: 66,
    borderRadius: 33,
    borderWidth: 1,
    elevation: 10,
    zIndex: 60,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: TAB_HORIZONTAL_PADDING,
  },
  capsule: {
    position: 'absolute',
    top: 9,
    height: 46,
    borderRadius: 23,
    elevation: 2,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  label: {
    fontSize: 11,
    textAlign: 'center',
    maxWidth: 96,
  },
});
