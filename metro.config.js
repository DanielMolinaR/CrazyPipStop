// Metro bundler configuration. NativeWind v4 hooks in here via
// withNativeWind, which:
//   1. teaches Metro to treat `.css` as a recognised source extension,
//   2. parses the Tailwind directives in `./global.css` against the
//      tailwind.config.js content map, and
//   3. produces the runtime CSS-in-JS shim that resolves `className`
//      strings on every native component at render time.
//
// Without this file, `expo start` runs Metro with stock Expo defaults
// and every `className` prop ends up as a no-op string.

const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './global.css' });
