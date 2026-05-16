import * as React from 'react';
import { Text, Platform, PixelRatio, useWindowDimensions } from 'react-native';

import { useIsTablet } from '../hooks/useIsTablet';

// Based on iPhone 5s (320pt-wide) baseline; resulting size scales with the
// device's screen width so layouts feel consistent across device sizes.
//
// The scale is clamped to a maximum width so text stays readable rather
// than ballooning. The cap is higher on tablets — text needs more
// presence on a larger screen — but still bounded so it doesn't run
// away on the biggest iPad Pros.
//
//   phone cap  = 480 pt  (≈ widest phone; iPhone 16 Pro Max ≈ 440)
//   tablet cap = 600 pt  (1.875× baseline — proportionate on iPad)
const PHONE_MAX_WIDTH = 480;
const TABLET_MAX_WIDTH = 600;

interface StyledTextProps {
  text: string | number;
  fontSize: number;
  style?: string;
}

export default function StyledText({ text, fontSize, style = '' }: StyledTextProps) {
  const { width } = useWindowDimensions();
  const cap = useIsTablet() ? TABLET_MAX_WIDTH : PHONE_MAX_WIDTH;
  const scale = Math.min(width, cap) / 320;
  const scaled = fontSize * scale;
  const rounded = Math.round(PixelRatio.roundToNearestPixel(scaled));
  const size = Platform.OS === 'ios' ? rounded : rounded - 2;
  return (
    <Text
      className={`text-[Acumin] ${style}`}
      allowFontScaling={false}
      style={{ fontSize: size }}
    >
      {text}
    </Text>
  );
}
