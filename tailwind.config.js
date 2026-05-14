// Tailwind configuration consumed by Metro/NativeWind v4.
//
// Two v4-specific changes vs the v2 config:
//   1. `presets: [require('nativewind/preset')]` is now required.
//      The preset turns off Tailwind features that don't make sense
//      on React Native (preflight reset, container queries that
//      depend on real CSS, etc.) and wires in the RN-flavoured
//      defaults v4 expects.
//   2. The `content` glob and the `theme.extend` block work
//      identically to before — same custom palette (cps-*), same
//      arbitrary-value support for h-[73%]/w-[10%]/etc.
//
// `backgroundImage` is kept here for the `bg-gray-pattern` /
// `bg-red-background` classes. These resolve to CSS background-image
// values, which React Native doesn't actually support at runtime —
// the on-screen pattern texture is rendered by
// <ImageBackground source={Pattern}> components, not by these
// classes. The entries are harmless leftovers; removing them along
// with the matching className would be a no-op but a cleaner
// codebase. Kept here per the choice made during the migration plan.

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './screens/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        'cps-red': '#D2160F',
        'cps-orange': '#E87600',
        'cps-yellow': '#F7D133',
        'cps-green': '#8CC63F',
        'cps-gray': '#3A3A39',
        'cps-brown': '#562900',
        'cps-deep-red': '#4f0606',
      },
      backgroundImage: {
        'red-background': "url('./assets/red-background.png')",
        'gray-pattern': "url('./assets/gray-pattern.png')",
      },
    },
  },
  plugins: [],
};
