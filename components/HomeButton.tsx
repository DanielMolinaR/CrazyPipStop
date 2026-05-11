import * as React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import CpsButtonSmall from './CpsButtonSmall';

interface HomeButtonProps {
  onPress: () => void;
}

// Small fixed-position "go to home" affordance, placed by the parent screen.
// Uses absolute positioning at the top-left so it overlays the existing
// layout without disturbing the percentage-based heights the rest of the
// game flow relies on. Visual treatment matches `CpsButtonSmall` so it
// reads as part of the same button family.
export default function HomeButton({ onPress }: HomeButtonProps) {
  return (
    <View className="absolute top-2 left-2 w-14 h-14 z-30" style={{ zIndex: 30 }}>
      <Pressable onPress={onPress} className="w-full h-full">
        <CpsButtonSmall>
          <View className="w-full h-full bg-cps-yellow rounded-md items-center justify-center">
            <Ionicons name="home" size={24} color="black" />
          </View>
        </CpsButtonSmall>
      </Pressable>
    </View>
  );
}
