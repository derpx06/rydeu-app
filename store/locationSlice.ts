import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type LocationData = {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
};

type LocationState = {
  pickup: LocationData | null;
  dropoff: LocationData | null;
  recentSearches: LocationData[];
};

const initialState: LocationState = {
  pickup: null,
  dropoff: null,
  recentSearches: [],
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setPickup: (state, action: PayloadAction<LocationData | null>) => {
      state.pickup = action.payload;
    },
    setDropoff: (state, action: PayloadAction<LocationData | null>) => {
      state.dropoff = action.payload;
    },
    addRecentSearch: (state, action: PayloadAction<LocationData>) => {
      const location = action.payload;
      // Filter out existing duplicates based on address or coordinates
      const filtered = state.recentSearches.filter(
        (item) => item.address !== location.address && item.name !== location.name
      );
      // Limit to most recent 5 searches
      state.recentSearches = [location, ...filtered].slice(0, 5);
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
    resetLocation: (state) => {
      state.pickup = initialState.pickup;
      state.dropoff = initialState.dropoff;
      state.recentSearches = initialState.recentSearches;
    },
  },
});

export const { setPickup, setDropoff, addRecentSearch, clearRecentSearches, resetLocation } = locationSlice.actions;
export default locationSlice.reducer;
