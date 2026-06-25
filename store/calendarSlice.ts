import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';

export type TripType = 'oneWay' | 'roundTrip' | 'hourly';

export type PassengerCounts = {
  adults: number;
  children: number;
  smallBags: number;
  largeBags: number;
};

export type Duration = {
  hours: number;
  minutes: number;
};

type CalendarState = {
  selectedDateTimeIso: string;
  returnDateTimeIso: string;
  passengers: PassengerCounts;
  tripType: TripType;
  duration: Duration;
};

const initialState: CalendarState = {
  selectedDateTimeIso: moment().minutes(0).seconds(0).milliseconds(0).toISOString(),
  returnDateTimeIso: moment().add(1, 'day').minutes(0).seconds(0).milliseconds(0).toISOString(),
  passengers: {
    adults: 1,
    children: 0,
    smallBags: 0,
    largeBags: 0,
  },
  tripType: 'oneWay',
  duration: { hours: 2, minutes: 0 },
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setSelectedDateTime: (state, action: PayloadAction<string>) => {
      state.selectedDateTimeIso = action.payload;
    },
    setReturnDateTime: (state, action: PayloadAction<string>) => {
      state.returnDateTimeIso = action.payload;
    },
    setPassengers: (state, action: PayloadAction<PassengerCounts>) => {
      state.passengers = action.payload;
    },
    setTripType: (state, action: PayloadAction<TripType>) => {
      state.tripType = action.payload;
    },
    setDuration: (state, action: PayloadAction<Duration>) => {
      state.duration = action.payload;
    },
    resetCalendar: (state) => {
      state.selectedDateTimeIso = initialState.selectedDateTimeIso;
      state.returnDateTimeIso = initialState.returnDateTimeIso;
      state.passengers = initialState.passengers;
      state.tripType = initialState.tripType;
      state.duration = initialState.duration;
    },
  },
});

export const { setSelectedDateTime, setReturnDateTime, setPassengers, setTripType, setDuration, resetCalendar } = calendarSlice.actions;
export default calendarSlice.reducer;
