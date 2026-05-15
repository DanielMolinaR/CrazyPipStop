import * as React from 'react';
import { View } from 'react-native';

// Caps every screen's content to a phone-equivalent width and centres it.
// On phones the screen is narrower than PHONE_MAX_WIDTH so this is a
// no-op. On tablets — where the percentage-based screen layouts would
// otherwise produce wide-and-short buttons and oversized text — it
// renders the app inside a phone-shaped window with `bg-cps-gray` bands
// on either side (matching the existing dark UI borders).
//
// Future work: real tablet breakpoints + dedicated iPad-aspect background
// images. Until then this is the pragmatic "looks right" fix.
const PHONE_MAX_WIDTH = 480; // pt — comfortably above the widest phone
                              // (iPhone 16 Pro Max ≈ 440 pt).

interface PhoneFrameProps {
  children: React.ReactNode;
}

export default function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <View className="w-full h-full bg-cps-gray items-center">
      <View className="w-full h-full" style={{ maxWidth: PHONE_MAX_WIDTH }}>
        {children}
      </View>
    </View>
  );
}
