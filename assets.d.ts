// Module declarations for static asset imports.
// Without these, TypeScript can't type expressions like
// `import logo from './logo.png'`. React Native's bundler turns asset
// `require`s/`import`s into entries in its asset registry; for typing
// purposes we just need the imports to resolve to a value, so we leave
// the type as `any` and let the call sites (Image source, Audio.loadAsync,
// useFonts, etc.) enforce their own expected shapes.

// Images
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.webp';
declare module '*.svg';

// Audio
declare module '*.mp3';
declare module '*.wav';
declare module '*.m4a';
declare module '*.ogg';

// Fonts
declare module '*.otf';
declare module '*.ttf';
declare module '*.woff';
declare module '*.woff2';
