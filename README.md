# Rydeu React Native Assignment

Expo React Native app for the Rydeu developer assignment. It includes a local customer login flow, persisted Redux auth state, a protected home screen, and a custom six-month Moment.js date/time picker.

## Features

- One-field local customer login while API verification is temporarily disabled
- First launch opens the login screen until a session is saved
- Redux Toolkit state for authentication and selected pickup date/time
- Temporary in-memory demo auth while native storage/API checks are disabled
- Protected home route with user details and selected pickup schedule
- Custom Moment.js calendar showing six months
- Bottom-sheet date/time selection UI

## Demo Login

```text
Email: rydeu@email10p.org
```

## Getting Started

Use Node 20 or 22. Node 25 currently trips an Expo CLI port-scanner error before Metro starts.

```bash
npm install
npm run start
```

Then open the app in Expo Go, an Android emulator, or an iOS simulator.

## Useful Scripts

```bash
npm run start
npm run android
npm run ios
npm run web
npm run lint
```

## Project Structure

```text
app/
  _layout.tsx                  App providers and protected routing shell
  index.tsx                    Authenticated home screen
  login.tsx                    Login screen
components/
  bottom-sheet/                Reusable bottom-sheet provider and manager
  calendar/                    Custom Moment.js date/time picker
  ui/                          Shared app UI primitives
constants/
  app-theme.ts                 App color and theme tokens
services/
  auth-service.ts              Login API and persisted session helpers
store/
  authSlice.ts                 Auth state and async actions
  calendarSlice.ts             Selected date/time state
  index.ts                     Redux store setup and typed hooks
```

## Notes

The calendar is implemented in-app with Moment.js rather than using a native date picker library, as required by the assignment. The login service currently creates an in-memory local session from the email field; the Redux slice is already structured so real API and storage can be restored inside `services/auth-service.ts`.
