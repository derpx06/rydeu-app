import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DestinationMarker, PickupMarker } from '@/components/map/CustomMarker';
import { LocationSearchOverlay } from '@/components/ride/LocationSearchOverlay';
import { RideBottomSheet, type BookingStep } from '@/components/ride/RideBottomSheet';
import { RideOptionCard } from '@/components/map/RideOptionCard';
import { SearchCard } from '@/components/ride/SearchCard';
import { AppText } from '@/components/ui/app-text';
import { useAppTheme } from '@/constants/app-theme';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import { useRoutes } from '@/hooks/useRoutes';
import { useAppDispatch, useAppSelector } from '@/store';
import { setRidePickup, clearRide, setSelectedRideType, RIDE_OPTIONS } from '@/store/rideSlice';

type SearchField = 'pickup' | 'destination';

const DEFAULT_REGION = {
  latitude: 18.5204,
  longitude: 73.8567,
  latitudeDelta: 0.07,
  longitudeDelta: 0.07,
};

export default function MapScreen() {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const mapRef = useRef<MapView>(null);

  // ── State ────────────────────────────────────────────────────────────────────
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchField, setSearchField] = useState<SearchField>('destination');
  const [bookingStep, setBookingStep] = useState<BookingStep>(1);

  const pickup = useAppSelector((s) => s.ride.pickup);
  const destination = useAppSelector((s) => s.ride.destination);
  const route = useAppSelector((s) => s.ride.route);
  const routeLoading = useAppSelector((s) => s.ride.routeLoading);
  const selectedRideType = useAppSelector((s) => s.ride.selectedRideType);

  const distanceMeters = route?.distanceMeters || 0;

  // ── Location & Route hooks ────────────────────────────────────────────────
  const { coords, permissionDenied, retry } = useCurrentLocation();
  useRoutes(); // auto-fetches route whenever pickup+destination change

  // ── Auto-set pickup from GPS on first load ───────────────────────────────
  useEffect(() => {
    if (coords && !pickup) {
      dispatch(setRidePickup({
        name: coords.address || 'Current Location',
        address: coords.address || '',
        latitude: coords.latitude,
        longitude: coords.longitude,
      }));
    }
  }, [coords, pickup, dispatch]);


  
  // ── Center map on current location ──────────────────────────────────────
  useEffect(() => {
    if (coords && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.025,
          longitudeDelta: 0.025,
        },
        900,
      );
    }
  }, [coords]);

  // ── Fit map when route is loaded ─────────────────────────────────────────
  useEffect(() => {
    if (route && route.coordinates.length > 1 && mapRef.current) {
      const bottomPad = 320; // accounts for RideBottomSheet height
      setTimeout(() => {
        mapRef.current?.fitToCoordinates(route.coordinates, {
          edgePadding: {
            top: insets.top + 160,
            right: 40,
            bottom: bottomPad,
            left: 40,
          },
          animated: true,
        });
      }, 300);
    }
  }, [route, insets.top]);

  // ── Recenter button ──────────────────────────────────────────────────────
  const handleRecenter = useCallback(() => {
    if (coords && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.025,
          longitudeDelta: 0.025,
        },
        600,
      );
    }
  }, [coords]);

  // ── Reset Booking Flow ────────────────────────────────────────────────────
  const resetBookingFlow = useCallback(() => {
    setBookingStep(1);
    dispatch(setSelectedRideType(null));
  }, [dispatch]);

  // ── Open search overlay ──────────────────────────────────────────────────
  const openSearch = useCallback((field: SearchField) => {
    setSearchField(field);
    setSearchVisible(true);
  }, []);

  // ── Clear ride ───────────────────────────────────────────────────────────
  const handleClearDestination = useCallback(() => {
    dispatch(clearRide());
  }, [dispatch]);

  // ── Confirm booking ───────────────────────────────────────────────────────
  const handleConfirm = useCallback(() => {
    Alert.alert(
      'Ride Confirmed! 🎉',
      `Looking for ${pickup?.name ?? 'pickup'} → ${destination?.name ?? 'destination'}.`,
    );
  }, [pickup, destination]);

  // ── Permission denied screen ────────────────────────────────────────────
  if (permissionDenied) {
    return (
      <View style={styles.centeredScreen}>
        <Ionicons name="location-outline" size={56} color="#CBD5E1" />
        <AppText style={styles.permTitle}>Location Access Required</AppText>
        <AppText style={styles.permDesc}>
          Rydeu needs your location to show nearby rides and calculate routes.
        </AppText>
        <TouchableOpacity style={styles.retryBtn} onPress={retry}>
          <AppText style={styles.retryBtnText}>Grant Permission</AppText>
        </TouchableOpacity>
      </View>
    );
  }

  const showBottomSheet = !!destination;
  const hasRoute = !!route;
  const showRideSelector = showBottomSheet && bookingStep === 4 && !!route && !routeLoading;
  const isDark = theme.bg.app === '#000000' || theme.bg.app === '#0F172A';
  const mapStyle = isDark ? DARK_MAP_STYLE : LIGHT_MAP_STYLE;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg.app }]}>
      {/* ── Full-screen Map ─────────────────────────────────────────────────── */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        initialRegion={DEFAULT_REGION}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        showsTraffic={false}
        toolbarEnabled={false}
        mapPadding={{ top: 0, right: 0, bottom: showBottomSheet ? 280 : 100, left: 0 }}
        customMapStyle={mapStyle}
      >
        {/* Route polyline */}
        {hasRoute && (
          <Polyline
            coordinates={route!.coordinates}
            strokeColor={isDark ? '#F8FAFC' : '#0F172A'}
            strokeWidth={4}
            lineCap="round"
            lineJoin="round"
          />
        )}

        {/* Pickup marker */}
        {pickup && (
          <Marker
            coordinate={{ latitude: pickup.latitude, longitude: pickup.longitude }}
            anchor={{ x: 0.5, y: 0.5 }}
            tracksViewChanges={false}
          >
            <PickupMarker />
          </Marker>
        )}

        {/* Destination marker */}
        {destination && (
          <Marker
            coordinate={{ latitude: destination.latitude, longitude: destination.longitude }}
            anchor={{ x: 0.5, y: 1 }}
            tracksViewChanges={false}
          >
            <DestinationMarker />
          </Marker>
        )}
      </MapView>

    
      {/* ── Floating Search Card (hidden when booking sheet is active) ──── */}
      {!showBottomSheet && (
        <SearchCard
          onPickupPress={() => openSearch('pickup')}
          onDestinationPress={() => openSearch('destination')}
        />
      )}
{/* ── Floating action buttons ─────────────────────────────────────────── */}
<View style={[styles.floatingButtons, { top: insets.top + 148 }]}>
  {/* Recenter / Target Button */}
  <TouchableOpacity style={[styles.fab, { backgroundColor: isDark ? '#1E2937' : '#FFFFFF' }]} onPress={handleRecenter}>
    <Ionicons 
      name="locate" 
      size={22} 
      color={isDark ? '#E2E8F0' : '#0F172A'} 
    />
  </TouchableOpacity>

  {/* Clear route Button */}
  {destination && (
    <TouchableOpacity 
      style={[styles.fab, { backgroundColor: isDark ? '#1E2937' : '#FFFFFF' }]} 
      onPress={handleClearDestination}
    >
      <Ionicons 
        name="close" 
        size={22} 
        color={isDark ? '#F87171' : '#EF4444'} 
      />
    </TouchableOpacity>
  )}
</View>

      {/* ── Route Loading Indicator ─────────────────────────────────────────── */}
      {routeLoading && (
        <View style={styles.routeLoadingBadge}>
          <AppText style={styles.routeLoadingText}>Finding best route…</AppText>
        </View>
      )}

      {/* ── Ride Selection Cards (above bottom sheet) ───────────────────────── */}
      {showRideSelector && (
        <View style={[styles.rideSelectionContainer, { bottom: insets.bottom + 510 }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rideSelectionScroll}
          >
            {RIDE_OPTIONS.map((option) => (
              <RideOptionCard
                key={option.id}
                option={option}
                distanceMeters={distanceMeters}
                selected={selectedRideType === option.id}
                onPress={() => dispatch(setSelectedRideType(option.id))}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* ── Ride Bottom Sheet ────────────────────────────────────────────────── */}
      <RideBottomSheet
        visible={showBottomSheet}
        onConfirm={handleConfirm}
        onPickupPress={() => openSearch('pickup')}
        onDestinationPress={() => openSearch('destination')}
        onStepChange={setBookingStep}
      />

      {/* ── Location Search Overlay ──────────────────────────────────────────── */}
      <LocationSearchOverlay
        visible={searchVisible}
        initialField={searchField}
        onClose={() => {
          setSearchVisible(false);
          resetBookingFlow();
        }}
      />
    </View>
  );
}

// ── Subtle custom map style (dark road labels, lighter water) ─────────────────
const MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.arterial', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#dadada' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
  { featureType: 'transit.line', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9c9c9' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  tripTypeContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 15,
  },

  // ── Permission screen ───────────────────────────────────────────────────────
  centeredScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    gap: 16,
    backgroundColor: '#FFFFFF',
  },
  permTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  permDesc: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  retryBtn: {
    marginTop: 8,
    height: 50,
    paddingHorizontal: 32,
    borderRadius: 25,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },

  // ── Floating buttons ─────────────────────────────────────────────────────────
  floatingButtons: {
    position: 'absolute',
    right: 16,
    gap: 10,
    zIndex: 20,
  },
  fab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 8,
  },

  // ── Route loading badge ──────────────────────────────────────────────────────
  routeLoadingBadge: {
    position: 'absolute',
    bottom: 310,
    alignSelf: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 25,
  },
  routeLoadingText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  rideSelectionContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 30,
  },
  rideSelectionScroll: {
    paddingHorizontal: 12,
    gap: 10,
  },
});
// ── Map Styles ───────────────────────────────────────────────────────────────
const LIGHT_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.arterial', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#dadada' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
  { featureType: 'transit.line', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9c9c9' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
];

const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#1e2937' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#cbd5e1' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1e2937' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#334155' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#475569' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#64748b' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#e2e8f0' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#475569' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#475569' }] },
  { featureType: 'administrative.country', elementType: 'labels.text.fill', stylers: [{ color: '#e2e8f0' }] },
];