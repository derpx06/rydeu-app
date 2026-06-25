import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { useAppTheme } from '@/constants/app-theme';
import { NEUTRAL_COLORS } from '@/constants/theme';

import { searchPlaces, getPlaceDetails, PlaceSuggestion } from '@/services/googlePlaces';
import { useAppDispatch, useAppSelector } from '@/store';
import { addRecentSearch, LocationData } from '@/store/locationSlice';
import { setRidePickup, setRideDestination } from '@/store/rideSlice';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type SearchField = 'pickup' | 'destination';

type QuickDestination = {
  id: string;
  name: string;
  address: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgColor: string;
};

type Props = {
  visible: boolean;
  initialField: SearchField;
  onClose: () => void;
  showQuickDestinations?: boolean;
};

const QUICK_DESTINATIONS: QuickDestination[] = [
  { id: 'home', name: 'Home', address: 'Your saved home address', icon: 'home-outline', color: '#E31837', bgColor: '#FFEBEE' },
  { id: 'work', name: 'Work', address: 'Your saved work address', icon: 'briefcase-outline', color: '#2196F3', bgColor: '#E3F2FD' },
  { id: 'airport', name: 'Airport', address: 'Nearest airport terminal', icon: 'airplane-outline', color: '#FF9800', bgColor: '#FFF3E0' },
  { id: 'hotel', name: 'Hotel', address: 'Popular hotels nearby', icon: 'bed-outline', color: '#9C27B0', bgColor: '#F3E5F5' },
];

export function LocationSearchOverlay({ visible, initialField, onClose, showQuickDestinations = true }: Props) {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const dispatch = useAppDispatch();

  const recentSearches = useAppSelector((s) => s.location.recentSearches);

  const [activeField, setActiveField] = useState<SearchField>(initialField);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [resolving, setResolving] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<TextInput>(null);

  const isDark = theme.bg.app === NEUTRAL_COLORS.black || theme.bg.app === '#0F172A';

  // ── Animate in/out ──────────────────────────────────────────────────────────
  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: visible ? 0 : SCREEN_HEIGHT,
      useNativeDriver: true,
      damping: 22,
      stiffness: 200,
    }).start();

    if (visible) {
      setActiveField(initialField);
      setQuery('');
      setSuggestions([]);
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [visible, initialField, slideAnim]);

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
      } catch {
        setApiError('Could not fetch suggestions.');
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  const commitLocation = useCallback(
    (data: LocationData) => {
      if (activeField === 'pickup') dispatch(setRidePickup(data));
      else dispatch(setRideDestination(data));
      dispatch(addRecentSearch(data));

      if (activeField === 'pickup') {
        setActiveField('destination');
        setQuery('');
        setSuggestions([]);
        setTimeout(() => inputRef.current?.focus(), 100);
      } else {
        onClose();
      }
    },
    [activeField, dispatch, onClose],
  );

  const handleSelectSuggestion = useCallback(
    async (s: PlaceSuggestion) => {
      setResolving(s.placeId);
      try {
        const details = await getPlaceDetails(s.placeId);
        if (details) {
          commitLocation({
            name: details.name || s.name,
            address: details.address || s.address,
            latitude: details.latitude,
            longitude: details.longitude,
          });
        }
      } catch {
        setApiError('Could not load place details.');
      } finally {
        setResolving(null);
      }
    },
    [commitLocation],
  );

  const handleSelectStatic = useCallback(
    (loc: LocationData) => commitLocation(loc),
    [commitLocation],
  );

  return (
    <Animated.View
      style={[
        styles.overlay,
        { 
          backgroundColor: theme.bg.app,
          transform: [{ translateY: slideAnim }] 
        },
      ]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + 8, borderBottomColor: theme.border.default }]}>
        <TouchableOpacity style={styles.backBtn} onPress={onClose} hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}>
          <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
        </TouchableOpacity>

        <Image 
          source={require('@/assets/images/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Field toggle pills */}
        <View style={styles.fieldTabs}>
          {(['pickup', 'destination'] as SearchField[]).map((f) => (
            <TouchableOpacity
              key={f}
              style={[
                styles.fieldTab,
                activeField === f && styles.fieldTabActive,
                { 
                  backgroundColor: activeField === f ? theme.brand.primary : theme.bg.surface,
                  borderColor: activeField === f ? theme.brand.primary : theme.border.default
                }
              ]}
              onPress={() => { setActiveField(f); setQuery(''); setSuggestions([]); }}
            >
              <AppText style={[
                styles.fieldTabText,
                activeField === f && styles.fieldTabTextActive,
                { color: activeField === f ? '#FFFFFF' : theme.text.secondary }
              ]}>
                {f === 'pickup' ? 'Pickup' : 'Destination'}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── Search Input ─────────────────────────────────────────────────────── */}
      <View style={[
        styles.inputWrap,
        {
          backgroundColor: theme.bg.card,
          borderColor: theme.border.default,
        }
      ]}>
        <View style={[
          styles.dotIndicator, 
          activeField === 'pickup' ? styles.dotPickup : [styles.dotDest, { backgroundColor: theme.text.primary }]
        ]} />
        <TextInput
          ref={inputRef}
          style={[styles.input, { color: theme.text.primary }]}
          placeholder={activeField === 'pickup' ? 'Search pickup location…' : 'Where to?'}
          placeholderTextColor={theme.text.placeholder}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          returnKeyType="search"
          autoCorrect={false}
        />
        {loading ? (
          <ActivityIndicator size="small" color={theme.text.secondary} />
        ) : query.length > 0 ? (
          <TouchableOpacity onPress={() => { setQuery(''); setSuggestions([]); }}>
            <Ionicons name="close-circle" size={22} color={theme.text.secondary} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* ── Error ────────────────────────────────────────────────────────────── */}
      {apiError && (
        <View style={[styles.errorRow, { backgroundColor: isDark ? '#450A0A' : theme.status.error + '10' }]}>
          <Ionicons name="warning-outline" size={16} color={theme.status.error} />
          <AppText style={styles.errorText}>{apiError}</AppText>
        </View>
      )}

      {/* ── Quick Destinations ───────────────────────────────────────────────── */}
      {!query.trim() && activeField === 'destination' && showQuickDestinations && (
        <View style={styles.quickDestinationsSection}>
          <AppText style={[styles.quickDestTitle, { color: theme.text.primary }]}>
            Where are we going today?
          </AppText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickDestScroll}
          >
            {QUICK_DESTINATIONS.map((dest) => (
              <TouchableOpacity
                key={dest.id}
                style={[
                  styles.quickDestCard,
                  { backgroundColor: theme.bg.card, borderColor: theme.border.default }
                ]}
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
                  <Ionicons name={dest.icon} size={26} color={isDark ? theme.text.primary : dest.color} />
                </View>
                <AppText style={[styles.quickDestName, { color: theme.text.primary }]}>
                  {dest.name}
                </AppText>
                <AppText style={[styles.quickDestAddress, { color: theme.text.secondary }]} numberOfLines={1}>
                  {dest.address}
                </AppText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* ── Results / History ────────────────────────────────────────────────── */}
      <FlatList<PlaceSuggestion | LocationData>
        data={(query.trim() ? suggestions : recentSearches) as (PlaceSuggestion | LocationData)[]}
        keyExtractor={(item, i) => 'placeId' in item ? (item as PlaceSuggestion).placeId : `recent-${i}`}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <AppText style={[styles.sectionLabel, { color: theme.text.secondary }]}>
            {query.trim() ? 'Search Results' : 'Recent Searches'}
          </AppText>
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <Ionicons name="map-outline" size={42} color={theme.border.default} />
              <AppText style={[styles.emptyText, { color: theme.text.secondary }]}>
                {query.trim() ? `No results for "${query}"` : 'Start typing to search for a location'}
              </AppText>
            </View>
          ) : null
        }
        renderItem={({ item }) => {
          const isPlaceSuggestion = 'placeId' in item;
          const primary = isPlaceSuggestion ? (item as PlaceSuggestion).name : (item as LocationData).name;
          const secondary = isPlaceSuggestion ? (item as PlaceSuggestion).address : (item as LocationData).address;
          const placeId = isPlaceSuggestion ? (item as PlaceSuggestion).placeId : null;
          const isResolving = placeId && resolving === placeId;

          return (
            <TouchableHighlight
              underlayColor={theme.bg.surface}
              style={[
                styles.resultRow,
                { backgroundColor: theme.bg.card, borderColor: theme.border.default }
              ]}
              onPress={() =>
                isPlaceSuggestion
                  ? handleSelectSuggestion(item as PlaceSuggestion)
                  : handleSelectStatic(item as LocationData)
              }
              disabled={!!isResolving}
            >
              <View style={styles.resultRowInner}>
                <View style={[styles.resultIcon, { backgroundColor: theme.bg.surface }]}>
                  <Ionicons
                    name={isPlaceSuggestion ? 'location-outline' : 'time-outline'}
                    size={20}
                    color={theme.text.secondary}
                  />
                </View>
                <View style={styles.resultText}>
                  <AppText style={[styles.resultPrimary, { color: theme.text.primary }]} numberOfLines={1}>
                    {primary}
                  </AppText>
                  {secondary && (
                    <AppText style={[styles.resultSecondary, { color: theme.text.secondary }]} numberOfLines={1}>
                      {secondary}
                    </AppText>
                  )}
                </View>
                {isResolving && <ActivityIndicator size="small" color={theme.text.secondary} />}
              </View>
            </TouchableHighlight>
          );
        }}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 40,
    height: 40,
  },
  fieldTabs: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  fieldTab: {
    flex: 1,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  fieldTabActive: {
    backgroundColor: '#E31837',
    borderColor: '#E31837',
  },
  fieldTabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  fieldTabTextActive: {
    color: '#FFFFFF',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
    height: 58,
    borderRadius: 18,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  dotIndicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  dotPickup: {
    backgroundColor: '#E31837',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  dotDest: {
    backgroundColor: '#0F172A',
    borderRadius: 4,
  },
  input: {
    flex: 1,
    fontSize: 16.5,
    fontWeight: '600',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    flex: 1,
  },
  quickDestinationsSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  quickDestTitle: {
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 14,
  },
  quickDestScroll: {
    gap: 12,
    paddingRight: 16,
  },
  quickDestCard: {
    width: 158,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  quickDestIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  quickDestName: {
    fontSize: 16.5,
    fontWeight: '700',
    marginBottom: 4,
  },
  quickDestAddress: {
    fontSize: 12.5,
    lineHeight: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: 8,
    marginTop: 12,
  },
  resultRow: {
    borderRadius: 14,
    marginBottom: 6,
    borderWidth: 1,
  },
  resultRowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 14,
    gap: 14,
  },
  resultIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultText: {
    flex: 1,
    minWidth: 0,
  },
  resultPrimary: {
    fontSize: 15.5,
    fontWeight: '600',
  },
  resultSecondary: {
    fontSize: 13.5,
    marginTop: 3,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 14,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    maxWidth: '80%',
  },
});
