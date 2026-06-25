# Rydeu – React Native Developer Assignment

A production-ready **React Native (Expo)** application developed as part of the **Rydeu React Native Developer Assignment**. The project demonstrates authentication, protected navigation, Redux state management, Google Maps integration, and a fully custom six-month calendar built with **Moment.js**.


<img width="480" height="480" alt="image" src="https://github.com/user-attachments/assets/461a7767-0bc6-46d5-9506-4fca517e43df" />

---


## 📥 Downloads

Download and try the latest build of **Rydeu**.

| Download | Link |
|----------|------|
| ☁️ Google Drive | [Google Drive Mirror](https://drive.google.com/file/d/1RbdUVGc2QmK1hxJMO-J57OSj_Ot89FYg/view?usp=sharing) |


## Assignment Overview

The objective of this assignment was to develop a React Native application that includes:

- User authentication using the provided Login API
- Protected navigation
- State management
- A custom **6-month calendar** built using **Moment.js**
- Date & Time selection
- Logout functionality
- Responsive UI for Android and iOS

In addition to the required functionality, the application includes **Google Maps integration** for selecting pickup and destination locations while maintaining a clean, modern user experience inspired by the Rydeu application.

---

# Screenshots

## Light Theme

| Landing Screen | Login Screen |
|---------------|--------------|
| ![](https://github.com/user-attachments/assets/3aaed873-5e35-4f0d-8f7f-20ad0c0617e1) | ![](https://github.com/user-attachments/assets/b2106005-91a5-4f13-bfcd-4ac2023b33aa) |

| Home Screen | Pickup & Drop |
|-------------|---------------|
| ![](https://github.com/user-attachments/assets/996d5a42-89cb-44c1-8524-28c297b03859) | ![](https://github.com/user-attachments/assets/d3a674b2-6a7a-4145-b336-d7fff5952b98) |

| Custom Calendar | Duration |
|-----------------|----------|
| ![](https://github.com/user-attachments/assets/c0f5544a-72bd-44e3-bca9-bd451cce7eda) | ![](https://github.com/user-attachments/assets/4974e979-78c1-4e64-8507-87251fe3ec2e) |

| Passengers & Baggage | Additional Options |
|----------------------|--------------------|
| ![](https://github.com/user-attachments/assets/fe505e60-a991-4076-82ae-3c628957071f) | ![](https://github.com/user-attachments/assets/2abd9cd0-c06e-4949-af89-82464b274dc1) |

| Booking Summary | Interactive Map |
|-----------------|-----------------|
| ![](https://github.com/user-attachments/assets/a6aa9fe3-9ca3-4535-96e2-bad4e36cc957) | ![](https://github.com/user-attachments/assets/771d14a1-dbaa-4162-b537-bd289f592406) |

---

## Dark Theme

| Settings | Home |
|----------|------|
| ![](https://github.com/user-attachments/assets/fbb69b84-989f-4cfe-a9c7-a0e1197655d3) | ![](https://github.com/user-attachments/assets/9cd76471-7272-40e6-94a0-d5d893292e2d) |

| Location Selection | Date & Time |
|--------------------|------------|
| ![](https://github.com/user-attachments/assets/b2bfcde5-bd5b-4aff-85d3-ac4cf84c21ed) | ![](https://github.com/user-attachments/assets/12c54563-0b47-4f9d-a2ed-d6efed40bf25) |

| Packages | Booking Summary |
|----------|-----------------|
| ![](https://github.com/user-attachments/assets/2137712d-2f6d-42da-aa4d-6c16dd9b65f8) | ![](https://github.com/user-attachments/assets/604d2c49-7e7a-42ce-a312-3033a453a738) |

---

# Features

### Authentication

- Login using Email & Password
- API-based authentication
- Persistent login session
- Protected routes
- Logout functionality

### Home Screen

- User information
- Booking workflow
- Pickup & destination selection
- Date & Time selection
- Booking summary

### Custom Calendar

- Built completely from scratch
- Uses Moment.js
- Displays six months
- Custom UI implementation
- Date selection
- Time selection

### Google Maps

- Interactive map
- Pickup location selection
- Destination selection
- Marker support
- Location preview

### State Management

- Redux Toolkit
- React Redux
- Centralized authentication state
- Booking state
- Theme state

### User Experience

- Light Theme
- Dark Theme
- Responsive UI
- Bottom Sheet interactions
- Modern interface
- Reusable components

---

# Demo Credentials

| Email | Password |
|--------|----------|
| `rydeu@email10p.org` | `123456` |

---

# Login API

```bash
curl --location 'https://new-api-staging.rydeu.com/login' \
--header 'Content-Type: application/json' \
--data-raw '{
  "email":"rydeu@email10p.org",
  "password":"123456",
  "type":"customer"
}'
```

---

# Tech Stack

- React Native (Expo)
- TypeScript
- Expo Router
- Redux Toolkit
- React Redux
- AsyncStorage
- Moment.js
- React Native Maps
- React Native Bottom Sheet

---

# Getting Started

## Prerequisites

- Node.js 20+
- npm
- Expo CLI
- Android Studio / Xcode (Optional)
- Expo Go (Optional)

---

## Installation

Clone the repository

```bash
git clone <repository-url>
cd rydeu-assignment
```

Install dependencies

```bash
npm install
```

Start the development server

```bash
npm run start
```

Run Android

```bash
npm run android
```

Run iOS

```bash
npm run ios
```

Run Web

```bash
npm run web
```

Lint Project

```bash
npm run lint
```

Type Check

```bash
npm run type-check
```

---

# Project Structure

```text
app/
├── _layout.tsx
├── index.tsx
├── login.tsx

components/
├── bottom-sheet/
├── calendar/
├── maps/
└── ui/

constants/
└── app-theme.ts

services/
└── auth-service.ts

store/
├── authSlice.ts
├── bookingSlice.ts
├── calendarSlice.ts
└── index.ts
```

---

# Technical Implementation

## Authentication

- Login API integration
- Protected routes
- Persistent sessions
- AsyncStorage
- Logout handling

## Navigation

- Expo Router
- Route Guards
- Authentication Flow

## Calendar

- Built from scratch
- Moment.js
- Six-month calendar
- Custom implementation

## Maps

- React Native Maps
- Pickup selection
- Drop selection
- Marker rendering

## State Management

- Redux Toolkit
- Feature-based slices
- Predictable state updates

## Code Quality

- TypeScript
- Modular architecture
- Reusable components
- Feature-based organization
- Clean coding practices

---

# Assignment Requirements Checklist

| Requirement | Status |
|-------------|:------:|
| Login Screen | ✅ |
| Email & Password Fields | ✅ |
| Login API Integration | ✅ |
| Redirect to Home | ✅ |
| First Launch Login | ✅ |
| Home Screen | ✅ |
| User Information | ✅ |
| Custom Moment.js Calendar | ✅ |
| 6-Month Calendar | ✅ |
| Date Selection | ✅ |
| Time Selection | ✅ |
| Google Maps Integration | ✅ |
| Pickup & Destination Selection | ✅ |
| Logout Functionality | ✅ |
| Protected Navigation | ✅ |
| Redux Toolkit | ✅ |
| Responsive Android | ✅ |
| Responsive iOS | ✅ |

---

# Evaluation Criteria Mapping

| Evaluation Criteria | Implementation |
|--------------------|----------------|
| Functionality | Authentication, Navigation, Calendar, Maps, Logout |
| Code Quality | TypeScript, Modular Architecture, Clean Code |
| State Management | Redux Toolkit |
| User Experience | Responsive Design, Modern UI, Dark & Light Theme |

---

# Best Practices Followed

- TypeScript throughout the project
- Component-based architecture
- Feature-based folder organization
- Redux Toolkit for scalable state management
- Protected routing
- Reusable UI components
- Responsive layouts
- Consistent coding standards
- Production-ready project structure

---

---

# UI & Performance Highlights

The application was designed with a strong emphasis on **user experience, smooth animations, and performance**. While implementing the required assignment features, additional attention was given to creating a polished and production-ready interface.

### Design Philosophy

- Clean, modern UI inspired by the Rydeu application.
- Consistent spacing, typography, and color system.
- Responsive layouts that adapt to different screen sizes.
- Light and Dark theme support.
- Reusable UI components for maintainability.
- Bottom-sheet driven interactions to minimize navigation and improve usability.

### Animation & Performance

To ensure a smooth user experience, the application uses **React Native Reanimated** instead of the traditional React Native Animated API.

Key advantages include:

- Animations execute on the **UI Thread** instead of the JavaScript thread.
- Smooth 60 FPS animations, even when the JavaScript thread is busy.
- Native-driven gesture handling.
- Better responsiveness for bottom sheets, map interactions, and transitions.
- Reduced frame drops during complex interactions.

The project leverages Reanimated for:

- Bottom sheet animations
- Screen transitions
- Interactive gestures
- Expand and collapse animations
- Fade and slide effects
- Micro-interactions throughout the application

Using Reanimated ensures that animation performance remains consistent because animation logic is executed directly on the native UI thread through worklets, avoiding unnecessary communication with the JavaScript thread.

### Component Architecture

The application follows a modular architecture with reusable components:

- Feature-based folder structure
- Shared UI components
- Reusable bottom-sheet components
- Reusable map components
- Custom calendar implementation
- Centralized theme management

This approach improves scalability, maintainability, and code readability.

### State Management

Redux Toolkit is used to provide predictable and scalable state management.

State is organized into dedicated slices, including:

- Authentication
- Booking information
- Calendar selection
- Application state

This keeps business logic separate from UI components and simplifies future feature additions.

### Code Quality

The project follows modern React Native best practices:

- TypeScript throughout the application
- Strong typing
- Modular architecture
- Clean separation of concerns
- Reusable components
- Centralized constants and theme tokens
- Maintainable folder structure
- Scalable project organization



# Notes

- Fully complies with all assignment requirements.
- Custom six-month calendar implemented from scratch using **Moment.js**.
- Google Maps integrated for pickup and destination selection.
- Authentication implemented using the provided Login API.
- Responsive across Android and iOS.
- Designed with scalability and maintainability in mind.

---

# Conclusion

This project demonstrates a complete implementation of the Rydeu React Native Developer Assignment, including authentication, protected navigation, Redux state management, Google Maps integration, a custom Moment.js calendar, responsive layouts, and a clean, maintainable codebase following React Native best practices.
````
