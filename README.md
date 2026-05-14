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

## Release pipeline (automated)

Every push to `main` (or a manual run from the GitHub Actions tab) triggers
`.github/workflows/release.yml`, which:

1. **Verifies** the codebase — `npx tsc --noEmit`, `npm test -- --ci`, `npm run lint`. A failure in any of these blocks the release.
2. **Builds + submits** the production profile to both stores via EAS — App Store Connect for iOS and the Google Play `internal` track for Android. Build numbers are auto-incremented per platform (`autoIncrement: true` on the production build profile in `eas.json`).

### One-time setup before the workflow can run

1. Generate an Expo access token at <https://expo.dev/accounts/danimr/settings/access-tokens> and add it as a GitHub repo secret named `EXPO_TOKEN` (Settings → Secrets and variables → Actions).
2. Run `eas credentials` locally once to wire up store credentials — Apple App Store Connect API key for iOS and a Google Play service-account JSON for Android. These live on EAS's servers, not in this repo.
3. Make sure your trunk branch is named `main`. If it isn't, change the branch name on the `on.push.branches` line in `release.yml`.

### Cadence and quota

EAS Build's free tier caps the number of remote builds per month. iOS and Android each count as a separate build, so a single push to `main` consumes two slots. Avoid pushing release-trigger commits in rapid succession — if you're iterating, branch off and only merge when the diff is genuinely ready to ship. If you want a deliberate gate, the workflow also supports manual `workflow_dispatch`; you can switch off the `push:` trigger entirely if pure-manual releases feel safer.

### Skipping a release

For commits that don't warrant a build (docs-only changes, README tweaks), include `[skip ci]` in the commit message and GitHub Actions will skip the run. Or do those changes on a side branch and merge them with a non-release strategy.

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
