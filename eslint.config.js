// Flat-config ESLint setup for ESLint 9+. Replaces the older `.eslintrc.js`
// format which ESLint 9 dropped support for.
// Docs: https://eslint.org/docs/latest/use/configure/configuration-files

const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  ...expoConfig,
  {
    ignores: [
      'node_modules/**',
      '.expo/**',
      'dist/**',
      'babel.config.js',
      'tailwind.config.js',
      'metro.config.js',
      'assets/**',
      // The orphaned .js files left over from the TS migration — they're
      // one-line deprecation stubs and not worth linting. Delete them
      // following the README cleanup instructions and these entries can
      // come out of the ignore list.
      'App.js',
      'screens/*.js',
      'components/*.js',
    ],
  },
];
