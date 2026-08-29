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

Merging a PR into `main` (or a manual run from the GitHub Actions tab) triggers
`.github/workflows/release.yml`, which:

1. **Verifies** the codebase — `npx tsc --noEmit`, `npm test -- --ci`, `npm run lint`. A failure in any of these blocks the release.
2. **Builds + submits** the production profile to both stores via EAS — App Store Connect / TestFlight for iOS, and the Google Play `internal` testing track for Android. Neither is published to users automatically: iOS still needs a manual submit-for-review, and Android needs a manual internal → production promotion in Play Console.

The trigger is `pull_request: closed` gated on `merged == true`, so a PR closed
without merging ships nothing, and a direct push to `main` (rare, admin-only)
does not fire a release.

Build numbers (`android.versionCode` / `ios.buildNumber`) are **not stored in
this repo** — `cli.appVersionSource` is `"remote"` in `eas.json`, so EAS owns
them server-side and auto-increments on every production build. The user-facing
`expo.version` is a separate, manual per-PR bump. See
[docs/adr/0001-remote-app-version-source.md](docs/adr/0001-remote-app-version-source.md).

### One-time setup before the workflow can run

1. Generate an Expo access token at <https://expo.dev/accounts/danimr/settings/access-tokens> and add it as a GitHub repo secret named `EXPO_TOKEN` (Settings → Secrets and variables → Actions).
2. Install the EAS CLI locally (one-time): `npm install -g eas-cli` (or use `npx eas-cli ...` ad-hoc). Then `eas login` to your Expo account, followed by `eas credentials` — that opens an interactive menu where you upload the Apple App Store Connect API key (.p8 file) for iOS and the Google Play service-account JSON for Android. Credentials live on EAS's servers, not in this repo.
3. Make sure your trunk branch is named `main`. If it isn't, change it on the `on.pull_request.branches` line in `release.yml`.

### Cadence and quota

EAS Build's free tier caps the number of remote builds per month. iOS and Android each count as a separate build, so a single merge into `main` consumes two slots. Since the trigger is a PR merge rather than a push, batching work into one PR instead of several is the lever here — keep iterating on the branch and merge once the diff is genuinely ready to ship.

### Skipping a release

Don't rely on `[skip ci]` — it suppresses `push`-triggered runs, not the
`pull_request: closed` event this workflow listens to. To avoid a release,
either don't merge the PR, or accept the build. Every merge into `main` is a
release, by design; that's what the per-PR version bump gate exists to make
deliberate.

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
