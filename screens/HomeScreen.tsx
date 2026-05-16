import * as React from 'react';
import { View, Image, Pressable } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Background from '../components/Background';
import CpsButtonBig from '../components/CpsButtonBig';
import RedBackground from '../components/RedBackground';
import StyledText from '../components/StyledText';
import { useIsTablet } from '../hooks/useIsTablet';
import { cloneGameMode } from '../lib/gameLogic';
import { gameModes } from '../lib/gameModes';
import type { RootStackParamList } from '../types';

import Logo from '../assets/images/cps-logo.png';
import Pattern from '../assets/images/gray-pattern.png';

// On tablets, cap each mode-picker button so they don't stretch across
// the wider iPad screen. No-op on phones (their screens are narrower
// than this cap anyway).
const TABLET_BUTTON_MAX_WIDTH = 400;

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const isTablet = useIsTablet();
  const buttonStyle = isTablet ? { maxWidth: TABLET_BUTTON_MAX_WIDTH } : undefined;

  return (
    <View className="w-full h-full max-h-max bg-gray-pattern">
      <Background className="w-full h-full" source={Pattern} resizeMode="stretch">
        <View className="w-full h-full pt-4">
          <RedBackground chevronStart={0.4} vDepth={0.06} />
          <View className="w-full h-[25%] items-center">
            <Image className="w-5/6 h-5/6" source={Logo} resizeMode="contain" />
          </View>
          <View className="w-full h-[75%]">
            <View className="w-full h-[87%] pt-12 gap-y-4 items-center">
              {gameModes.map((mode) => (
                <Pressable
                  key={mode.name}
                  className="w-2/3 h-[16%]"
                  style={buttonStyle}
                  onPress={() =>
                    navigation.navigate('Game', { gameMode: cloneGameMode(mode) })
                  }
                >
                  <CpsButtonBig>
                    <View className="w-full h-full bg-cps-yellow rounded-md items-center justify-center">
                      <StyledText fontSize={30} style="font-black" text={mode.name} />
                    </View>
                  </CpsButtonBig>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Background>
    </View>
  );
}
