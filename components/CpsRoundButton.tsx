import * as React from 'react';
import { View } from 'react-native';

interface CpsRoundButtonProps {
  children: React.ReactNode;
}

export default function CpsRoundButton({ children }: CpsRoundButtonProps) {
  return (
    <View className="w-full h-full bg-white border-[1px] border-cps-gray rounded-full">
      <View className="w-full h-full bg-cps-gray border-[2px] border-white rounded-full">
        <View className="w-full h-full border-[5px] border-cps-gray rounded-full">{children}</View>
      </View>
    </View>
  );
}
