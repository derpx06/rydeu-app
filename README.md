# Rydeu React Native Assignment

Expo React Native app for the Rydeu developer assignment. It includes a local customer login flow, persisted Redux auth state, a protected home screen, and a custom six-month Moment.js date/time picker.


##Screenshots

Login Page
<img width="681" height="1505" alt="image" src="https://github.com/user-attachments/assets/b2106005-91a5-4f13-bfcd-4ac2023b33aa" />


##Light Theme
home screen
<img width="681" height="1505" alt="image" src="https://github.com/user-attachments/assets/996d5a42-89cb-44c1-8524-28c297b03859" />

Location
<img width="681" height="1505" alt="image" src="https://github.com/user-attachments/assets/d3a674b2-6a7a-4145-b336-d7fff5952b98" />


Calrendar component
<img width="681" height="1505" alt="image" src="https://github.com/user-attachments/assets/c0f5544a-72bd-44e3-bca9-bd451cce7eda" />

Duration Selector
<img width="681" height="1505" alt="image" src="https://github.com/user-attachments/assets/4974e979-78c1-4e64-8507-87251fe3ec2e" />

Pasengers and baggage
<img width="681" height="1505" alt="image" src="https://github.com/user-attachments/assets/fe505e60-a991-4076-82ae-3c628957071f" />


Additional options
<img width="681" height="1505" alt="image" src="https://github.com/user-attachments/assets/2abd9cd0-c06e-4949-af89-82464b274dc1" />

Summmary
<img width="681" height="1505" alt="image" src="https://github.com/user-attachments/assets/a6aa9fe3-9ca3-4535-96e2-bad4e36cc957" />

Location picker
<img width="681" height="1505" alt="image" src="https://github.com/user-attachments/assets/771d14a1-dbaa-4162-b537-bd289f592406" />


Dark

Settings 
<img width="681" height="1505" alt="image" src="https://github.com/user-attachments/assets/fbb69b84-989f-4cfe-a9c7-a0e1197655d3" />

homepage
<img width="681" height="1505" alt="image" src="https://github.com/user-attachments/assets/9cd76471-7272-40e6-94a0-d5d893292e2d" />

location selection

<img width="681" height="1505" alt="image" src="https://github.com/user-attachments/assets/b2bfcde5-bd5b-4aff-85d3-ac4cf84c21ed" />


Date and Tie selction
<img width="681" height="1505" alt="image" src="https://github.com/user-attachments/assets/12c54563-0b47-4f9d-a2ed-d6efed40bf25" />

Pakcages
<img width="681" height="1505" alt="image" src="https://github.com/user-attachments/assets/2137712d-2f6d-42da-aa4d-6c16dd9b65f8" />

summary
<img width="681" height="1505" alt="image" src="https://github.com/user-attachments/assets/604d2c49-7e7a-42ce-a312-3033a453a738" />


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
