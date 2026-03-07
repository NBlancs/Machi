# Machi Setup Guide

This guide covers local setup for the Machi mobile app.

## Stack

- Expo SDK 55
- React Native 0.83
- TypeScript
- React Navigation
- Local SQLite via `expo-sqlite`

## Prerequisites

Install the following before running the app:

- Node.js 20 or newer
- npm 10 or newer
- Git
- Expo Go on an Android or iOS device, or an Android emulator / iOS simulator

To verify your environment:

```bash
node -v
npm -v
```

## Install Dependencies

From the project root:

```bash
npm install
```

## Start The App

Run the Expo development server:

```bash
npm run start
```

Useful shortcuts:

- `a` launches Android
- `i` launches iOS if you are on macOS with a simulator available
- `w` launches the web preview
- Scan the QR code with Expo Go to open the app on a device

Platform-specific commands:

```bash
npm run android
npm run ios
npm run web
```

## First Run Behavior

On startup the app will:

1. Run SQLite migrations.
2. Show the splash screen.
3. Open the login flow if no local user is active.
4. Persist sessions, buildings, settings, and local account data in SQLite.

No cloud backend is required for development.

## Local Data Model

SQLite is used for:

- Local user accounts
- Current signed-in local user tracking
- Focus session history
- Earned building placements
- App settings such as focus duration, break duration, and city columns

## Recommended Dev Workflow

1. Install dependencies with `npm install`.
2. Start Expo with `npm run start`.
3. Register a local account in the app.
4. Complete a focus session and verify a building appears in the city.
5. Check History, Stats, and Settings flows.

## Validation Commands

Type-check the project:

```bash
npx tsc --noEmit
```

Validate Expo bundling:

```bash
npx expo export --platform android --output-dir dist
```

## Project Structure

- `App.tsx` bootstraps providers and root navigation.
- `src/navigation/` contains the auth flow and bottom tabs.
- `src/screens/` contains splash, auth, dashboard, timer, history, stats, and settings screens.
- `src/components/ui/` contains shared visual building blocks.
- `src/db/` contains SQLite client, migrations, and repositories.
- `src/state/` contains app-wide state and mutations.
- `src/services/` contains reward and stat logic.
- `FigmaAssets/` contains the pixel-art assets used by the app.

## Troubleshooting

### Metro cache issues

If Expo is serving stale bundles:

```bash
npx expo start --clear
```

### Dependency mismatch

If Expo reports package version mismatches:

```bash
npx expo install
```

### SQLite issues

If local data behaves unexpectedly, reset app data from the Settings screen or reinstall the app on the simulator/device.

### Navigation or native module issues

Reinstall dependencies and restart Expo:

```bash
rm -rf node_modules package-lock.json
npm install
npx expo start --clear
```

For Windows PowerShell, use:

```powershell
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force
npm install
npx expo start --clear
```

## Current Scope Notes

- The app is local-first.
- Authentication is local-only and stored in SQLite.
- The visual design is partially aligned to the linked Figma and still being refined.
- Background-safe timer persistence and automated tests are not fully implemented yet.