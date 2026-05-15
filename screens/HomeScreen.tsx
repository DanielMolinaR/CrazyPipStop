import * as React from 'react';
import { View, Image, ImageBackground, Pressable } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import CpsButtonBig from '../components/CpsButtonBig';
import StyledText from '../components/StyledText';
import { cloneGameMode } from '../lib/gameLogic';
import { gameModes } from '../lib/gameModes';
import type { RootStackParamList } from '../types';

import Logo from '../assets/images/cps-logo.png';
import Background from '../assets/images/red-background-9-16.png';
import Pattern from '../assets/images/gray-pattern.png';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View className="w-full h-full max-h-max bg-gray-pattern">
      <ImageBackground className="w-full h-full" source={Pattern} resizeMode="stretch">
        <ImageBackground
          className="w-full h-full pt-4"
          source={Background}
          resizeMode="stretch"
        >
          <View className="w-full h-[25%] items-center">
            <Image className="w-5/6 h-5/6" source={Logo} resizeMode="contain" />
          </View>
          <View className="w-full h-[75%]">
            <View className="w-full h-[87%] pt-12 gap-y-4 items-center">
              {gameModes.map((mode) => (
                <Pressable
                  key={mode.name}
                  className="w-2/3 h-[16%]"
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
        </ImageBackground>
      </ImageBackground>
    </View>
  );
}
