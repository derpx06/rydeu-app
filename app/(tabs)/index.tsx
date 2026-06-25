import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import moment from 'moment';
import { useState } from 'react';
import {
  Alert,
  Image,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BenefitsSection } from '@/components/home/benefits-section';
import { FleetSection } from '@/components/home/fleet-section';
import { HeroSection } from '@/components/home/hero-section';
import { PopularDestinations } from '@/components/home/popular-destinations';
import { QuickBooking } from '@/components/home/quick-booking';
import { SearchCard } from '@/components/home/search-card';
import { SheetManager } from '@/components/bottom-sheet/use-sheet-controls';
import { DateTimePickerSheet } from '@/components/calendar/date-time-picker-sheet';
import { DurationPickerSheet } from '@/components/sheets/duration-picker-sheet';
import { LocationPickerSheet } from '@/components/sheets/location-picker-sheet';
import { PassengerPickerSheet } from '@/components/sheets/passenger-picker-sheet';
import { AppText } from '@/components/ui/app-text';
import { TripTypeTabs, TripType } from '@/components/ui/trip-type-tabs';
import { useAppTheme } from '@/constants/app-theme';
import { logout } from '@/store/authSlice';
import { setSelectedDateTime, setReturnDateTime, setPassengers, PassengerCounts, setTripType, setDuration, Duration } from '@/store/calendarSlice';
import { setRideDestination, setRidePickup } from '@/store/rideSlice';
import { useAppDispatch, useAppSelector } from '@/store';

const TAB_BAR_SHEET_CLEARANCE = 0;

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HomeScreen() {
  const theme = useAppTheme();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const user = useAppSelector((state) => state.auth.user);
  const selectedDateTimeIso = useAppSelector((state) => state.calendar.selectedDateTimeIso);
  const returnDateTimeIso = useAppSelector((state) => state.calendar.returnDateTimeIso);
  const passengers = useAppSelector((state) => state.calendar.passengers);
  const tripTypeFromStore = useAppSelector((state) => state.calendar.tripType);
  const durationFromStore = useAppSelector((state) => state.calendar.duration);
  const pickup = useAppSelector((state) => state.location.pickup);
  const dropoff = useAppSelector((state) => state.location.dropoff);

  // Form State
  const [tripType, setTripType] = useState<TripType>(tripTypeFromStore);
  const [duration, setDuration] = useState<Duration>(durationFromStore);

  // Derive display greeting name
  const displayName = user?.name && user.name !== 'Rydeu Customer'
    ? user.name.split(' ')[0]
    : 'Alex';

  // Format Date and Time
  const dateObj = moment(selectedDateTimeIso);
  const formattedDate = dateObj.format('DD MMM, YYYY');
  const formattedTime = dateObj.format('hh:mm A');

  // Format Return Date and Time
  const returnDateObj = moment(returnDateTimeIso);
  const formattedReturnDate = returnDateObj.format('DD MMM, YYYY');
  const formattedReturnTime = returnDateObj.format('hh:mm A');

  // Format Duration
  const formattedDuration = `${duration.hours} hr${duration.hours !== 1 ? 's' : ''}${duration.minutes > 0 ? ` ${duration.minutes} min${duration.minutes !== 1 ? 's' : ''}` : ''}`;

  // Passenger summary
  const totalPassengers = passengers.adults + passengers.children;

  const handleTripTypeChange = (newType: TripType) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTripType(newType);
  };

  const handleOpenDatePicker = () => {
    SheetManager.open(
      <DateTimePickerSheet
        value={selectedDateTimeIso}
        onChange={(isoString) => {
          dispatch(setSelectedDateTime(isoString));
        }}
      />,
      {
        title: 'Select date',
        snapPoints: ['65%'],
        bottomInset: TAB_BAR_SHEET_CLEARANCE,
        contentBottomInset: TAB_BAR_SHEET_CLEARANCE,
      }
    );
  };

  const handleOpenPassengerPicker = () => {
    SheetManager.open(
      <PassengerPickerSheet
        value={passengers}
        onChange={(counts: PassengerCounts) => {
          dispatch(setPassengers(counts));
        }}
      />,
      {
        title: 'Select Passenger & Baggage Count',
        snapPoints: ['55%'],
        bottomInset: TAB_BAR_SHEET_CLEARANCE,
        contentBottomInset: TAB_BAR_SHEET_CLEARANCE,
      }
    );
  };

  const handleOpenLocationPicker = (type: 'from' | 'to') => {
    SheetManager.open(
      <LocationPickerSheet
        title={type === 'from' ? 'Pickup' : 'Dropoff'}
        type={type}
        value={type === 'from' ? (pickup?.name ?? '') : (dropoff?.name ?? '')}
        showQuickDestinations={tripType === 'oneWay' && type === 'to'}
        tripType={tripType}
        onTripTypeChange={handleTripTypeChange}
        onLocationSelected={(locationData) => {
          if (type === 'to') {
            // Set the destination in ride slice for map
            dispatch(setRideDestination(locationData));
            // Also set pickup if available
            if (pickup) {
              dispatch(setRidePickup(pickup));
            }
            router.push('/(tabs)/map');
          }
        }}
        onChange={(name) => {
          // Redux is already updated inside LocationPickerSheet; this callback
          // is kept for any additional side-effects needed by parent.
          void name;
        }}
      />,
      {
        title: `Select ${type === 'from' ? 'Pickup' : 'Dropoff'}`,
        snapPoints: ['75%', '92%'],
        bottomInset: TAB_BAR_SHEET_CLEARANCE,
        contentBottomInset: TAB_BAR_SHEET_CLEARANCE,
      }
    );
  };

  const handleLogout = async () => {
    await dispatch(logout());
    router.replace('/login');
  };

  const handleOpenReturnDatePicker = () => {
    SheetManager.open(
      <DateTimePickerSheet
        value={returnDateTimeIso}
        minDate={selectedDateTimeIso}
        onChange={(isoString) => {
          dispatch(setReturnDateTime(isoString));
        }}
      />,
      {
        title: 'Select Return Date & Time',
        snapPoints: ['85%'],
        bottomInset: TAB_BAR_SHEET_CLEARANCE,
        contentBottomInset: TAB_BAR_SHEET_CLEARANCE,
      }
    );
  };

  const handleOpenDurationPicker = () => {
    SheetManager.open(
      <DurationPickerSheet
        value={duration}
        onChange={(val) => {
          setDuration(val);
        }}
      />,
      {
        title: 'Select Duration',
        snapPoints: ['55%'],
        bottomInset: TAB_BAR_SHEET_CLEARANCE,
        contentBottomInset: TAB_BAR_SHEET_CLEARANCE,
      }
    );
  };

  const handleSearch = () => {
    const returnInfo = tripType === 'roundTrip' ? `\nReturn: ${formattedReturnDate} at ${formattedReturnTime}` : '';
    const durationInfo = tripType === 'hourly' ? `\nDuration: ${formattedDuration}` : '';
    Alert.alert(
      'Rides Search',
      `Mode: ${tripType}\nFrom: ${pickup?.name ?? '(not set)'}\nTo: ${dropoff?.name ?? '(not set)'}\nDate: ${formattedDate}\nPassengers: ${totalPassengers}${returnInfo}${durationInfo}`
    );
  };

  const isDark = theme.bg.app === '#000000';
  const heroTextColor = isDark ? '#FFFFFF' : '#0F172A';
  const heroSubColor = isDark ? 'rgba(255, 255, 255, 0.65)' : '#64748B';
  const iconButtonBg = isDark ? 'rgba(255, 255, 255, 0.09)' : '#F1F5F9';
  const iconButtonColor = isDark ? '#FFFFFF' : '#0F172A';

  return (
    <View style={[styles.container, { backgroundColor: theme.bg.app }]}>
      <View
        style={[styles.fixedHeader, { paddingTop: insets.top + 16, backgroundColor: theme.bg.app }]}
      >
        <View style={styles.topRow}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <View style={styles.actionButtons}>

            <TouchableOpacity style={[styles.iconButton, { backgroundColor: iconButtonBg }]} activeOpacity={0.7}>
              <Ionicons name="notifications-outline" size={20} color={iconButtonColor} />
              <View style={styles.badge} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: iconButtonBg }]} onPress={handleLogout} activeOpacity={0.7}>
              <Ionicons name="log-out" size={20} color={iconButtonColor} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
        {/* Hero Section - Now scrolls with content */}
        <HeroSection displayName={displayName} />

        {/* Search Card Section */}
        <SearchCard
          tripType={tripType}
          onTripTypeChange={handleTripTypeChange}
          pickup={pickup}
          dropoff={dropoff}
          formattedDate={formattedDate}
          formattedTime={formattedTime}
          formattedReturnDate={formattedReturnDate}
          formattedReturnTime={formattedReturnTime}
          formattedDuration={formattedDuration}
          totalPassengers={totalPassengers}
          onOpenLocationPicker={handleOpenLocationPicker}
          onOpenDatePicker={handleOpenDatePicker}
          onOpenReturnDatePicker={handleOpenReturnDatePicker}
          onOpenDurationPicker={handleOpenDurationPicker}
          onOpenPassengerPicker={handleOpenPassengerPicker}
          onOpenMap={() => router.push('/(tabs)/map')}
        />

        <PopularDestinations />

        {/* Featured Vehicles */}
        <FleetSection />

        {/* Why Choose Rydeu */}
        <BenefitsSection />

        {/* Quick Booking Shortcuts */}
        <QuickBooking />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  fixedHeader: {
    paddingHorizontal: 22,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  heroSection: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  headerContainer: {
    paddingHorizontal: 22,
    paddingBottom: 52,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  logoImage: {
    width: 80,
    height: 28,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.09)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF3B30',
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 110,
  },
  heroLeft: {
    flex: 1.25,
    paddingRight: 6,
  },
  greetingBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  greetingBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  greetingText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  subText: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
  },
  heroRight: {
    flex: 0.75,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  carContainer: {
    width: 140,
    height: 120,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carImage: {
    width: 120,
    height: 100,
  },
  cardContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  tripTypeContainer: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 8,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },

  /* ─── Field Rows ─── */
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
  },
  fieldIconContainer: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldContent: {
    flex: 1,
  },
  fieldTouchable: {
    paddingVertical: 4,
  },
  fieldTouchableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  fieldPlaceholder: {
    fontSize: 14,
    color: '#94A3B8',
  },
  fieldValue: {
    color: '#0F172A',
    fontWeight: '600',
  },
  fieldHint: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  fieldDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 36,
  },

  /* ─── Compact Location Picker ─── */
  compactLocationPicker: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  locationLineContainer: {
    width: 16,
    alignItems: 'center',
    paddingVertical: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  square: {
    width: 6,
    height: 6,
  },
  solidLine: {
    flex: 1,
    width: 1.5,
    backgroundColor: '#CBD5E1',
    marginVertical: 2,
  },
  locationFieldsContainer: {
    flex: 1,
    gap: 2,
  },
  compactLocationField: {
    paddingVertical: 2,
  },
  locationFieldDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 6,
  },
  locationInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  namePillContainer: {
    marginBottom: 12,
    flexDirection: 'row',
  },
  namePill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  namePillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  pillRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 4,
  },
  unifiedPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pillText: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '500',
  },
  flex1: {
    flex: 1,
  },

  /* ─── New Sections ─── */
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  destinationsScroll: {
    gap: 12,
    paddingHorizontal: 4,
  },
  destinationCard: {
    width: 140,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  destinationImage: {
    width: '100%',
    height: '100%',
  },
  destinationOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  destinationName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  fleetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  vehicleCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  vehicleImage: {
    width: '100%',
    height: 100,
  },
  vehicleInfo: {
    padding: 12,
    alignItems: 'center',
    gap: 6,
  },
  vehicleName: {
    fontSize: 14,
    fontWeight: '700',
  },
  vehicleDesc: {
    fontSize: 12,
  },
  benefitsContainer: {
    gap: 12,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
  },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  benefitDesc: {
    fontSize: 13,
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
    color: '#FFFFFF',
  },

  /* ─── Hourly Note ─── */
  hourlyNote: {
    paddingVertical: 8,
  },
  hourlyNoteText: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 17,
  },

  /* ─── Split Row (Date + Time) ─── */
  splitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
  },
  splitField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  splitValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  splitPlaceholder: {
    fontSize: 14,
    color: '#94A3B8',
  },
  splitDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 12,
  },

  /* ─── Phone ─── */
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  phonePrefix: {
    fontSize: 14,
    color: '#0F172A',
  },

  /* ─── Checkbox ─── */
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#64748B',
  },

  /* ─── Search Button ─── */
  searchButton: {
    backgroundColor: '#0F172A',
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
