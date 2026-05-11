import * as React from 'react';
import { Text, Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Based on iPhone 5s (320pt-wide) baseline; resulting size scales with the
// device's screen width so layouts feel consistent across phone sizes.
const SCALE = SCREEN_WIDTH / 320;

function normalize(size: number): number {
  const scaled = size * SCALE;
  const rounded = Math.round(PixelRatio.roundToNearestPixel(scaled));
  return Platform.OS === 'ios' ? rounded : rounded - 2;
}

interface StyledTextProps {
  text: string | number;
  fontSize: number;
  style?: string;
}

export default function StyledText({ text, fontSize, style = '' }: StyledTextProps) {
  return (
    <Text
      className={`text-[Axumin] ${style}`}
      allowFontScaling={false}
      style={{ fontSize: normalize(fontSize) }}
    >
      {text}
    </Text>
  );
}
