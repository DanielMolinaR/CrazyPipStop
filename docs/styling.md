# Styling system

How the UI is themed and how it adapts to phone vs tablet. Top-level
summary lives in [CLAUDE.md](../CLAUDE.md#styling-system-tldr).

## NativeWind + Tailwind

NativeWind v4 styles every component via the `className` prop. The
runtime sits behind a Metro plugin ([metro.config.js](../metro.config.js))
plus a small babel preset; Tailwind classes resolve at render time using
the rules in [tailwind.config.js](../tailwind.config.js) and the
[global.css](../global.css) entry imported once from [App.tsx](../App.tsx).

## Custom CPS palette

Defined in [tailwind.config.js](../tailwind.config.js):

| Class | Hex | Used for |
| --- | --- | --- |
| `bg-cps-red` / `text-cps-red` | `#D2160F` | Penalized state, defeat text |
| `bg-cps-orange` / `text-cps-orange` | `#E87600` | (defined; rarely used) |
| `bg-cps-yellow` / `text-cps-yellow` | `#F7D133` | Default button face, timer text |
| `bg-cps-green` / `text-cps-green` | `#8CC63F` | START button, victory text, scoreboard wins |
| `bg-cps-gray` / `text-cps-gray` | `#3A3A39` | Button borders, overlay backdrops |
| `bg-cps-brown` / `text-cps-brown` | `#562900` | Main timer background |
| `bg-cps-deep-red` | `#4f0606` | Penalized timer background |

## Button family

Three nested-border button components for consistent depth / bezel:

- `CpsButtonBig` (3 + 4 + 6 px borders) — START, STOP, timer face, mode
  picker buttons.
- `CpsButtonSmall` (2 + 4 + 6 px) — Home button, scoreboard mistake
  squares.
- `CpsRoundButton` (1 + 2 + 5 px) — scoreboard victory circles.

## Typography

Goes through [`<StyledText>`](../components/StyledText.tsx), which wraps
RN's `Text` with a custom Acumin font lookup and screen-width-based
scaling (baseline: iPhone-5s 320pt width). The scale is **clamped** to
480pt on phone and 600pt on tablet (see [Tablet breakpoints](#tablet-breakpoints))
so text doesn't balloon on iPad while still growing proportionately.

## Tablet breakpoints

iPad is a first-class layout, not a centred phone window. The
[`useIsTablet()`](../hooks/useIsTablet.ts) hook returns `true` when the
device's smallest dimension is ≥ 600pt — catches every iPad
(mini ≈ 744pt → Pro 12.9" ≈ 1024pt), excludes every phone (iPhone 16
Pro Max smallest = 440pt). It's reactive via `useWindowDimensions()`.

When the hook returns true:

- `<StyledText>` raises its scale cap from 480pt to 600pt.
- Each screen caps the `maxWidth` of its action buttons (START, STOP,
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
there (the cap values are wider than any phone, and the layout strategy
doesn't change).

## Background images

The gray pattern is rendered via
[`<Background>`](../components/Background.tsx) — a drop-in
`<ImageBackground>` replacement that uses expo-image's `<Image>` with
`cachePolicy="memory-disk"`. The decoded bitmap stays in memory across
React Navigation mount/unmount cycles, which matters because every
forward navigation mounts a fresh screen. The asset itself is also
downscaled (`gray-pattern.png` is 833×1537, not the original 3334×6151)
so the first decode is cheap too.

The red chevron background is **not** a PNG — it's drawn programmatically
in SVG by [`<RedBackground>`](../components/RedBackground.tsx) (backed
by `react-native-svg`). Renders into the parent via absolute-fill,
scales to any aspect ratio without distortion. Two screen-tunable props:

- `chevronStart` (0–1): where the horizontal stripes begin from the top.
- `vDepth` (0–1): how deep the V-notch is cut into the bottom edge.
- Optional `chevronRise` and `stripeCount` for finer tuning.

`ResolveScreen` wraps it in an oversized parent with `overflow: hidden`
so the SVG renders at the same pixel size as Home's but with the top
cropped — the "same chevron, moved upward" feel.
