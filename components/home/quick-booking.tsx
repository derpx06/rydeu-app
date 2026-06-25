import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { useAppTheme } from '@/constants/app-theme';

interface Shortcut {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  variant: 'primary' | 'outline';
}

const shortcuts: Shortcut[] = [
  { icon: 'airplane-outline', label: 'Book Airport Transfer', variant: 'primary' },
  { icon: 'time-outline', label: 'Book Hourly Ride', variant: 'primary' },
  { icon: 'document-text-outline', label: 'Get Quote', variant: 'outline' },
];

export function QuickBooking() {
  const theme = useAppTheme();

  return (
    <View style={styles.sectionContainer}>
      <AppText style={[styles.sectionTitle, { color: theme.text.primary }]}>Quick Booking</AppText>
      <View style={styles.shortcutsContainer}>
        {shortcuts.map((shortcut) => (
          <TouchableOpacity
            key={shortcut.label}
            style={[
              styles.shortcutButton,
              shortcut.variant === 'primary' 
                ? { backgroundColor: theme.brand.primary }
                : { backgroundColor: theme.bg.surface, borderWidth: 1, borderColor: theme.brand.primary }
            ]}
            activeOpacity={0.85}
            accessible={true}
            accessibilityLabel={shortcut.label}
            accessibilityRole="button"
          >
            <Ionicons 
              name={shortcut.icon} 
              size={20} 
              color={shortcut.variant === 'primary' ? theme.text.inverse : theme.brand.primary} 
            />
            <AppText 
              style={[
                styles.shortcutButtonText,
                shortcut.variant === 'primary' 
                  ? { color: theme.text.inverse }
                  : { color: theme.brand.primary }
              ]}
            >
              {shortcut.label}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  shortcutsContainer: {
    gap: 10,
  },
  shortcutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 12,
  },
  shortcutButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
