import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { ComponentProps, useEffect, useRef, useState } from 'react';
import { Animated, Keyboard, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { useAppTheme } from '@/constants/app-theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

const TAB_HORIZONTAL_PADDING = 10;
const MAX_CAPSULE_WIDTH = 112;

const iconForRoute = (routeName: string, focused: boolean): IconName => {
  if (routeName === 'profile') return focused ? 'person' : 'person-outline';
  return focused ? 'home' : 'home-outline';
};

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
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
          paddingBottom: Math.max(insets.bottom, 8),
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
          const label =
            options.tabBarLabel !== undefined
              ? String(options.tabBarLabel)
              : options.title !== undefined
                ? options.title
                : route.name;
          const focused = state.index === index;

          const onPress = () => {
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
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
              onPress={onPress}
              style={styles.tab}>
              <Ionicons
                name={iconForRoute(route.name, focused)}
                size={22}
                color={focused ? theme.brand.primary : theme.text.secondary}
              />
              <AppText
                variant="caption"
                numberOfLines={1}
                style={[styles.label, { color: focused ? theme.brand.primary : theme.text.secondary }]}>
                {label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 72,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingTop: 10,
    elevation: 18,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: TAB_HORIZONTAL_PADDING,
  },
  capsule: {
    position: 'absolute',
    top: 10,
    height: 48,
    borderRadius: 24,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    zIndex: 1,
  },
  label: {
    textAlign: 'center',
    maxWidth: 96,
  },
});
