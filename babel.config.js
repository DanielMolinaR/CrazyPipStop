// Babel configuration. NativeWind v4 changes the Babel side
// significantly compared to v2:
//
//   v2 used "nativewind/babel" as a plugin that rewrote every
//     className="..." into a style={...} literal at compile time.
//   v4 has Metro do the heavy lifting (see metro.config.js). Babel's
//     remaining job is to (a) tell babel-preset-expo to import JSX
//     from "nativewind" so the runtime can intercept className, and
//     (b) load the "nativewind/babel" preset which sets up the small
//     amount of compile-time transformation that's still needed
//     (mainly registering the className prop on RN's component types).
//
// Without the jsxImportSource option the runtime shim never sees
// className at all and every class becomes a no-op string.

module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
  };
};
