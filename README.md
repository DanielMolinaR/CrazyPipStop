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
- **expo-av → expo-audio.** `expo-av` is deprecated in current Expo SDKs in favour of `expo-audio` (and `expo-video`). The current `Audio.Sound` usage in `ResolveScreen.tsx` and `FinalScreen.tsx` will need to be migrated.

### Smaller polish

- The `audioStoppedRef` pattern in `ResolveScreen.tsx` and `FinalScreen.tsx` is a workable but not pretty solution to the audio lifecycle race. If/when migrating to `expo-audio`, revisit and use its built-in disposal model instead.

### UX / visual polish (queued after the cleanup pass)

- **Hide the system status bar for the in-app screens.** Discussed during step 2 planning. Once the intro animation dismisses, switch `<StatusBar hidden />` so the game runs fully immersive. Expect small vertical-position tweaks on HomeScreen (logo) and GameScreen (home button, logo) afterwards — the system bar's ~24–44 px height was implicitly reserved by every layout, and removing it lifts content up by that amount. Best done as its own commit so the tweaks aren't entangled with the splash work.
- **Background images take a perceptible moment to load.** The `red-background-*.png` and `gray-pattern.png` assets are large and decode on the JS thread. Options: pre-load them with `Asset.loadAsync` during splash; convert to smaller dimensions / WebP; or replace with a solid-colour fallback that swaps to the image once decoded.
- **Add a loading screen / GIF on app boot.** Right now `App.tsx` returns `null` while fonts are loading, which means a blank screen for ~half a second. Use Expo's splash screen APIs (`expo-splash-screen` is already in the deps) to keep the splash visible until both fonts AND backgrounds are ready, or render an interim animated GIF.

### Recommended sequencing

The TODO items above don't need to be done in the order they're listed. The sequence below groups them by risk, scope, and dependencies — earlier batches are safe and fast, later ones are big-lift refactors that benefit from the codebase being stable underneath them.

1. **Splash, intro animation, and asset preload (~1.5–2 hours, low-to-medium risk).** Three pieces, done together because they share the same boot-time hook in `App.tsx`:
   - Configure a custom static splash image in `app.json` (the existing reference is already correct; no change needed).
   - Use `expo-splash-screen`'s `preventAutoHideAsync()` to keep the splash visible while React mounts, then render `assets/images/intro.gif` as a full-screen overlay during the boot transition (since OS-level splash doesn't support animated formats).
   - Preload `red-background-*.png` and `gray-pattern.png` with `Asset.loadAsync` alongside the font, and hide both the native splash and the GIF overlay once everything is ready (and the GIF has had time to play through). This kills the "background load delay" felt on first navigation as a side effect. If the GIF turns out to be heavy on lower-end devices, the fallback plan is to swap it for a Lottie animation.
2. **expo-av → expo-audio migration (~1–2 hours, medium risk).** Migrate `Audio.Sound` usages in `ResolveScreen.tsx` and `FinalScreen.tsx`. While doing this, revisit the `audioStoppedRef` pattern — `expo-audio`'s built-in disposal model probably makes it obsolete. Test the rapid-click and STOP-during-load scenarios specifically; that's where audio migrations break. This sits before NativeWind so audio behaviour can be verified in isolation.
3. **NativeWind v2 → v4 migration (~2–3 hours, highest risk).** Save for last because it touches every file with a `className` prop and changes the build pipeline (Metro plugin replaces Babel plugin). Plan to QA every screen after. When you do this, replace `nativewind-env.d.ts` with the single line `/// <reference types="nativewind/types" />` and remove the manual augmentation.

The "audioStoppedRef revisit" item isn't a standalone step — it's absorbed by step 2.
