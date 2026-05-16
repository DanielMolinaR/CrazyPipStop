# Architectural shape

State model, navigation flow, and boot sequence. Top-level summary lives
in [CLAUDE.md](../CLAUDE.md#architectural-shape-tldr).

## State model: immutable navigation params

The entire game session lives inside a single `GameMode` object passed
through React Navigation's screen params. State is **immutable** — every
transition (forward to the next screen, backward via the system back
button) treats the current params as read-only and forwards a new
object computed by pure helpers in [lib/gameLogic.ts](../lib/gameLogic.ts).

Specifically:

- `advanceMode(mode, userWon)` returns a new `GameMode` with
  `victoryPoints` / `losingPoints` incremented appropriately,
  `isPenalized` cleared, and `isPenalizationUsed` set if the round was
  played penalized.
- `isGameOver(mode)` and `didPlayerWin(mode)` are pure predicates over
  the threshold fields.
- `cloneGameMode(mode)` deep-clones the audio arrays so a fresh game
  doesn't share references with the static mode templates.

This pattern is the reason the system back button works correctly as
"undo the last round." React Navigation preserves each frame's params
on the stack, and because we never mutate them, going back lands on the
exact prior state.

## Navigation flow

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

## Boot flow

[App.tsx](../App.tsx) orchestrates a deliberate splash → intro → navigator handoff:

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
