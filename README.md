# Petziq Mobile App

Petziq Mobile is a React Native + Expo app built to mirror the Petziq website’s care-first product language while adapting it into a mobile-first experience for pet owners, plant care, QR smart tags, and AI-powered guidance.

## Overview

This mobile app follows the final Petziq product structure:

- Auth flow for login, registration, and password reset
- Home dashboard with care overview and quick actions
- Pet management views
- Smart-tag management and QR scanning
- Plant care dashboard
- Petziq AI assistant interface
- Settings and account management

The stack is:

- React Native + Expo
- TypeScript
- React Navigation
- Expo Camera
- Expo Notifications-ready architecture
- Supabase-ready auth/client setup
- Tailwind-style dark UI system

## Final app structure

```text
Petziq/App/
├── App.tsx
├── README.md
├── app.json
├── babel.config.js
├── global.css
├── index.ts
├── metro.config.js
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── src/
│   ├── data/
│   │   └── mockData.ts
│   ├── lib/
│   │   └── ui.ts
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   ├── screens/
│   │   ├── ai/
│   │   │   └── PetziqAIScreen.tsx
│   │   ├── auth/
│   │   │   ├── ForgotPasswordScreen.tsx
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── home/
│   │   │   ├── ActivityScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── MyPetsScreen.tsx
│   │   │   └── RemindersScreen.tsx
│   │   ├── pets/
│   │   │   ├── AddPetScreen.tsx
│   │   │   ├── PetHealthScreen.tsx
│   │   │   └── PetProfileScreen.tsx
│   │   ├── plants/
│   │   │   └── PlantsScreen.tsx
│   │   ├── settings/
│   │   │   └── SettingsScreen.tsx
│   │   ├── smart-tags/
│   │   │   ├── ActivateTagScreen.tsx
│   │   │   ├── LostPetScreen.tsx
│   │   │   ├── MyTagsScreen.tsx
│   │   │   └── QRScannerScreen.tsx
│   │   ├── AIChatScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── ScanScreen.tsx
│   ├── services/
│   │   └── supabase.ts
│   └── types/
│       └── app.ts
└── assets/
```

## Main features

### Authentication
The app starts with an auth flow composed of:

- login screen
- registration screen
- forgot password reset screen

The root app navigator routes users from the auth stack into the main app after login.

### Home dashboard
The home screen acts as the primary dashboard and includes:

- welcome/overview section
- care overview cards
- quick actions panel
- pet highlight cards
- plant and smart-tag summary widgets

### Pets management
Pet management screens cover:

- listing pets
- pet profile details
- health summaries
- add-pet workflow

### Smart tags and QR scanning
The smart-tag section includes:

- tag activation
- My Tags overview
- QR scanning flow using Expo Camera
- lost pet reporting workflow

### Plants care
The plants screen shows a simple care dashboard for indoor plants and reminders.

### Petziq AI
The AI screen provides a lightweight assistant UI that can be connected to a live API later for real recommendation logic.

### Settings
The settings screen contains account management and profile configuration actions.

## How the app works

### Navigation
The app uses a two-part navigation layout:

1. Auth stack
   - Login
   - Register
   - Forgot password
   - Main app shell

2. Main tab navigator
   - Home
   - MyPets
   - Reminders
   - Activity
   - SmartTags
   - Plants
   - AI
   - Settings

This structure keeps the app experience aligned with the requested Petziq feature tree while staying mobile-first.

### App entry
The root [App.tsx](App.tsx) wraps the app with:

- SafeAreaProvider
- NavigationContainer
- the auth + tab navigator

### Data layer
The mock dataset in [src/data/mockData.ts](src/data/mockData.ts) includes sample pet, plant, and tag information so the prototype is viewable immediately without backend wiring.

### Supabase-ready integration
The app includes a service layer in [src/services/supabase.ts](src/services/supabase.ts), with helpers for:

- email sign-in
- sign-up
- sign-out
- session retrieval

Set these variables in an environment file to connect to a real backend:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Running the app

From the project root:

```bash
cd /Users/shash/Drive/Documents/Coding/Petziq/App
npm install
npm start
```

Then choose one of the following:

- Expo Go on a physical device
- Android emulator
- iOS simulator
- web preview

## Product reference

The app was built using the existing Petziq website and product direction as the primary reference, adapted into a mobile-first experience.

The design language keeps the core traits from the website:

- dark premium layout
- glass-panel interface
- teal/green accent palette
- care-first user journey
- pet and plant management emphasis

## Next steps

This version is structured as a working prototype and is designed to be extended into a full production Service. Recommended next steps include:

1. Connect real Supabase user and pet data.
2. Add persistent reminders and notifications.
3. Link real QR profile lookups.
4. Integrate a live AI backend for Petziq AI.
5. Add photo uploads and storage for pets.
6. Expand the data model to support full pet care workflows.

## Verification

The project was checked with TypeScript validation:

```bash
npx tsc --noEmit
```

This completed successfully without errors.
