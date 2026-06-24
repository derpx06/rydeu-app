import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/constants/app-theme';
import { AppText } from '@/components/ui/app-text';
import { GradientBackground } from '@/components/ui/gradient-background';

type TabItem<T extends string> = {
  label: string;
  value: T;
};

export function SegmentedTabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  const theme = useAppTheme();

  return (
    <View style={[styles.container, { borderColor: theme.border.default, backgroundColor: theme.bg.surface }]}>
      {tabs.map((tab) => {
        const isActive = tab.value === value;
        const content = (
          <AppText
            variant="label"
            style={[styles.label, { color: isActive ? theme.text.inverse : theme.brand.primary }]}>
            {tab.label}
          </AppText>
        );

        return (
          <Pressable key={tab.value} onPress={() => onChange(tab.value)} style={styles.tab}>
            {isActive ? <GradientBackground style={styles.active}>{content}</GradientBackground> : content}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    flexDirection: 'row',
    gap: 4,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
  },
  active: {
    minHeight: 34,
    borderRadius: 8,
    justifyContent: 'center',
  },
  label: {
    textAlign: 'center',
  },
});
