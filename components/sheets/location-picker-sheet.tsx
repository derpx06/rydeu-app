import { Ionicons } from '@expo/vector-icons';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

import { useBottomSheet, useSheetId } from '@/components/bottom-sheet/bottom-sheet-context';
import { AppText } from '@/components/ui/app-text';
import { TripTypeTabs, TripType } from '@/components/home/trip-type-tabs';
import { useAppTheme } from '@/constants/app-theme';
import { NEUTRAL_COLORS } from '@/constants/theme';
import { searchPlaces, getPlaceDetails, PlaceSuggestion } from '@/services/googlePlaces';
import { useAppDispatch, useAppSelector } from '@/store';
import { addRecentSearch, setDropoff, setPickup, LocationData } from '@/store/locationSlice';

type QuickDestination = {
  id: string;
  name: string;
  address: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgColor: string;
};

const QUICK_DESTINATIONS: QuickDestination[] = [
  {
    id: 'home',
    name: 'Home',
    address: 'Your saved home address',
    icon: 'home-outline',
    color: '#E31837',
    bgColor: '#FFEBEE',
  },
  {
    id: 'work',
    name: 'Work',
    address: 'Your saved work address',
    icon: 'briefcase-outline',
    color: '#2196F3',
    bgColor: '#E3F2FD',
  },
  {
    id: 'airport',
    name: 'Airport',
    address: 'Nearest airport terminal',
    icon: 'airplane-outline',
    color: '#FF9800',
    bgColor: '#FFF3E0',
  },
  {
    id: 'hotel',
    name: 'Hotel',
    address: 'Popular hotels nearby',
    icon: 'bed-outline',
    color: '#9C27B0',
    bgColor: '#F3E5F5',
  },
];

type Props = {
  title: string;
  type: 'from' | 'to';
  value: string;
  onChange: (name: string) => void;
  showQuickDestinations?: boolean;
  tripType?: TripType;
  onTripTypeChange?: (type: TripType) => void;
  onLocationSelected?: (location: LocationData) => void;
};

export function LocationPickerSheet({ title, type, value, onChange, showQuickDestinations = false, tripType = 'oneWay', onTripTypeChange, onLocationSelected }: Props) {
  const theme = useAppTheme();
  const isDark = theme.bg.app === NEUTRAL_COLORS.black || theme.bg.app === '#0F172A';
  const sheetId = useSheetId();
  const dispatch = useAppDispatch();
  const { closeSheet } = useBottomSheet();

  const recentSearches = useAppSelector((s) => s.location.recentSearches);

  const [query, setQuery] = useState(value ?? '');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [resolving, setResolving] = useState<string | null>(null); // placeId being resolved
  const [apiError, setApiError] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Debounced autocomplete ──────────────────────────────────────────────────
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setApiError(null);

    if (!query.trim()) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await searchPlaces(query);
        setSuggestions(results);
      } catch (e: any) {
        console.error(e);
        setApiError('Could not fetch suggestions. Check your API key.');
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 380);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // ── Commit a location to Redux + close ─────────────────────────────────────
  const commitLocation = useCallback(
    (locationData: LocationData) => {
      if (type === 'from') dispatch(setPickup(locationData));
      else dispatch(setDropoff(locationData));
      dispatch(addRecentSearch(locationData));
      onChange(locationData.name);
      closeSheet(sheetId ?? undefined);
      if (onLocationSelected) onLocationSelected(locationData);
    },
    [type, dispatch, onChange, closeSheet, sheetId, onLocationSelected],
  );

  // ── Select from autocomplete suggestions ───────────────────────────────────
  const handleSelectSuggestion = useCallback(
    async (suggestion: PlaceSuggestion) => {
      setResolving(suggestion.placeId);
      try {
        const details = await getPlaceDetails(suggestion.placeId);
        if (details) {
          commitLocation({
            name: details.name || suggestion.name,
            address: details.address || suggestion.address,
            latitude: details.latitude,
            longitude: details.longitude,
          });
        }
      } catch (e) {
        console.error(e);
        setApiError('Could not load place details.');
      } finally {
        setResolving(null);
      }
    },
    [commitLocation],
  );

  // ── Select from recents / static lists ─────────────────────────────────────
  const handleSelectStatic = useCallback(
    (location: LocationData) => commitLocation(location),
    [commitLocation],
  );

  const showingQuery = query.trim().length > 0;

  return (
    <View style={[styles.root, { backgroundColor: theme.bg.app }]}>
      {/* ── Search bar ───────────────────────────────────────────────────────── */}
      <View style={[styles.searchRow, { backgroundColor: theme.bg.surface, borderColor: theme.border.default }]}>
        <Ionicons name="search-outline" size={19} color={theme.text.placeholder} />
        <BottomSheetTextInput
          style={[styles.input, { color: theme.text.primary }]}
          placeholder={`Search ${title.toLowerCase()}…`}
          placeholderTextColor={theme.text.placeholder}
          value={query}
          onChangeText={setQuery}
          autoFocus
          returnKeyType="search"
        />
        {loading ? (
          <ActivityIndicator size="small" color={theme.text.placeholder} />
        ) : query.length > 0 ? (
          <TouchableHighlight
            underlayColor="transparent"
            onPress={() => { setQuery(''); setSuggestions([]); }}
          >
            <Ionicons name="close-circle" size={20} color={theme.text.placeholder} />
          </TouchableHighlight>
        ) : null}
      </View>

      {/* ── API error ─────────────────────────────────────────────────────────── */}
      {apiError && (
        <View style={[styles.errorBanner, { backgroundColor: isDark ? '#450A0A' : theme.status.error + '10' }]}>
          <Ionicons name="warning-outline" size={15} color={theme.status.error} />
          <AppText style={styles.errorText}>{apiError}</AppText>
        </View>
      )}

   
      {/* ── Where are we going today? (Quick Destinations) ──────────────────────── */}
      {!showingQuery && showQuickDestinations && type === 'to' && (
        <View style={styles.quickDestinationsSection}>
          <AppText style={[styles.quickDestTitle, { color: theme.text.primary }]}>Where are we going today?</AppText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickDestScroll}
          >
            {QUICK_DESTINATIONS.map((dest) => (
              <TouchableOpacity
                key={dest.id}
                style={[styles.quickDestCard, { backgroundColor: theme.bg.card, borderColor: theme.border.default }]}
                onPress={() => {
                  commitLocation({
                    name: dest.name,
                    address: dest.address,
                    latitude: 18.5204 + Math.random() * 0.01,
                    longitude: 73.8567 + Math.random() * 0.01,
                  });
                }}
              >
                <View style={[styles.quickDestIcon, { backgroundColor: isDark ? theme.bg.surface : dest.bgColor }]}>
                  <Ionicons name={dest.icon} size={24} color={isDark ? theme.text.primary : dest.color} />
                </View>
                <AppText style={[styles.quickDestName, { color: theme.text.primary }]}>{dest.name}</AppText>
                <AppText style={[styles.quickDestAddress, { color: theme.text.secondary }]} numberOfLines={1}>{dest.address}</AppText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* ── Content ───────────────────────────────────────────────────────────── */}
      {showingQuery ? (
        /* Autocomplete results */
        <View style={styles.section}>
          {suggestions.length === 0 && !loading && !apiError ? (
            <View style={styles.emptyState}>
              <Ionicons name="search" size={32} color={theme.text.placeholder} style={{ opacity: 0.3 }} />
              <AppText style={[styles.emptyText, { color: theme.text.placeholder }]}>
                No results for &quot;{query}&quot;
              </AppText>
            </View>
          ) : (
            suggestions.map((s) => (
              <SuggestionRow
                key={s.placeId}
                icon="location-outline"
                primary={s.name}
                secondary={s.address}
                resolving={resolving === s.placeId}
                theme={theme}
                onPress={() => handleSelectSuggestion(s)}
              />
            ))
          )}
        </View>
      ) : (
        /* Idle state — recents + no further static lists */
        <>
          {recentSearches.length > 0 && (
            <View style={styles.section}>
              <AppText style={[styles.sectionLabel, { color: theme.text.secondary }]}>Recent</AppText>
              {recentSearches.map((item, i) => (
                <SuggestionRow
                  key={`recent-${i}`}
                  icon="time-outline"
                  primary={item.name}
                  secondary={item.address}
                  theme={theme}
                  onPress={() => handleSelectStatic(item)}
                />
              ))}
            </View>
          )}

          {recentSearches.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="map-outline" size={38} color={theme.text.placeholder} style={{ opacity: 0.2 }} />
              <AppText style={[styles.emptyText, { color: theme.text.placeholder }]}>
                Start typing to search for a location
              </AppText>
            </View>
          )}
        </>
      )}
    </View>
  );
}

/* ── Shared row component ─────────────────────────────────────────────────── */
function SuggestionRow({
  icon,
  primary,
  secondary,
  resolving = false,
  theme,
  onPress,
}: {
  icon: string;
  primary: string;
  secondary: string;
  resolving?: boolean;
  theme: ReturnType<typeof import('@/constants/app-theme').useAppTheme>;
  onPress: () => void;
}) {
  return (
    <TouchableHighlight
      underlayColor={theme.bg.surface}
      style={styles.row}
      onPress={onPress}
      disabled={resolving}
    >
      <View style={styles.rowInner}>
        <View style={[styles.iconWrap, { backgroundColor: theme.bg.surface }]}>
          <Ionicons name={icon as any} size={18} color={theme.text.secondary} />
        </View>
        <View style={styles.rowText}>
          <AppText style={[styles.rowPrimary, { color: theme.text.primary }]} numberOfLines={1}>
            {primary}
          </AppText>
          {secondary ? (
            <AppText style={[styles.rowSecondary, { color: theme.text.secondary }]} numberOfLines={1}>
              {secondary}
            </AppText>
          ) : null}
        </View>
        {resolving && <ActivityIndicator size="small" color={theme.text.placeholder} />}
      </View>
    </TouchableHighlight>
  );
}

/* ── Styles ───────────────────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingBottom: 24,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
    marginBottom: 18,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  errorText: {
    fontSize: 13,
    color: '#EF4444',
    flex: 1,
  },
  tripTypeSection: {
    marginBottom: 16,
  },
  section: {
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 6,
    marginLeft: 4,
  },
  row: {
    borderRadius: 12,
    marginBottom: 2,
  },
  rowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 6,
    gap: 12,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
  },
  rowPrimary: {
    fontSize: 15,
    fontWeight: '600',
  },
  rowSecondary: {
    fontSize: 13,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 10,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  quickDestinationsSection: {
    marginBottom: 16,
  },
  quickDestTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  quickDestScroll: {
    gap: 12,
  },
  quickDestCard: {
    width: 150,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    marginRight: 12,
  },
  quickDestIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickDestName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  quickDestAddress: {
    fontSize: 12,
    lineHeight: 16,
  },
});
