# CrazyPipStop

A casual mobile companion app for the CrazyPipStop board game: counts down each pit-stop round, plays the audio cues, and tracks the score.

## Run locally

```
npm install
npx expo start -c
```

## Dev scripts

| Command | What it does |
| --- | --- |
| `npm start` | Start the Expo dev server. |
| `npm test` | Run Jest tests once (CI-friendly). |
| `npm run test:watch` | Run Jest in watch mode for local development. |
| `npm run lint` | Run ESLint via `expo lint` (auto-installs ESLint and `eslint-config-expo` on first run). |
| `npm run format` | Apply Prettier to all source files. |
| `npm run format:check` | Verify formatting without changing anything (CI-friendly). |

## Build an Android APK in Expo

```
eas build --profile preview --platform android
```

## Install and run an APK already uploaded to Expo

```
eas build:run -p android
```

## Project structure

```
App.tsx                  # Navigation root + font loading + status bar
types.ts                 # GameMode + RootStackParamList
assets.d.ts              # Module declarations for static asset imports
nativewind-env.d.ts      # Type augmentation so RN components accept className
global.css               # Tailwind directives consumed by NativeWind's Metro plugin
metro.config.js          # Metro config wrapping Expo defaults with withNativeWind
lib/
  gameLogic.ts             # Pure score-update + win/lose detection (unit-tested)
screens/                 # One file per screen (Home, Game, Resolve, Final)
components/              # Reusable UI primitives (CpsButton*, StyledText, …)
  Scoreboard.tsx           # Victory/mistake-points row, shared by Game & Resolve
  CountDown.tsx            # Audio-synced countdown with background-time handling
  HomeButton.tsx           # Top-left "go to menu" button (GameScreen only)
__tests__/               # Jest tests
assets/                  # Images, fonts, audio
```

## Architecture notes

- Game state (the current `GameMode` object — score, penalization status, etc.) flows through `react-navigation` params. State is **immutable**: every screen treats its params as read-only and forwards a new object on transition. The system back button therefore restores the previous round's state for free.
- No persistence layer, no backend. Sessions live for the duration of the navigation stack and end when the user returns to Home.
- NativeWind v4 styles RN components via the `className` prop. The runtime sits behind a Metro plugin (`metro.config.js`) plus a small babel preset; Tailwind classes resolve at render time using the rules in `tailwind.config.js` and the `global.css` entry.
