import { useWindowDimensions } from 'react-native';

// Tablet detection breakpoint. The "smallest dimension" check is what
// matters: a device whose narrower side is ≥ 600pt is treated as a
// tablet, everything below is a phone.
//
// Why 600?
//   - Every iPad's smallest dimension exceeds this (iPad mini ≈ 744,
//     Air ≈ 820, Pro 11" ≈ 834, Pro 12.9" ≈ 1024).
//   - No common phone reaches it (iPhone 16 Pro Max smallest = 440).
//   - Matches the common Android `sw600dp` tablet bucket.
//
// Reactive to dimension changes (orientation, split-view, etc.) thanks
// to `useWindowDimensions`. The app is portrait-locked today, but the
// hook stays correct if that ever changes.
const TABLET_BREAKPOINT = 600;

export function useIsTablet(): boolean {
  const { width, height } = useWindowDimensions();
  return Math.min(width, height) >= TABLET_BREAKPOINT;
}
