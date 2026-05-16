# Audio system

How countdown / outcome audio is played and configured. Top-level summary
lives in [CLAUDE.md](../CLAUDE.md#audio-system-tldr).

## Per-screen `useAudioPlayer`

One `useAudioPlayer` from `expo-audio` per screen instance. The hook
ties the player's lifecycle to the component — when the screen
unmounts, the player is released automatically. There is no shared
sound pool and no manual `load` / `unload` bookkeeping.

## How each screen handles audio

- **[Resolve](../screens/ResolveScreen.tsx)**: picks a random track from
  `gameMode.audios` (or `penalizedAudios` if `isPenalized`) once at
  mount via `useMemo` with empty deps. Passes that source to
  `useAudioPlayer`. The CountDown component fires the `onSound`
  callback once, which calls `player.play()`. STOP / natural finish
  calls `player.pause()`.
- **[Final](../screens/FinalScreen.tsx)**: picks the victory or defeat
  audio source the same way (single victory sting; random defeat
  track). Plays once on mount. Listens to the `playbackStatusUpdate`
  event for `didJustFinish` to trigger the auto-`popToTop` back to
  Home.

## CountDown lead-in

The [CountDown component](../components/CountDown.tsx) runs a
5.2-second lead-in delay between `onSound` firing and the visible
timer starting to tick. The countdown audio files have "3, 2, 1, GO!"
baked into their last few seconds, and the lead-in aligns the audio
"GO!" with the visible `secondsCounter`.

## Boot-time audio configuration

[App.tsx](../App.tsx) calls
`setAudioModeAsync({ playsInSilentMode: true })` once on mount so the
countdown / outcome audio survives the iOS hardware silent switch and
the iPad mute slider — by default expo-audio respects silent mode and
the cues would be inaudible whenever the device is muted.
