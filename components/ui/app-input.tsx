import { Ionicons } from '@expo/vector-icons';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { ComponentProps, ReactNode } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import { useBottomSheetEnvironment } from '@/components/bottom-sheet/bottom-sheet-environment';
import { useAppTheme } from '@/constants/app-theme';
import { AppText } from '@/components/ui/app-text';

type IconName = ComponentProps<typeof Ionicons>['name'];

type AppInputProps = TextInputProps & {
  label?: string;
  error?: string | null;
  icon?: IconName;
  rightContent?: ReactNode;
};

export function AppInput({ label, error, icon, rightContent, style, ...props }: AppInputProps) {
  const theme = useAppTheme();
  const { isBottomSheet } = useBottomSheetEnvironment();
  const InputComponent = isBottomSheet ? BottomSheetTextInput : TextInput;

  return (
    <View style={styles.container}>
      {label ? (
        <AppText variant="label" style={[styles.label, { color: theme.text.secondary }]}>
          {label}
        </AppText>
      ) : null}
      <View
        style={[
          styles.inputWrap,
          {
            backgroundColor: theme.bg.surface,
            borderColor: error ? theme.status.error : theme.border.default,
          },
        ]}>
        {icon ? <Ionicons name={icon} size={18} color={theme.text.secondary} /> : null}
        <InputComponent
          placeholderTextColor={theme.text.placeholder}
          autoCapitalize="none"
          style={[styles.input, { color: theme.text.primary }, style]}
          {...props}
        />
        {rightContent}
      </View>
      {error ? (
        <AppText variant="caption" style={{ color: theme.status.error }}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    marginLeft: 2,
  },
  inputWrap: {
    minHeight: 52,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    minHeight: 50,
    fontSize: 16,
  },
});
