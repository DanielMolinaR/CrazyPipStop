// Augments React Native's component prop types so TypeScript accepts the
// `className` prop that NativeWind v2 injects via its babel plugin.
// When upgrading to NativeWind v4 this file should be replaced with the
// reference directive `/// <reference types="nativewind/types" />`.

declare module 'react-native' {
  interface ViewProps {
    className?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface ImageProps {
    className?: string;
  }
  interface ImageBackgroundProps {
    className?: string;
  }
  interface PressableProps {
    className?: string;
  }
  interface ScrollViewProps {
    className?: string;
  }
  interface TouchableOpacityProps {
    className?: string;
  }
  interface TouchableHighlightProps {
    className?: string;
  }
  interface TextInputProps {
    className?: string;
  }
}

export {};
