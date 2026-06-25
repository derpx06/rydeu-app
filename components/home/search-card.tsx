import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { memo } from 'react';

import { AppText } from '@/components/ui/app-text';
import { TripTypeTabs, TripType } from '@/components/ui/trip-type-tabs';
import { useAppTheme } from '@/constants/app-theme';

interface Location {
  name?: string;
}

interface SearchCardProps {
  tripType: TripType;
  onTripTypeChange: (type: TripType) => void;
  pickup: Location | null;
  dropoff: Location | null;
  formattedDate: string;
  formattedTime: string;
  formattedReturnDate: string;
  formattedReturnTime: string;
  formattedDuration: string;
  totalPassengers: number;
  onOpenLocationPicker: (field: 'from' | 'to') => void;
  onOpenDatePicker: () => void;
  onOpenReturnDatePicker: () => void;
  onOpenDurationPicker: () => void;
  onOpenPassengerPicker: () => void;
  onOpenMap: () => void;
}

export const SearchCard = memo(function SearchCard({
  tripType,
  onTripTypeChange,
  pickup,
  dropoff,
  formattedDate,
  formattedTime,
  formattedReturnDate,
  formattedReturnTime,
  formattedDuration,
  totalPassengers,
  onOpenLocationPicker,
  onOpenDatePicker,
  onOpenReturnDatePicker,
  onOpenDurationPicker,
  onOpenPassengerPicker,
  onOpenMap,
}: SearchCardProps) {
  const theme = useAppTheme();
  const isDark = theme.bg.app === '#000000';

  return (
    <View style={styles.cardContainer}>
      {/* Trip Type Tabs */}
      <View style={styles.tripTypeContainer}>
        <TripTypeTabs value={tripType} onChange={onTripTypeChange} />
      </View>

      {/* Destination Card - Single Search Field */}
      <View style={[styles.locationCard, { backgroundColor: theme.bg.card, shadowColor: theme.brand.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 }]}>
        <View style={styles.searchFieldContainer}>
          <TouchableOpacity 
            style={[styles.searchField, { backgroundColor: isDark ? '#121824' : '#F8FAFC', borderColor: theme.border.default }]} 
            activeOpacity={0.7}
            onPress={() => onOpenLocationPicker('to')}
          >
            <View style={styles.searchFieldRow}>
              <Ionicons name="search" size={20} color={theme.text.secondary} />
              <View style={styles.flex1}>
                <AppText style={[styles.searchPlaceholder, { color: theme.text.placeholder }, dropoff ? [styles.searchValue, { color: theme.text.primary }] : null]} numberOfLines={1} ellipsizeMode="tail">
                  {dropoff?.name ?? 'Where to?'}
                </AppText>
              </View>
            </View>
          </TouchableOpacity>
          
          {/* Map Icon Button */}
          <TouchableOpacity 
  style={[
    styles.mapButton, 
    { 
      backgroundColor: isDark 
        ? theme.brand.primaryDark || '#1E2937'   // Dark mode button
        : theme.brand.primary,                    // Light mode button
      borderWidth: isDark ? 1 : 0,
      borderColor: isDark ? 'rgba(148, 163, 184, 0.2)' : 'transparent',
    }
  ]} 
  onPress={onOpenMap}
  activeOpacity={0.85}
>
  <Ionicons 
    name="map" 
    size={20} 
    color={isDark ? '#F1F5F9' : '#FFFFFF'} 
  />
</TouchableOpacity>
        </View>
      </View>

      {/* Date/Time/Passenger Chips - Horizontal Scrollable */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsScrollContainer}
        style={styles.chipsScroll}
      >
        {/* Date + Pickup Time */}
        <TouchableOpacity style={[styles.chip, { backgroundColor: isDark ? '#1E293B' : '#F8FAFC', borderColor: theme.border.default }]} onPress={onOpenDatePicker} activeOpacity={0.7}>
          <Ionicons name="calendar-outline" size={16} color={theme.text.secondary} />
          <AppText style={[styles.chipText, { color: theme.text.primary }]}>{formattedDate} at {formattedTime}</AppText>
        </TouchableOpacity>

        {/* Passengers */}
        <TouchableOpacity style={[styles.chip, { backgroundColor: isDark ? '#1E293B' : '#F8FAFC', borderColor: theme.border.default }]} onPress={onOpenPassengerPicker} activeOpacity={0.7}>
          <Ionicons name="people-outline" size={16} color={theme.text.secondary} />
          <AppText style={[styles.chipText, { color: theme.text.primary }]}>
            {totalPassengers} Person{totalPassengers !== 1 ? 's' : ''}
          </AppText>
        </TouchableOpacity>

        {/* Duration (Hourly only) */}
        {tripType === 'hourly' && (
          <TouchableOpacity 
            style={[styles.chip, { backgroundColor: isDark ? '#1E293B' : '#F8FAFC', borderColor: theme.border.default }]} 
            onPress={onOpenDurationPicker}
            activeOpacity={0.7}
          >
            <Ionicons name="hourglass-outline" size={16} color={theme.text.secondary} />
            <AppText style={[styles.chipText, { color: theme.text.primary }]}>{formattedDuration}</AppText>
          </TouchableOpacity>
        )}

        {/* Return Date + Time (Round Trip only) */}
        {tripType === 'roundTrip' && (
          <TouchableOpacity 
            style={[styles.chip, { backgroundColor: isDark ? '#1E293B' : '#F8FAFC', borderColor: theme.border.default }]} 
            onPress={onOpenReturnDatePicker}
            activeOpacity={0.7}
          >
            <Ionicons name="repeat-outline" size={16} color={theme.text.secondary} />
            <AppText style={[styles.chipText, { color: theme.text.primary }]}>Return: {formattedReturnDate} at {formattedReturnTime}</AppText>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  tripTypeContainer: {
    marginBottom: 12,
  },
  locationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: 12,
  },
  searchFieldContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  searchField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchFieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  searchPlaceholder: {
    fontSize: 15,
    color: '#94A3B8',
  },
  searchValue: {
    color: '#0F172A',
    fontWeight: '600',
  },
  mapButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E31837',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  chipsScroll: {
    marginBottom: 12,
  },
  chipsScrollContainer: {
    gap: 10,
    paddingHorizontal: 4,
  },
  chip: {
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
  chipText: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '500',
  },
});
