# CrazyPipStop — project context

This file is the durable architectural overview of the project. Read it
once before working on the codebase to understand the shape of the app,
the state model, the boot flow, and the conventions worth following.

## The product

CrazyPipStop is a casual mobile companion app for the CrazyPipStop board
game. The board game's gimmick is fast pit-stop rounds where players have
a fixed number of seconds to complete a task before the timer runs out.
The app's job is purely supporting infrastructure for that physical game:
it runs the visible countdown, plays the audio cues that signal each
phase of the timer ("3, 2, 1, GO!"), and tracks running victories vs.
mistakes per session.

It is a single-device app. Multiple players gather around one phone; the
app is held by whoever is acting as the timekeeper / referee. There is
no networked play, no accounts, no persistence between launches.

## Game mechanics

Four difficulty modes, each a `GameMode` object:

| Mode | Timer | Win at | Lose at | Penalization |
| --- | --- | --- | --- | --- |
| Training | 40 s | 5 victories | 6 mistakes | no |
| Amateur | 30 s | 5 victories | 4 mistakes | −5 s, once per game |
| Advanced | 25 s | 5 victories | 4 mistakes | −5 s, once per game |
| Pro | 15 s | 5 victories | 3 mistakes | no |

A round goes: pick mode → optionally toggle the penalization (if the
mode allows) → press START → countdown plays with audio → press STOP or
let it run out → mark ✓ or ✗ → return to the same screen with score
incremented, repeat until one of the thresholds is reached → Final
screen shows VICTORY!! or DEFEAT with the appropriate sting and
animation → app pops back to the home menu.

The **penalization** mechanic is a one-shot per-game shortcut: if the
mode `hasPenalization`, the user can toggle a `-5"` button before
pressing START. That round runs with `secondsCounter − penalizationTime`
seconds instead of the full clock, and the audio cue switches to the
shorter penalized track. After that round resolves (win or lose), the
penalization is "spent" (`isPenalizationUsed = true`) and the toggle
becomes disabled for the rest of the game.

## Architectural shape

### State model: immutable navigation params

The entire game session lives inside a single `GameMode` object passed
through React Navigation's screen params. State is **immutable** — every
transition (forward to the next screen, backward via the system back
button) treats the current params as read-only and forwards a new
object computed by pure helpers in `lib/gameLogic.ts`.

Specifically:

- `advanceMode(mode, userWon)` returns a new `GameMode` with
  `victoryPoints` / `losingPoints` incremented appropriately,
  `isPenalized` cleared, and `isPenalizationUsed` set if the round was
  played penalized.
- `isGameOver(mode)` and `didPlayerWin(mode)` are pure predicates over
  the threshold fields.

This pattern is the reason the system back button works correctly as
"undo the last round." React Navigation preserves each frame's params
on the stack, and because we never mutate them, going back lands on the
exact prior state.

### Navigation flow

```
Home  ─► Game  ─► Resolve  ─► Game (next round) ─► …
                       │
                       └────► Final ─► (popToTop) ─► Home
```

- **Home**: mode picker, deep-clones the chosen mode and pushes it to Game.
- **Game**: pre-round state — toggle penalization, view current score
  on the Scoreboard, press START.
- **Resolve**: the actual countdown screen with audio. STOP or natural
  finish surfaces an ✓/✗ overlay; picking one runs `advanceMode` and
  navigates onward.
- **Final**: outcome screen with VICTORY!! or DEFEAT badge. Audio plays
  the configured sting; on natural finish or back-button, app
  `popToTop()`s back to Home.

There is also a top-left **Home button** on `GameScreen` only — a
quick-exit affordance that calls `popToTop()` directly.

### Boot flow

`App.tsx` orchestrates a deliberate splash → intro → navigator handoff:

1. `SplashScreen.preventAutoHideAsync()` runs at module load so the
   native OS splash stays visible until React explicitly hides it.
2. React mounts. Three parallel readiness signals start:
   - `useFonts` loading Acumin from `assets/fonts/`.
   - `Asset.loadAsync` preloading every image used by an in-app screen
     so the first navigation doesn't stall on a cold image decode.
   - A 3-second `setTimeout` floor so the intro animation gets at least
     one full pass.
3. As soon as React renders, `SplashScreen.hideAsync()` runs. The intro
   overlay (logo + GIF + gray-pattern backdrop) is already painted by
   that point, so the handoff is splash → intro with no blank flash.
4. When **all three** readiness signals are satisfied, the intro
   overlay unmounts and the navigator's first screen (Home) takes over.

The intro overlay sits as a **sibling** of `NavigationContainer`, not as
a route inside the stack — so the system back button can never land
the user on it. Re-entering the app from background also won't re-show
it because the React tree is still mounted; only a fresh cold launch
re-triggers the boot sequence.

The **status bar** is bound to `hidden={introComplete}`: visible during
the intro (so users see time/battery during boot), hidden once the
navigator is in charge (immersive game feel).

## Styling system

NativeWind v4 styles every component via the `className` prop. The
runtime sits behind a Metro plugin (`metro.config.js`) plus a small
babel preset; Tailwind classes resolve at render time using the rules
in `tailwind.config.js` and the `global.css` entry imported once from
`App.tsx`.

Custom CPS palette in `tailwind.config.js`:

| Class | Hex | Used for |
| --- | --- | --- |
| `bg-cps-red` / `text-cps-red` | `#D2160F` | Penalized state, defeat text |
| `bg-cps-orange` / `text-cps-orange` | `#E87600` | (defined; rarely used) |
| `bg-cps-yellow` / `text-cps-yellow` | `#F7D133` | Default button face, timer text |
| `bg-cps-green` / `text-cps-green` | `#8CC63F` | START button, victory text, scoreboard wins |
| `bg-cps-gray` / `text-cps-gray` | `#3A3A39` | Button borders, overlay backdrops |
| `bg-cps-brown` / `text-cps-brown` | `#562900` | Main timer background |
| `bg-cps-deep-red` | `#4f0606` | Penalized timer background |

Three nested-border button components form a button family with
consistent depth/bezel:

- `CpsButtonBig` (3 + 4 + 6 px borders) — START, STOP, timer face, mode
  picker buttons.
- `CpsButtonSmall` (2 + 4 + 6 px) — Home button, scoreboard mistake
  squares.
- `CpsRoundButton` (1 + 2 + 5 px) — scoreboard victory circles.

Typography goes through `<StyledText>`, which wraps RN's `Text` with a
custom Acumin font lookup and screen-width-based scaling (baseline:
iPhone-5s 320pt width). The scale is **clamped** to 480pt on phone and
600pt on tablet (via `useIsTablet()` — see below) so text doesn't
balloon on iPad while still growing proportionately.

### Tablet breakpoints

iPad is a first-class layout, not a centred phone window. The
`useIsTablet()` hook (`hooks/useIsTablet.ts`) returns `true` when the
device's smallest dimension is ≥ 600pt — catches every iPad
(mini ≈ 744pt → Pro 12.9" ≈ 1024pt), excludes every phone (iPhone 16
Pro Max smallest = 440pt). It's reactive via `useWindowDimensions()`.

When the hook returns true:

- `<StyledText>` raises its scale cap from 480pt to 600pt.
- Each screen caps the maxWidth of its action buttons (START, STOP,
  OK?, timer displays, etc.) so they don't stretch across the wider
  screen. The tunable values live as `TABLET_*_MAX_WIDTH` constants at
  the top of each screen file.
- `<Scoreboard>` wraps its rows in a 480pt-wide centred container so
  the score circles + mistake squares stay phone-sized rather than
  inflating to ~15% of the iPad's width.
- `<FinalScreen>` caps the VICTORY/DEFEAT badge at 520pt and switches
  the DEFEAT layout to `justify-start` so the screw stays anchored at
  the left border (the rotation pivot hinges on it).

Phone behaviour is the default; every tablet adjustment is a no-op
there (the cap values are wider than any phone, and the layout
strategy doesn't change).

### Background images

The gray pattern is rendered via `<Background>` (`components/Background.tsx`)
— a drop-in `<ImageBackground>` replacement that uses expo-image's
`<Image>` with `cachePolicy="memory-disk"`. The decoded bitmap stays in
memory across React Navigation mount/unmount cycles, which matters
because every forward navigation mounts a fresh screen. The asset
itself is also downscaled (`gray-pattern.png` is 833×1537, not the
original 3334×6151) so the first decode is cheap too.

The red chevron background is **not** a PNG — it's drawn programmatically
in SVG by `<RedBackground>` (`components/RedBackground.tsx`, backed by
`react-native-svg`). Renders into the parent via absolute-fill, scales
to any aspect ratio without distortion. Two screen-tunable props:

- `chevronStart` (0–1): where the horizontal stripes begin from the top.
- `vDepth` (0–1): how deep the V-notch is cut into the bottom edge.
- Optional `chevronRise` and `stripeCount` for finer tuning.

`ResolveScreen` wraps it in an oversized parent with `overflow: hidden`
so the SVG renders at the same pixel size as Home's but with the top
cropped — the "same chevron, moved upward" feel.

## Audio system

Per-screen `useAudioPlayer` from `expo-audio`. The hook ties the player's
lifecycle to the component — when the screen unmounts, the player is
released automatically. There is no shared sound pool and no manual
load / unload bookkeeping.

How each screen handles audio:

- **Resolve**: picks a random track from `gameMode.audios` (or
  `penalizedAudios` if `isPenalized`) once at mount via `useMemo` with
  empty deps. Passes that source to `useAudioPlayer`. The CountDown
  component fires the `onSound` callback once, which calls
  `player.play()`. STOP / natural finish calls `player.pause()`.
- **Final**: picks the victory or defeat audio source the same way
  (single victory sting; random defeat track). Plays once on mount.
  Listens to the `playbackStatusUpdate` event for `didJustFinish` to
  trigger the auto-`popToTop` back to Home.

The **CountDown component** runs a 5.2-second lead-in delay between
`onSound` firing and the visible timer starting to tick. The countdown
audio files have "3, 2, 1, GO!" baked into their last few seconds, and
the lead-in aligns the audio "GO!" with the visible `secondsCounter`.

`App.tsx` calls `setAudioModeAsync({ playsInSilentMode: true })` once on
mount so the countdown / outcome audio survives the iOS hardware silent
switch and the iPad mute slider — by default expo-audio respects silent
mode and the cues would be inaudible whenever the device is muted.

## Project structure

```
App.tsx                  Navigation root, font loading, splash/intro overlay
types.ts                 GameMode + RootStackParamList
assets.d.ts              Module declarations for static asset imports
nativewind-env.d.ts      One-line reference to nativewind/types
global.css               Tailwind directives (consumed by NativeWind Metro plugin)
metro.config.js          Wraps Expo defaults with withNativeWind
babel.config.js          NativeWind v4 preset config
tailwind.config.js       Custom CPS palette + nativewind/preset
eslint.config.js         Flat config extending eslint-config-expo
.prettierrc.json         Style: single quotes, semis, 100 cols
tsconfig.json            Extends expo/tsconfig.base, strict mode
hooks/
  useIsTablet.ts         Tablet detection — useWindowDimensions, threshold 600pt
lib/
  gameLogic.ts           Pure functions: advanceMode, isGameOver, didPlayerWin, cloneGameMode
  gameModes.ts           The four GameMode templates + their audio require()s
  gameLogic.test.ts      Jest tests for the lib helpers + catalog sanity (17 cases)
screens/
  HomeScreen.tsx         Mode picker — renders the gameModes catalog from lib/
  GameScreen.tsx         Pre-round: penalization toggle + Scoreboard + START
  ResolveScreen.tsx      Countdown + STOP + OK?/✓/✗ overlay
  FinalScreen.tsx        Victory/defeat badge with rotation animation
components/
  CpsButtonBig.tsx       Triple-nested-border wrapper for large buttons
  CpsButtonSmall.tsx     Same, smaller
  CpsRoundButton.tsx     Same, round
  StyledText.tsx         Custom Acumin font wrapper with tablet-aware scaling
  Background.tsx         <ImageBackground> replacement backed by expo-image cache
  RedBackground.tsx      SVG chevron + V-notch (replaces the old red-bg PNGs)
  ConfettiCannon.tsx     Victory confetti overlay
  CountDown.tsx          Audio-synced countdown with background-time handling
  Scoreboard.tsx         Victory/mistake-points row (shared by Game & Resolve)
  HomeButton.tsx         Top-left "go to menu" button (GameScreen only)
scripts/
  check-version-bump.mjs Fails the PR pipeline unless app.json's version was bumped
.github/workflows/
  pr.yml                 PR gate: tsc + Jest + ESLint + version-bump check
  release.yml            EAS build + iOS submit + Android APK on PR-merge
eas.json                 EAS build/submit profiles (development, preview, production)
app.json                 Expo app config (icon, splash, plugins)
assets/
  fonts/                 Acumin variable font
  images/                Logo, icons, intro GIF, gray pattern (red bg is SVG)
  music/                 Countdown/victory/defeat audio tracks
```

## Conventions worth following

- **Pure logic in `lib/`, side effects in `screens/`.** New
  game-mechanic functions should be pure and live in `lib/gameLogic.ts`
  (or a sibling file) so they're testable without rendering React.
- **Never mutate `route.params`.** Always spread + override:
  `navigation.navigate('Resolve', { gameMode: { ...gameMode, foo } })`.
- **One `useAudioPlayer` per screen instance.** Don't share a player
  across components; the hook's auto-disposal on unmount is the entire
  reason the audio lifecycle is clean.
- **Lay out screens with percentage heights, not absolute pixels.**
  Existing screens divide the viewport into `h-[N%]` rows; new content
  should fit that pattern so it scales across phone sizes.
- **The custom button family (`CpsButton*`) is the visual API.** Don't
  add raw `<View>` "buttons" with hand-rolled borders; wrap content in
  the existing button components so the bezel/depth stays consistent.
- **NativeWind class first, inline `style` only for what NativeWind
  can't express.** Examples that warrant inline style: `transformOrigin`
  on iOS (not in the public RN types), explicit `zIndex` on absolute
  overlays (NativeWind's `z-*` is unreliable on Android in RN),
  per-screen tablet `maxWidth` caps where the value is a named constant.
- **Use `useIsTablet()` for tablet-aware tweaks.** When a value visibly
  needs to differ on iPad vs phone (button widths, font caps, layout
  strategy), branch via the hook and surface the tablet value as a
  named constant at the top of the file rather than burying it in JSX.
  Phone is the default — tablet adjustments should be no-ops on phone.
- **Run `npx tsc --noEmit && npm test && npm run lint` before
  committing.** That's the canonical "is the codebase healthy" gate.

## Build and release pipeline

`.github/workflows/release.yml` runs on every PR merge into the trunk
branch (`pull_request: closed` + `if: merged == true`, so a PR closed
without merging skips the build), plus manual `workflow_dispatch`.
Direct pushes to `main` (rare, admin-only) do not auto-fire a release.

1. **Verify**: `npx tsc --noEmit`, `npm test -- --ci`, `npm run lint`.
   A failure in any of these blocks the release.
2. **iOS production build** with `--auto-submit` to App Store Connect.
3. **Android APK build** using the `preview` profile (sideloadable
   APK, distributable as a download/QR link from the EAS Build
   dashboard).

Build numbers auto-increment per platform via `"autoIncrement": true`
on the production build profile in `eas.json`.

The workflow needs an `EXPO_TOKEN` GitHub repo secret and store
credentials uploaded once via `eas credentials` (Apple App Store
Connect API key for iOS; Google Play service-account JSON for
Android when ready).
