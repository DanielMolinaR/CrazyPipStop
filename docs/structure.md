# Project structure

Full file tree with one-line descriptions. The collapsed top-level view
lives in [CLAUDE.md](../CLAUDE.md#project-structure).

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
