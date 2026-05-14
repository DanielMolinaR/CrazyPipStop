import * as React from 'react';
import { View } from 'react-native';

interface CpsButtonSmallProps {
  children: React.ReactNode;
}

export default function CpsButtonSmall({ children }: CpsButtonSmallProps) {
  return (
    <View className="w-full h-full bg-white border-2 border-cps-gray rounded-2xl">
      <View className="w-full h-full bg-cps-gray border-4 border-white rounded-xl">
        <View className="w-full h-full border-[6px] border-cps-gray rounded-xl">{children}</View>
      </View>
    </View>
  );
}
