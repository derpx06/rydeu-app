import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LocationData } from './locationSlice';

export type RideType = 'saloon' | 'estate' | 'executive';

export type RideOption = {
  id: RideType;
  label: string;
  icon: string;
  baseFare: number;
  perKm: number;
  eta: string;
  capacity: string;
  description: string;
};

export const RIDE_OPTIONS: RideOption[] = [
  { id: 'saloon',    label: 'Saloon',    icon: 'car-outline',  baseFare: 55,  perKm: 14, eta: '5 min',  capacity: '2-3 person', description: 'Comfortable sedan' },
  { id: 'estate',    label: 'Estate',    icon: 'car',          baseFare: 75,  perKm: 18, eta: '7 min',  capacity: '3-4 person', description: 'Spacious estate car' },
  { id: 'executive', label: 'Executive', icon: 'car-sport',    baseFare: 95,  perKm: 23, eta: '9 min',  capacity: '3-4 person', description: 'Premium ride' },
];

export type RouteInfo = {
  encodedPolyline: string;
  coordinates: { latitude: number; longitude: number }[];
  distanceMeters: number;
  durationSeconds: number;
};

type RideState = {
  pickup: LocationData | null;
  destination: LocationData | null;
  route: RouteInfo | null;
  routeLoading: boolean;
  routeError: string | null;
  selectedRideType: RideType;
};

const initialState: RideState = {
  pickup: null,
  destination: null,
  route: null,
  routeLoading: false,
  routeError: null,
  selectedRideType: 'saloon',
};

const rideSlice = createSlice({
  name: 'ride',
  initialState,
  reducers: {
    setRidePickup: (state, action: PayloadAction<LocationData | null>) => {
      state.pickup = action.payload;
      // Clear route whenever pickup changes
      state.route = null;
      state.routeError = null;
    },
    setRideDestination: (state, action: PayloadAction<LocationData | null>) => {
      state.destination = action.payload;
      state.route = null;
      state.routeError = null;
    },
    setRoute: (state, action: PayloadAction<RouteInfo>) => {
      state.route = action.payload;
      state.routeLoading = false;
      state.routeError = null;
    },
    setRouteLoading: (state, action: PayloadAction<boolean>) => {
      state.routeLoading = action.payload;
    },
    setRouteError: (state, action: PayloadAction<string>) => {
      state.routeError = action.payload;
      state.routeLoading = false;
    },
    setSelectedRideType: (state, action: PayloadAction<RideType>) => {
      state.selectedRideType = action.payload;
    },
    clearRide: (state) => {
      state.destination = null;
      state.route = null;
      state.routeLoading = false;
      state.routeError = null;
    },
    resetRide: (state) => {
      state.pickup = initialState.pickup;
      state.destination = initialState.destination;
      state.route = initialState.route;
      state.routeLoading = initialState.routeLoading;
      state.routeError = initialState.routeError;
      state.selectedRideType = initialState.selectedRideType;
    },
  },
});

export const {
  setRidePickup,
  setRideDestination,
  setRoute,
  setRouteLoading,
  setRouteError,
  setSelectedRideType,
  clearRide,
  resetRide,
} = rideSlice.actions;

export default rideSlice.reducer;

// ── Selectors ─────────────────────────────────────────────────────────────────
export function computeFare(distanceMeters: number, option: RideOption): number {
  const km = distanceMeters / 1000;
  return Math.round(option.baseFare + option.perKm * km);
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${meters} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}
