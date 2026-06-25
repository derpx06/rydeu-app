import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  AuthSession,
  AuthUser,
  LoginCredentials,
  clearStoredSession,
  loginCustomer,
  restoreStoredSession,
} from '@/services/auth-service';
import { resetCalendar } from './calendarSlice';
import { resetRide } from './rideSlice';
import { resetLocation } from './locationSlice';

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  hasRestoredSession: boolean;
  hasCompletedOnboarding: boolean;
};

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  hasRestoredSession: false,
  hasCompletedOnboarding: false,
};

export const restoreSession = createAsyncThunk<AuthSession | null>('auth/restoreSession', restoreStoredSession);

export const login = createAsyncThunk<AuthSession, LoginCredentials, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      return await loginCustomer(credentials);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unable to sign in. Please try again.');
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  await clearStoredSession();
  dispatch(resetCalendar());
  dispatch(resetRide());
  dispatch(resetLocation());
  return true;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    completeOnboarding: (state) => {
      state.hasCompletedOnboarding = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.user = action.payload?.user ?? null;
        state.token = action.payload?.token ?? null;
        state.isAuthenticated = Boolean(action.payload?.token);
        state.hasRestoredSession = true;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.hasRestoredSession = true;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Unable to sign in. Please try again.';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearAuthError, completeOnboarding } = authSlice.actions;
export default authSlice.reducer;
