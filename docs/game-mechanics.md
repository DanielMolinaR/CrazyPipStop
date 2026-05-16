# Game mechanics

The rules the app implements. Top-level summary lives in [CLAUDE.md](../CLAUDE.md#the-product).

## Difficulty modes

Four modes, each a `GameMode` object (templates in [lib/gameModes.ts](../lib/gameModes.ts)):

| Mode | Timer | Win at | Lose at | Penalization |
| --- | --- | --- | --- | --- |
| Training | 40 s | 5 victories | 6 mistakes | no |
| Amateur | 30 s | 5 victories | 4 mistakes | −5 s, once per game |
| Advanced | 25 s | 5 victories | 4 mistakes | −5 s, once per game |
| Pro | 15 s | 5 victories | 3 mistakes | no |

## Round flow

Pick mode → optionally toggle the penalization (if the mode allows) →
press **START** → countdown plays with audio → press **STOP** or let it
run out → mark ✓ or ✗ → return to the same screen with score
incremented, repeat until one of the thresholds is reached → **Final**
screen shows VICTORY!! or DEFEAT with the appropriate sting and
animation → app pops back to the home menu.

## Penalization

A one-shot per-game shortcut. If the mode has `hasPenalization`, the
user can toggle a `−5"` button before pressing START. That round runs
with `secondsCounter − penalizationTime` seconds instead of the full
clock, and the audio cue switches to the shorter penalized track. After
that round resolves (win or lose), the penalization is "spent"
(`isPenalizationUsed = true`) and the toggle becomes disabled for the
rest of the game.
