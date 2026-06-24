import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ComponentProps, ReactNode, useRef } from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

import { useAppTheme } from '@/constants/app-theme';
import { GradientBackground } from '@/components/ui/gradient-background';
import { AppText } from '@/components/ui/app-text';

type IconName = ComponentProps<typeof Ionicons>['name'];

type AppButtonProps = Omit<PressableProps, 'style'> & {
  title?: string;
  icon?: IconName;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function AppButton({
  title,
  icon,
  variant = 'primary',
  loading = false,
  disabled,
  style,
  onPress,
  children,
  ...props
}: AppButtonProps) {
  const theme = useAppTheme();
  const lastPressRef = useRef(0);
  const isDisabled = disabled || loading;

  const handlePress: PressableProps['onPress'] = (event) => {
    const now = Date.now();
    if (now - lastPressRef.current < 450 || isDisabled) return;
    lastPressRef.current = now;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress?.(event);
  };

  const content = (
    <View style={styles.content}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? theme.text.inverse : theme.brand.primary} />
      ) : (
        <>
          {icon ? (
            <Ionicons
              name={icon}
              size={18}
              color={variant === 'primary' ? theme.text.inverse : theme.brand.primary}
            />
          ) : null}
          {title ? (
            <AppText
              variant="label"
              style={[
                styles.text,
                { color: variant === 'primary' ? theme.text.inverse : theme.brand.primary },
              ]}>
              {title}
            </AppText>
          ) : (
            children
          )}
        </>
      )}
    </View>
  );

  if (variant === 'primary') {
    return (
      <Pressable
        {...props}
        disabled={isDisabled}
        onPress={handlePress}
        style={({ pressed }) => [styles.pressable, isDisabled && styles.disabled, pressed && styles.pressed, style]}>
        <GradientBackground style={styles.gradient}>{content}</GradientBackground>
      </Pressable>
    );
  }

  return (
    <Pressable
      {...props}
      disabled={isDisabled}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.outline,
        {
          backgroundColor: variant === 'ghost' ? theme.palette.transparent : theme.bg.surface,
          borderColor: variant === 'danger' ? theme.status.error : theme.border.default,
        },
        isDisabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}>
      {content}
    </Pressable>
  );
}

export function IconButton({
  name,
  onPress,
  accessibilityLabel,
}: {
  name: IconName;
  onPress: () => void;
  accessibilityLabel: string;
}) {
  const theme = useAppTheme();

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      hitSlop={10}
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconButton,
        { backgroundColor: theme.bg.surface, shadowColor: theme.shadow },
        pressed && styles.pressed,
      ]}>
      <Ionicons name={name} size={22} color={theme.text.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradient: {
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  outline: {
    minHeight: 52,
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 18,
  },
  content: {
    minHeight: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  text: {
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.58,
  },
  pressed: {
    opacity: 0.82,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
});
