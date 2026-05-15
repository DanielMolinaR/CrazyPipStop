import * as React from 'react';
import { Text, Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Based on iPhone 5s (320pt-wide) baseline; resulting size scales with the
// device's screen width so layouts feel consistent across phone sizes.
//
// Clamped to PHONE_MAX_WIDTH (480pt) — the same width PhoneFrame caps
// content at — so on tablets the text inside the centered frame renders
// at the same size as on the widest phone, instead of ballooning with
// the iPad's actual screen width (820pt+).
const PHONE_MAX_WIDTH = 480;
const SCALE = Math.min(SCREEN_WIDTH, PHONE_MAX_WIDTH) / 320;

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
      className={`text-[Acumin] ${style}`}
      allowFontScaling={false}
      style={{ fontSize: normalize(fontSize) }}
    >
      {text}
    </Text>
  );
}
