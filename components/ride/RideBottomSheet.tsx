import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  LayoutAnimation,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SheetManager } from '@/components/bottom-sheet/use-sheet-controls';
import { DateTimePickerSheet } from '@/components/calendar/date-time-picker-sheet';
import { DurationPickerSheet } from '@/components/sheets/duration-picker-sheet';
import { AppText } from '@/components/ui/app-text';
import { TripTypeTabs } from '@/components/ui/trip-type-tabs';
import { useAppTheme } from '@/constants/app-theme';
import { NEUTRAL_COLORS } from '@/constants/theme';
import { useAppDispatch, useAppSelector } from '@/store';
import { setSelectedDateTime, setReturnDateTime, setPassengers, PassengerCounts, setTripType, setDuration } from '@/store/calendarSlice';
import {
  RIDE_OPTIONS,
  computeFare,
  formatDistance,
  formatDuration,
} from '@/store/rideSlice';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  visible: boolean;
  onConfirm: () => void;
  onPickupPress: () => void;
  onDestinationPress: () => void;
  onStepChange?: (step: BookingStep) => void;
};

export type BookingStep = 1 | 2 | 3 | 4 | 5;

export function RideBottomSheet({ visible, onConfirm, onPickupPress, onDestinationPress, onStepChange }: Props) {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const theme = useAppTheme();

  const pickup = useAppSelector((s) => s.ride.pickup);
  const destination = useAppSelector((s) => s.ride.destination);
  const route = useAppSelector((s) => s.ride.route);
  const routeLoading = useAppSelector((s) => s.ride.routeLoading);
  const selectedRideType = useAppSelector((s) => s.ride.selectedRideType);
  const selectedDateTimeIso = useAppSelector((s) => s.calendar.selectedDateTimeIso);
  const returnDateTimeIso = useAppSelector((s) => s.calendar.returnDateTimeIso);
  const passengers = useAppSelector((s) => s.calendar.passengers);
  const tripType = useAppSelector((s) => s.calendar.tripType);
  const duration = useAppSelector((s) => s.calendar.duration);

  const [step, setStep] = useState<BookingStep>(1);
  const [slideAnim] = useState(new Animated.Value(0));
  const [localPassengers, setLocalPassengers] = useState<PassengerCounts>({ ...passengers });
  const [notes, setNotes] = useState('');

  const isDark = theme.bg.app === NEUTRAL_COLORS.black || theme.bg.app === '#0F172A';

  // Reset to step 1 when sheet becomes visible
  useEffect(() => {
    if (visible) {
      setStep(1);
      slideAnim.setValue(0);
    }
  }, [visible, slideAnim]);

  useEffect(() => {
    if (visible) onStepChange?.(step);
  }, [visible, step, onStepChange]);

  if (!visible) return null;

  const distanceMeters = route?.distanceMeters ?? 0;
  const selectedOption = RIDE_OPTIONS.find((o) => o.id === selectedRideType) ?? RIDE_OPTIONS[0];
  const fare = distanceMeters > 0 ? computeFare(distanceMeters, selectedOption) : null;
  const pickupDate = moment(selectedDateTimeIso);
  const returnDate = moment(returnDateTimeIso);
  const formattedDate = pickupDate.format('DD MMM, YYYY');
  const formattedTime = pickupDate.format('hh:mm A');
  const formattedReturnDate = returnDate.format('DD MMM, YYYY');
  const formattedReturnTime = returnDate.format('hh:mm A');
  const formattedDuration = `${duration.hours} hr${duration.hours !== 1 ? 's' : ''}${duration.minutes > 0 ? ` ${duration.minutes} min${duration.minutes !== 1 ? 's' : ''}` : ''}`;
  
  const totalPassengers = localPassengers.adults + localPassengers.children;
  const totalBags = localPassengers.smallBags + localPassengers.largeBags;

  const canProceedStep1 = !!pickup && !!destination;

  const handleOpenDatePicker = () => {
    SheetManager.open(
      <DateTimePickerSheet
        value={selectedDateTimeIso}
        onChange={(isoString) => dispatch(setSelectedDateTime(isoString))}
      />,
      { title: 'Select date', snapPoints: ['65%'] }
    );
  };

  const handleOpenReturnDatePicker = () => {
    SheetManager.open(
      <DateTimePickerSheet
        value={returnDateTimeIso}
        minDate={selectedDateTimeIso}
        onChange={(isoString) => dispatch(setReturnDateTime(isoString))}
      />,
      { title: 'Select Return Date & Time', snapPoints: ['85%'] }
    );
  };

  const handleOpenDurationPicker = () => {
    SheetManager.open(
      <DurationPickerSheet value={duration} onChange={(val) => dispatch(setDuration(val))} />,
      { title: 'Select Duration', snapPoints: ['55%'] }
    );
  };

  const updatePassengerCount = (key: keyof PassengerCounts, delta: number) => {
    setLocalPassengers((prev) => ({
      ...prev,
      [key]: Math.max(key === 'adults' ? 1 : 0, Math.min(10, prev[key] + delta)),
    }));
  };

  const handlePassengerStepNext = () => {
    dispatch(setPassengers(localPassengers));
    goToStep(4);
  };

  const handleNotesStepNext = () => goToStep(5);

  const goToStep = (nextStep: BookingStep) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setStep(nextStep);
  };

  // ── Step 1: Location ──────────────────────────────────────────────────────
  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <AppText style={[styles.stepTitle, { color: theme.text.primary }]}>Where are you going today?</AppText>

      {/* Pickup */}
      <TouchableOpacity style={styles.locationRow} onPress={onPickupPress} activeOpacity={0.75}>
        <View style={[styles.locationDot, styles.locationDotPickup]} />
        <View style={styles.locationTextWrap}>
          {pickup ? (
            <AppText style={[styles.locationName, { color: theme.text.primary }]} numberOfLines={1}>
              {pickup.name}
            </AppText>
          ) : (
            <AppText style={[styles.locationPlaceholder, { color: theme.text.secondary }]}>Choose pick up point</AppText>
          )}
        </View>
      </TouchableOpacity>

      {/* Connector */}
      <View style={styles.locationConnector}>
        <View style={[styles.locationConnectorLine, { backgroundColor: isDark ? '#475569' : '#E2E8F0' }]} />
      </View>

      {/* Destination */}
      <TouchableOpacity style={styles.locationRow} onPress={onDestinationPress} activeOpacity={0.75}>
        <View style={[styles.locationDot, styles.locationDotDest]} />
        <View style={styles.locationTextWrap}>
          {destination ? (
            <AppText style={[styles.locationName, { color: theme.text.primary }]} numberOfLines={1}>
              {destination.name}
            </AppText>
          ) : (
            <AppText style={[styles.locationPlaceholder, { color: theme.text.secondary }]}>Choose your destination</AppText>
          )}
        </View>
      </TouchableOpacity>

      {/* Route info */}
      {routeLoading && (
        <View style={styles.routeInfoRow}>
          <ActivityIndicator size="small" color={theme.text.secondary} />
          <AppText style={[styles.routeInfoText, { color: theme.text.secondary }]}>Calculating route…</AppText>
        </View>
      )}

      {route && !routeLoading && (
        <View style={styles.routeDetailsRow}>
          <View style={[styles.routeDetailItem, { backgroundColor: theme.bg.surface }]}>
            <Ionicons name="navigate" size={18} color={theme.text.secondary} />
            <AppText style={[styles.routeDetailLabel, { color: theme.text.secondary }]}>Distance</AppText>
            <AppText style={[styles.routeDetailValue, { color: theme.text.primary }]}>{formatDistance(route.distanceMeters)}</AppText>
          </View>
          <View style={[styles.routeDetailItem, { backgroundColor: theme.bg.surface }]}>
            <Ionicons name="time" size={18} color={theme.text.secondary} />
            <AppText style={[styles.routeDetailLabel, { color: theme.text.secondary }]}>Duration</AppText>
            <AppText style={[styles.routeDetailValue, { color: theme.text.primary }]}>{formatDuration(route.durationSeconds)}</AppText>
          </View>
        </View>
      )}

      <View style={{ flex: 1 }} />

      <TouchableOpacity
        style={[styles.nextBtn, !canProceedStep1 && styles.nextBtnDisabled]}
        onPress={() => goToStep(2)}
        disabled={!canProceedStep1}
      >
        <AppText style={styles.nextBtnText}>Next</AppText>
      </TouchableOpacity>
    </View>
  );

  // Rest of the steps (Step 2, 3, 4, 5) are also fully themed below...

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <AppText style={[styles.stepTitle, { color: theme.text.primary }]}>Select Date and Time</AppText>

      <View style={styles.tripTypeContainer}>
        <TripTypeTabs value={tripType} onChange={(val) => dispatch(setTripType(val))} />
      </View>

      <TouchableOpacity 
        style={[styles.unifiedPill, { backgroundColor: theme.bg.surface, borderColor: theme.border.default }]} 
        onPress={handleOpenDatePicker}
      >
        <Ionicons name="calendar-outline" size={16} color={theme.text.secondary} />
        <AppText style={[styles.pillText, { color: theme.text.primary }]}>{formattedDate} at {formattedTime}</AppText>
      </TouchableOpacity>

      {tripType === 'roundTrip' && (
        <TouchableOpacity 
          style={[styles.unifiedPill, { backgroundColor: theme.bg.surface, borderColor: theme.border.default }]} 
          onPress={handleOpenReturnDatePicker}
        >
          <Ionicons name="repeat-outline" size={16} color={theme.text.secondary} />
          <AppText style={[styles.pillText, { color: theme.text.primary }]}>Return: {formattedReturnDate} at {formattedReturnTime}</AppText>
        </TouchableOpacity>
      )}

      {tripType === 'hourly' && (
        <TouchableOpacity 
          style={[styles.unifiedPill, { backgroundColor: theme.bg.surface, borderColor: theme.border.default }]} 
          onPress={handleOpenDurationPicker}
        >
          <Ionicons name="hourglass-outline" size={16} color={theme.text.secondary} />
          <AppText style={[styles.pillText, { color: theme.text.primary }]}>{formattedDuration}</AppText>
        </TouchableOpacity>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.backBtn, { borderColor: theme.border.default, backgroundColor: theme.bg.card }]} onPress={() => goToStep(1)}>
          <Ionicons name="arrow-back" size={16} color={theme.text.primary} />
          <AppText style={[styles.backBtnText, { color: theme.text.primary }]}>Back</AppText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextBtn} onPress={() => goToStep(3)}>
          <AppText style={styles.nextBtnText}>Next</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <AppText style={[styles.stepTitle, { color: theme.text.primary }]}>Passengers & Baggage</AppText>

      <View style={styles.summaryRow}>
        <Ionicons name="people-outline" size={18} color={theme.text.secondary} />
        <AppText style={[styles.summaryText, { color: theme.text.primary }]}>
          {totalPassengers} passenger{totalPassengers !== 1 ? 's' : ''}
          {totalBags > 0 ? ` · ${totalBags} bag${totalBags !== 1 ? 's' : ''}` : ''}
        </AppText>
      </View>

      {/* Stepper UI - fully themed */}
      <View style={styles.stepperList}>
        {['adults', 'children', 'smallBags', 'largeBags'].map((key, index) => (
          <View key={key}>
            <View style={styles.stepperRow}>
              <AppText style={[styles.stepperLabel, { color: theme.text.primary }]}>
                {key === 'adults' ? 'Adults' : key === 'children' ? 'Children' : key === 'smallBags' ? 'Small/Cabin Bags' : 'Large/Check-in Bags'}
              </AppText>
              <View style={styles.stepperControls}>
                <TouchableOpacity onPress={() => updatePassengerCount(key as keyof PassengerCounts, -1)} disabled={localPassengers[key as keyof PassengerCounts] <= (key === 'adults' ? 1 : 0)} style={styles.stepperButton}>
                  <Ionicons name="remove" size={18} color={theme.text.primary} />
                </TouchableOpacity>
                <AppText style={[styles.stepperValue, { color: theme.text.primary }]}>{localPassengers[key as keyof PassengerCounts]}</AppText>
                <TouchableOpacity onPress={() => updatePassengerCount(key as keyof PassengerCounts, 1)} disabled={localPassengers[key as keyof PassengerCounts] >= 10} style={styles.stepperButton}>
                  <Ionicons name="add" size={18} color={theme.text.primary} />
                </TouchableOpacity>
              </View>
            </View>
            {index < 3 && <View style={[styles.divider, { backgroundColor: theme.border.default }]} />}
          </View>
        ))}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.backBtn, { borderColor: theme.border.default, backgroundColor: theme.bg.card }]} onPress={() => goToStep(2)}>
          <Ionicons name="arrow-back" size={16} color={theme.text.primary} />
          <AppText style={[styles.backBtnText, { color: theme.text.primary }]}>Back</AppText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextBtn} onPress={handlePassengerStepNext}>
          <AppText style={styles.nextBtnText}>Next</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );

const renderStep4 = () => (
  <View style={styles.stepContent}>
    <AppText style={[styles.stepTitle, { color: theme.text.primary }]}>
      Additional Details
    </AppText>

    {/* ← SELECTED RIDE BAR (now properly placed) */}
    <View style={[styles.selectedRideRow, { 
      backgroundColor: theme.bg.card, 
      borderColor: theme.brand.primary 
    }]}>
      <View style={styles.selectedRideIcon}>
        <Ionicons name={selectedOption.icon as any} size={24} color={theme.brand.primary} />
      </View>
      <View style={styles.selectedRideText}>
        <AppText style={[styles.selectedRideLabel, { color: theme.text.secondary }]}>
          Vehicle type
        </AppText>
        <AppText style={[styles.selectedRideValue, { color: theme.text.primary }]}>
          {selectedOption.label}
        </AppText>
      </View>
      <AppText style={styles.selectedRidePrice}>
        ${fare?.toFixed(2) || '—'}
      </AppText>
    </View>

    <View style={styles.notesContainer}>
      <View style={styles.notesHeader}>
        <Ionicons name="create-outline" size={20} color={theme.text.secondary} />
        <AppText style={[styles.notesLabel, { color: theme.text.primary }]}>
          Add a note for the driver
        </AppText>
      </View>
      <TextInput
        style={[styles.notesInput, { 
          borderColor: theme.border.default, 
          backgroundColor: theme.bg.surface, 
          color: theme.text.primary 
        }]}
        placeholder="e.g., Meet at the main entrance..."
        placeholderTextColor={theme.text.placeholder || '#94A3B8'}
        multiline
        value={notes}
        onChangeText={setNotes}
      />
    </View>

    <View style={styles.buttonRow}>
      <TouchableOpacity 
        style={[styles.backBtn, { borderColor: theme.border.default, backgroundColor: theme.bg.card }]} 
        onPress={() => goToStep(3)}
      >
        <Ionicons name="arrow-back" size={16} color={theme.text.primary} />
        <AppText style={[styles.backBtnText, { color: theme.text.primary }]}>Back</AppText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.nextBtn} onPress={handleNotesStepNext}>
        <AppText style={styles.nextBtnText}>Next</AppText>
      </TouchableOpacity>
    </View>
  </View>
);
  const renderStep5 = () => (
    <View style={styles.stepContent}>
      <AppText style={[styles.stepTitle, { color: theme.text.primary }]}>Transaction Summary</AppText>

      {/* Summary Card */}
      <View style={[styles.summaryCard, { backgroundColor: theme.bg.surface, borderColor: theme.border.default }]}>
        {/* Vehicle & Price */}
        <View style={styles.summaryVehicleHeader}>
          <View style={styles.vehicleIconContainer}>
            <Ionicons name="car" size={32} color="#E31837" />
          </View>
          <View style={styles.vehicleInfo}>
            <AppText style={[styles.vehicleName, { color: theme.text.primary }]}>{selectedOption.label}</AppText>
            <AppText style={[styles.vehicleCapacity, { color: theme.text.secondary }]}>{selectedOption.capacity}</AppText>
          </View>
          <AppText style={styles.vehiclePriceValue}>${fare?.toFixed(2) || '—'}</AppText>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border.default, marginVertical: 16 }]} />

        {/* Locations */}
        <View style={styles.summaryLocationRow}>
          <View style={[styles.summaryDot, styles.summaryDotPickup]} />
          <AppText style={[styles.summaryLocationText, { color: theme.text.primary }]} numberOfLines={1}>{pickup?.name}</AppText>
        </View>
        <View style={styles.summaryLocationRow}>
          <View style={[styles.summaryDot, styles.summaryDotDest]} />
          <AppText style={[styles.summaryLocationText, { color: theme.text.primary }]} numberOfLines={1}>{destination?.name}</AppText>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border.default, marginVertical: 16 }]} />

        {/* Trip Details */}
        <View style={styles.summaryTripRow}>
          <Ionicons name="calendar-outline" size={18} color={theme.text.secondary} />
          <AppText style={[styles.summaryLabel, { color: theme.text.secondary }]}>Date & Time</AppText>
          <AppText style={[styles.summaryValue, { color: theme.text.primary }]}>{formattedDate} at {formattedTime}</AppText>
        </View>

        <View style={styles.summaryTripRow}>
          <Ionicons name="people-outline" size={18} color={theme.text.secondary} />
          <AppText style={[styles.summaryLabel, { color: theme.text.secondary }]}>Passengers</AppText>
          <AppText style={[styles.summaryValue, { color: theme.text.primary }]}>{totalPassengers} ({localPassengers.adults} Ad, {localPassengers.children} Ch)</AppText>
        </View>

        {totalBags > 0 && (
          <View style={styles.summaryTripRow}>
            <Ionicons name="briefcase-outline" size={18} color={theme.text.secondary} />
            <AppText style={[styles.summaryLabel, { color: theme.text.secondary }]}>Baggage</AppText>
            <AppText style={[styles.summaryValue, { color: theme.text.primary }]}>{totalBags} ({localPassengers.smallBags} Sm, {localPassengers.largeBags} Lg)</AppText>
          </View>
        )}

        {route && (
          <View style={styles.summaryTripRow}>
            <Ionicons name="navigate-outline" size={18} color={theme.text.secondary} />
            <AppText style={[styles.summaryLabel, { color: theme.text.secondary }]}>Distance</AppText>
            <AppText style={[styles.summaryValue, { color: theme.text.primary }]}>{formatDistance(route.distanceMeters)}</AppText>
          </View>
        )}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.backBtn, { borderColor: theme.border.default, backgroundColor: theme.bg.card }]} onPress={() => goToStep(4)}>
          <Ionicons name="arrow-back" size={16} color={theme.text.primary} />
          <AppText style={[styles.backBtnText, { color: theme.text.primary }]}>Back</AppText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.checkoutBtn} onPress={onConfirm} disabled={!route || routeLoading}>
          <AppText style={styles.checkoutBtnText}>Confirm & Pay</AppText>
          <AppText style={styles.checkoutPrice}>${fare?.toFixed(2) || '—'}</AppText>
          <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.sheet, { backgroundColor: theme.bg.app,paddingBottom: insets.bottom + 90    }]}>
      <View style={styles.handleArea}>
        <View style={[styles.handle, { backgroundColor: isDark ? '#475569' : '#CBD5E1' }]} />
      </View>

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
      {step === 5 && renderStep5()}
    </View>
  );
}

/* ==================== STYLES ==================== */
const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    zIndex: 100,
    paddingHorizontal: 20,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  handleArea: { alignItems: 'center', paddingVertical: 10 },
  step4Overlay: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 101,
  },
  handle: { width: 40, height: 5, borderRadius: 3 },

  stepContent: { paddingTop: 8 },
  tripTypeContainer: { marginBottom: 20 },
  stepTitle: { fontSize: 22, fontWeight: '800', marginBottom: 20 },

  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 48, paddingHorizontal: 4 },
  locationDot: { width: 14, height: 14, borderRadius: 7 },
  locationDotPickup: { backgroundColor: '#22C55E', borderWidth: 2.5, borderColor: '#FFFFFF' },
  locationDotDest: { backgroundColor: '#EF4444', borderRadius: 3 },
  locationTextWrap: { flex: 1, borderBottomWidth: 1, paddingVertical: 12 },
  locationName: { fontSize: 15, fontWeight: '600' },
  locationPlaceholder: { fontSize: 15 },
  locationConnector: { paddingLeft: 10 },
  locationConnectorLine: { width: 2, height: 20, borderRadius: 1 },

  routeInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  routeInfoText: { fontSize: 13 },
  routeDetailsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, gap: 12 },
  routeDetailItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12 },
  routeDetailLabel: { fontSize: 12 },
  routeDetailValue: { fontSize: 14, fontWeight: '700' },

  unifiedPill: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 24, borderWidth: 1, marginBottom: 10 },
  pillText: { fontSize: 14, fontWeight: '500' },

  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4, marginBottom: 16 },
  summaryText: { fontSize: 14, fontWeight: '600' },

  stepperList: { gap: 0 },
  stepperRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  stepperLabel: { fontSize: 15, fontWeight: '500' },
  stepperControls: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  stepperButton: { width: 36, height: 36, borderRadius: 18, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  stepperValue: { fontSize: 16, fontWeight: '700', minWidth: 24, textAlign: 'center' },
  divider: { height: 1 },

  selectedRideRow: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderRadius: 16, padding: 14, marginBottom: 16 },
  selectedRideIcon: { width: 46, height: 46, borderRadius: 14, backgroundColor: '#FFE4E8', alignItems: 'center', justifyContent: 'center' },
  selectedRideText: { flex: 1 },
  selectedRideLabel: { fontSize: 12, fontWeight: '600' },
  selectedRideValue: { fontSize: 16, fontWeight: '800' },
  selectedRidePrice: { fontSize: 17, fontWeight: '800', color: '#E31837' },

  notesContainer: { marginTop: 8 },
  notesHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  notesLabel: { fontSize: 15, fontWeight: '600' },
  notesInput: { borderWidth: 1.5, borderRadius: 14, padding: 14, minHeight: 110, fontSize: 15 },

  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
  nextBtn: { flex: 1, height: 54, borderRadius: 27, backgroundColor: '#E31837', alignItems: 'center', justifyContent: 'center' },
  nextBtnDisabled: { backgroundColor: '#94A3B8' },
  nextBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },

  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 54, borderRadius: 27, borderWidth: 1.5, paddingHorizontal: 22 },
  backBtnText: { fontSize: 14, fontWeight: '700' },

  checkoutBtn: { flex: 1, height: 54, borderRadius: 27, backgroundColor: '#E31837', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  checkoutBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  checkoutPrice: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },

  summaryCard: { borderWidth: 1, borderRadius: 18, padding: 16, marginBottom: 16 },
  summaryVehicleHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  vehicleIconContainer: { width: 58, height: 58, borderRadius: 14, backgroundColor: '#FFE4E8', alignItems: 'center', justifyContent: 'center' },
  vehicleInfo: { flex: 1 },
  vehicleName: { fontSize: 16, fontWeight: '700' },
  vehicleCapacity: { fontSize: 13, marginTop: 2 },
  vehiclePriceValue: { fontSize: 19, fontWeight: '800', color: '#E31837' },

  summarySectionTitle: { fontSize: 14, fontWeight: '700', marginBottom: 12 },
  summaryTripRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 9 },
  summaryLabel: { flex: 1, fontSize: 14 },
  summaryValue: { fontSize: 14, fontWeight: '600' },
  summaryLocationRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  summaryDot: { width: 10, height: 10, borderRadius: 5 },
  summaryDotPickup: { backgroundColor: '#22C55E' },
  summaryDotDest: { backgroundColor: '#E31837' },
  summaryLocationText: { flex: 1, fontSize: 14 },
});