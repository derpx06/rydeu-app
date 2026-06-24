import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';

type CalendarState = {
  selectedDateTimeIso: string;
};

const initialState: CalendarState = {
  selectedDateTimeIso: moment().minutes(0).seconds(0).milliseconds(0).toISOString(),
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setSelectedDateTime: (state, action: PayloadAction<string>) => {
      state.selectedDateTimeIso = action.payload;
    },
  },
});

export const { setSelectedDateTime } = calendarSlice.actions;
export default calendarSlice.reducer;
