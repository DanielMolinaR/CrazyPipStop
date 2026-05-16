# CrazyPipStop — project context

Durable overview of the app. Skim once before working on the codebase;
reach for the linked `docs/*.md` files when you need detail on a
specific subsystem.

## The product

CrazyPipStop is a casual mobile companion app for the CrazyPipStop
board game — a single-device timer + audio cues + score tracker for
fast pit-stop rounds. No accounts, no network, no persistence across
launches. Multiple players gather around one phone; the app is held by
whoever acts as the referee.

Four difficulty modes (Training / Amateur / Advanced / Pro) with
different timers, win/lose thresholds, and an optional one-shot
penalization. See [docs/game-mechanics.md](docs/game-mechanics.md).

## Architectural shape (TL;DR)

- **State is immutable.** The entire session is a single `GameMode`
  passed through React Navigation params. Pure helpers in
  [lib/gameLogic.ts](lib/gameLogic.ts) return new objects; the system
  back button works as "undo last round" because we never mutate.
- **Navigation:** Home → Game → Resolve → Game (loop) → Final → Home.
- **Boot flow:** splash → intro overlay (logo + GIF) → navigator,
  gated on three parallel readiness signals (fonts, asset preload, 3 s
  floor).

Details: [docs/architecture.md](docs/architecture.md).

## Project structure

```
App.tsx            Navigation root + intro overlay + boot-time audio config
types.ts           GameMode + RootStackParamList
hooks/             useIsTablet
lib/               Pure game logic + mode catalog + tests
screens/           Home, Game, Resolve, Final
components/        Button family, StyledText, Background, RedBackground,
                   Scoreboard, CountDown, ConfettiCannon, HomeButton
assets/            Fonts, images (incl. gray pattern), audio
.github/workflows/ pr.yml (gate), release.yml (build + submit)
scripts/           check-version-bump.mjs
```

Full tree with per-file descriptions: [docs/structure.md](docs/structure.md).

## Styling system (TL;DR)

NativeWind v4 + Tailwind classes; custom CPS palette in
`tailwind.config.js`. Button family — `CpsButtonBig` /
`CpsButtonSmall` / `CpsRoundButton` — for consistent depth.
[`<StyledText>`](components/StyledText.tsx) wraps `Text` with Acumin
font + a screen-width scale capped at 480 pt (phone) / 600 pt (tablet).
Backgrounds via [`<Background>`](components/Background.tsx)
(expo-image-cached gray pattern) and
[`<RedBackground>`](components/RedBackground.tsx) (SVG chevron + V-notch,
no PNG). Tablet branches via
[`useIsTablet()`](hooks/useIsTablet.ts) (smallest dimension ≥ 600 pt).

Details: [docs/styling.md](docs/styling.md).

## Audio system (TL;DR)

One `useAudioPlayer` from `expo-audio` per screen instance — the hook
auto-disposes the player when the screen unmounts, so there's no
manual load/unload bookkeeping. Boot-time
`setAudioModeAsync({ playsInSilentMode: true })` in [App.tsx](App.tsx)
so the cues survive the iOS silent switch.

Details: [docs/audio.md](docs/audio.md).

## Conventions worth following

- **Pure logic in `lib/`, side effects in `screens/`.** New
  game-mechanic functions should be pure and live in
  `lib/gameLogic.ts` (or a sibling file) so they're testable without
  rendering React.
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
  can't express** — `transformOrigin` on iOS, explicit `zIndex` on
  absolute overlays, per-screen tablet `maxWidth` caps where the value
  is a named constant.
- **Use `useIsTablet()` for tablet-aware tweaks.** When a value needs
  to differ on iPad vs phone, branch via the hook and surface the
  tablet value as a named constant at the top of the file. Phone is
  the default — tablet adjustments should be no-ops on phone.
- **Run `npx tsc --noEmit && npm test && npm run lint` before
  committing.** Canonical "is the codebase healthy" gate.

## Build & release (TL;DR)

PR gate ([pr.yml](.github/workflows/pr.yml)) runs tsc + Jest + ESLint +
the version-bump check on every PR; both jobs are required by the
`main` branch protection rule. Release
([release.yml](.github/workflows/release.yml)) fires on PR merge into
`main` (and manual `workflow_dispatch`) — verify → iOS production
build with `--auto-submit` → Android APK.

Details: [docs/build.md](docs/build.md).
