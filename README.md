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
- NativeWind v2 styles RN components via the `className` prop; the babel plugin in `babel.config.js` rewrites those into native styles at build time.

## TODO — deferred cleanup

These items were intentionally **out of scope** for the recent quality pass and are queued up here so they're not forgotten.

### Dependency modernization

- **NativeWind v2 → v4.** v2 (`2.0.11`) is unmaintained; the library was rewritten as v4 with a different build pipeline (Metro plugin instead of Babel) and full Tailwind v3+ compatibility. Migration is non-trivial — every screen should be visually QA'd. When you do this, replace the `nativewind-env.d.ts` file with a single line: `/// <reference types="nativewind/types" />`.

### Recommended sequencing

The TODO items above don't need to be done in the order they're listed. The sequence below groups them by risk, scope, and dependencies — earlier batches are safe and fast, later ones are big-lift refactors that benefit from the codebase being stable underneath them.

1. **NativeWind v2 → v4 migration (~2–3 hours, highest risk).** v2 (`2.0.11`) is unmaintained; v4 uses a Metro plugin instead of Babel and brings full Tailwind v3+ compatibility. Touches every file with a `className` prop. Plan to QA every screen after. When you do this, replace `nativewind-env.d.ts` with the single line `/// <reference types="nativewind/types" />` and remove the manual augmentation.
