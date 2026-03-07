# Machi

Machi is a React Native productivity app built with Expo and TypeScript. It turns completed focus sessions into a growing pixel-art city, using local SQLite storage to persist sessions, earned buildings, and app preferences.

## Figma

Design source:

https://www.figma.com/design/qlzKBJY9RiLlqSA2SKAQ1L/Machi?node-id=0-1&t=tNSvR8YPXvyeQkUs-1

## Current v1 implementation

- Expo + TypeScript mobile app scaffold for Android and iOS.
- Splash, login, and registration screens styled from the linked Figma.
- Bottom-tab navigation with five screens: City, Focus, History, Stats, Settings.
- SQLite persistence through `expo-sqlite`.
- Local SQLite-backed account registration and login.
- Focus timer with Pomodoro-style defaults and editable focus/break lengths.
- City-building reward loop based on session length and streak.
- Pixel-art building assets sourced from `FigmaAssets/`.
- Session history, streak stats, and local settings management.

## Local development

Install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npm run start
```

Launch on Android:

```bash
npm run android
```

Launch on iOS:

```bash
npm run ios
```

## Project structure

- `App.tsx`: app bootstrap and provider setup.
- `src/navigation/`: bottom-tab navigation.
- `src/screens/`: v1 app screens.
- `src/db/`: SQLite client, migrations, and repositories.
- `src/services/`: reward and stats logic.
- `src/state/`: app-level data loading and mutations.
- `src/theme/`: shared design tokens.
- `FigmaAssets/`: pixel-art and branding assets.

## Current storage model

SQLite stores three categories of data:

- Completed focus sessions.
- Earned city buildings and their grid positions.
- Local app settings such as focus length, break length, and city width.
- Local user account records and the currently signed-in local user.

## Next implementation targets

- Refine the remaining non-auth screens to more closely match Figma frames.
- Add timer resilience for background/foreground transitions.
- Add tests for reward rules and streak/stat calculations.