import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import moment from 'moment';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/app-button';
import { AppCard } from '@/components/ui/app-card';
import { AppText } from '@/components/ui/app-text';
import { useAppTheme } from '@/constants/app-theme';
import { logout } from '@/store/authSlice';
import { useAppDispatch, useAppSelector } from '@/store';

export default function ProfileScreen() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const selectedDateTimeIso = useAppSelector((state) => state.calendar.selectedDateTimeIso);

  const handleLogout = async () => {
    await dispatch(logout());
    router.replace('/login');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg.app }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 104 }]}>
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: theme.bg.surface }]}>
            <Ionicons name="person" size={30} color={theme.brand.primary} />
          </View>
          <View style={styles.headerText}>
            <AppText variant="subtitle" numberOfLines={1}>
              {user?.name || 'Rydeu Customer'}
            </AppText>
            <AppText style={{ color: theme.text.secondary }} numberOfLines={1}>
              {user?.email || 'Local demo session'}
            </AppText>
          </View>
        </View>

        <AppCard style={styles.card}>
          <InfoRow label="Session" value="Local demo" icon="checkmark-circle-outline" />
          <InfoRow label="State" value="Redux Toolkit" icon="git-branch-outline" />
          <InfoRow label="Pickup" value={moment(selectedDateTimeIso).format('DD MMM YYYY, hh:mm A')} icon="time-outline" />
          <InfoRow label="Token" value={token ? `${token.slice(0, 18)}...` : 'Unavailable'} icon="key-outline" />
        </AppCard>

        <AppButton title="Logout" icon="log-out-outline" variant="danger" onPress={handleLogout} />
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  const theme = useAppTheme();

  return (
    <View style={styles.infoRow}>
      <View style={[styles.infoIcon, { backgroundColor: theme.bg.surface }]}>
        <Ionicons name={icon} size={18} color={theme.brand.primary} />
      </View>
      <View style={styles.infoText}>
        <AppText variant="caption" style={{ color: theme.text.secondary }}>
          {label}
        </AppText>
        <AppText variant="label" numberOfLines={1}>
          {value}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    padding: 18,
    gap: 18,
  },
  header: {
    minHeight: 82,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  card: {
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    flex: 1,
    gap: 2,
  },
});
