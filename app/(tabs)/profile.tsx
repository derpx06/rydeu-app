import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { useAppTheme } from '@/constants/app-theme';
import { useAppDispatch, useAppSelector } from '@/store';
import { logout } from '@/store/authSlice';
import { setThemeMode, AppThemeMode } from '@/store/themeSlice';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const themeMode = useAppSelector((s) => s.theme.mode);

  const handleLogout = () => {
    dispatch(logout());
  };

  const themeOptions: { label: string; value: AppThemeMode; icon: keyof typeof Ionicons.glyphMap }[] = [
    { label: 'Light', value: 'light', icon: 'sunny-outline' },
    { label: 'Dark', value: 'dark', icon: 'moon-outline' },
    { label: 'System', value: 'system', icon: 'settings-outline' },
  ];

  const personalOptions: { label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { label: 'Edit Profile', icon: 'person-outline' },
    { label: 'Notification Settings', icon: 'notifications-outline' },
    { label: 'Privacy & Security', icon: 'shield-checkmark-outline' },
    { label: 'Help & Support', icon: 'help-circle-outline' },
  ];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.bg.app }]}
      contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 100 }}
    >
      <View style={styles.header}>
        <View style={[styles.avatarPlaceholder, { backgroundColor: theme.bg.surface }]}>
          <Ionicons name="person" size={40} color={theme.text.secondary} />
        </View>
        <AppText style={[styles.userName, { color: theme.text.primary }]}>{user?.name || 'Guest User'}</AppText>
        <AppText style={[styles.userEmail, { color: theme.text.secondary }]}>{user?.email || 'Sign in to sync your data'}</AppText>
      </View>

      <View style={styles.section}>
        <AppText style={[styles.sectionTitle, { color: theme.text.secondary }]}>Personal Settings</AppText>
        <View style={[styles.optionsCard, { backgroundColor: theme.bg.card, borderColor: theme.border.default }]}>
          {personalOptions.map((opt, i) => (
            <TouchableOpacity 
              key={opt.label} 
              style={[
                styles.optionRow, 
                i < personalOptions.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border.default }
              ]}
            >
              <View style={styles.optionLeft}>
                <Ionicons name={opt.icon} size={22} color={theme.text.secondary} />
                <AppText style={[styles.optionLabel, { color: theme.text.primary }]}>{opt.label}</AppText>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.border.default} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <AppText style={[styles.sectionTitle, { color: theme.text.secondary }]}>Appearance</AppText>
        <View style={[styles.optionsCard, { backgroundColor: theme.bg.card, borderColor: theme.border.default }]}>
          {themeOptions.map((opt, i) => (
            <TouchableOpacity 
              key={opt.value} 
              style={[
                styles.optionRow, 
                i < themeOptions.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border.default }
              ]}
              onPress={() => dispatch(setThemeMode(opt.value))}
            >
              <View style={styles.optionLeft}>
                <Ionicons name={opt.icon} size={22} color={themeMode === opt.value ? theme.brand.primary : theme.text.secondary} />
                <AppText style={[styles.optionLabel, { color: theme.text.primary }]}>{opt.label}</AppText>
              </View>
              {themeMode === opt.value && (
                <Ionicons name="checkmark-circle" size={22} color={theme.brand.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity 
          style={[styles.logoutBtn, { borderColor: theme.status.error }]} 
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={22} color={theme.status.error} />
          <AppText style={[styles.logoutText, { color: theme.status.error }]}>Log Out</AppText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 5,
  },
  optionsCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    marginTop: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
