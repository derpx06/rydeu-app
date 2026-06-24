import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import moment from 'moment';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { SheetManager } from '@/components/bottom-sheet/use-sheet-controls';
import { DateTimePickerSheet } from '@/components/calendar/date-time-picker-sheet';
import { AppButton } from '@/components/ui/app-button';
import { AppCard } from '@/components/ui/app-card';
import { AppText } from '@/components/ui/app-text';
import { GradientBackground } from '@/components/ui/gradient-background';
import { useAppTheme } from '@/constants/app-theme';
import { logout } from '@/store/authSlice';
import { setSelectedDateTime } from '@/store/calendarSlice';
import { useAppDispatch, useAppSelector } from '@/store';

const formatGreeting = () => {
  const hour = moment().hour();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export default function HomeScreen() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const selectedDateTimeIso = useAppSelector((state) => state.calendar.selectedDateTimeIso);
  const selected = moment(selectedDateTimeIso);
  const displayName = user?.name || user?.email || 'Rydeu Customer';

  const openCalendar = () => {
    SheetManager.open(
      <DateTimePickerSheet
        value={selectedDateTimeIso}
        onChange={(isoString) => dispatch(setSelectedDateTime(isoString))}
        monthsToShow={6}
      />,
      {
        title: 'Pickup schedule',
        snapPoints: ['90%'],
        enablePanDownToClose: true,
      },
    );
  };

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
          <View style={styles.headerText}>
            <AppText variant="caption" style={{ color: theme.text.secondary }}>
              {formatGreeting()}
            </AppText>
            <AppText variant="subtitle" numberOfLines={1}>
              {displayName}
            </AppText>
          </View>
          <AppButton title="Logout" icon="log-out-outline" variant="ghost" onPress={handleLogout} />
        </View>

        <GradientBackground style={styles.hero}>
          <View style={styles.heroTopRow}>
            <View style={styles.brandBadge}>
              <Ionicons name="car-sport" size={26} color={theme.text.inverse} />
            </View>
            <AppText variant="label" style={styles.heroBadgeText}>
              Rydeu pickup
            </AppText>
          </View>
          <View style={styles.heroCopy}>
            <AppText variant="title" style={styles.heroTitle}>
              {selected.format('ddd, DD MMM')}
            </AppText>
            <AppText style={styles.heroDescription}>{selected.format('hh:mm A')}</AppText>
          </View>
        </GradientBackground>

        <AppCard style={styles.bookingCard}>
          <View style={styles.bookingHeader}>
            <View>
              <AppText variant="caption" style={{ color: theme.text.secondary }}>
                Selected pickup
              </AppText>
              <AppText variant="subtitle">{selected.format('DD MMMM YYYY')}</AppText>
            </View>
            <View style={[styles.timeBadge, { backgroundColor: theme.bg.surface }]}>
              <Ionicons name="time-outline" size={17} color={theme.brand.primary} />
              <AppText variant="label" style={{ color: theme.brand.primary }}>
                {selected.format('hh:mm A')}
              </AppText>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border.default }]} />

          <ScheduleRow icon="calendar-outline" label="Date" value={selected.format('dddd, DD MMM YYYY')} />
          <ScheduleRow icon="time-outline" label="Time" value={selected.format('hh:mm A')} />

          <AppButton title="Change pickup time" icon="calendar-outline" onPress={openCalendar} />
        </AppCard>
      </ScrollView>
    </SafeAreaView>
  );
}

function ScheduleRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  const theme = useAppTheme();

  return (
    <View style={styles.scheduleRow}>
      <View style={[styles.scheduleIcon, { backgroundColor: theme.bg.surface }]}>
        <Ionicons name={icon} size={18} color={theme.brand.primary} />
      </View>
      <View style={styles.scheduleText}>
        <AppText variant="caption" style={{ color: theme.text.secondary }}>
          {label}
        </AppText>
        <AppText variant="label">{value}</AppText>
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
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  hero: {
    minHeight: 208,
    borderRadius: 8,
    padding: 20,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.32)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBadgeText: {
    color: 'rgba(255, 255, 255, 0.82)',
  },
  heroCopy: {
    gap: 4,
  },
  heroTitle: {
    color: '#FFFFFF',
  },
  heroDescription: {
    color: 'rgba(255, 255, 255, 0.84)',
  },
  bookingCard: {
    gap: 16,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'center',
  },
  timeBadge: {
    minHeight: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scheduleIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleText: {
    flex: 1,
    gap: 2,
  },
});
