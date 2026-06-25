import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AppThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: AppThemeMode;
}

const initialState: ThemeState = {
  mode: 'system',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<AppThemeMode>) => {
      state.mode = action.payload;
    },
  },
});

export const { setThemeMode } = themeSlice.actions;
export default themeSlice.reducer;
