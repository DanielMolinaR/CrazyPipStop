import * as React from 'react';
import { View, Image, ImageBackground, Pressable } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import CpsButtonBig from '../components/CpsButtonBig';
import StyledText from '../components/StyledText';
import type { GameMode, RootStackParamList } from '../types';

import Logo from '../assets/images/cps-logo.png';
import Background from '../assets/images/red-background-9-16.png';
import Pattern from '../assets/images/gray-pattern.png';

// Countdown audio cues
const track15N = require('../assets/music/countdowns/PIT_15.wav');
const track15CT = require('../assets/music/countdowns/PIT_15_CT.wav');
const track20N = require('../assets/music/countdowns/PIT_20.wav');
const track20CT = require('../assets/music/countdowns/PIT_20_CT.wav');
const track25N = require('../assets/music/countdowns/PIT_25.wav');
const track25CT = require('../assets/music/countdowns/PIT_25_CT.wav');
const track30N = require('../assets/music/countdowns/PIT_30.wav');
const track30B = require('../assets/music/countdowns/PIT_30_B.wav');
const track30CT = require('../assets/music/countdowns/PIT_30_CT.wav');
const track40N = require('../assets/music/countdowns/PIT_40.wav');
const track40CT = require('../assets/music/countdowns/PIT_40_CT.wav');

// Outcome stings
const ovation = require('../assets/music/victory/OVATION.mp3');
const victoryPro = require('../assets/music/victory/FINAL_PRO.mp3');
const brokenCar = require('../assets/music/defeat/BROKEN_CAR.mp3');
const defeat = require('../assets/music/defeat/DEFEAT.wav');

const trainingMode: GameMode = {
  name: 'TRAINING',
  secondsCounter: 40,
  audios: [track40N, track40CT],
  victoryAudios: [ovation],
  defeatAudios: [defeat, brokenCar],
  victoryPoints: 0,
  losingPoints: 0,
  maxVictoryPoints: 5,
  maxLosePoints: 6,
  hasPenalization: false,
  isPenalized: false,
  isPenalizationUsed: false,
  penalizationTime: 0,
  penalizedAudios: [],
};

const amateurMode: GameMode = {
  name: 'AMATEUR',
  secondsCounter: 30,
  audios: [track30N, track30B, track30CT],
  victoryAudios: [ovation],
  defeatAudios: [defeat, brokenCar],
  victoryPoints: 0,
  losingPoints: 0,
  maxVictoryPoints: 5,
  maxLosePoints: 4,
  hasPenalization: true,
  isPenalized: false,
  isPenalizationUsed: false,
  penalizationTime: 5,
  penalizedAudios: [track25N, track25CT],
};

const advancedMode: GameMode = {
  name: 'ADVANCED',
  secondsCounter: 25,
  audios: [track25N, track25CT],
  victoryAudios: [ovation],
  defeatAudios: [defeat, brokenCar],
  victoryPoints: 0,
  losingPoints: 0,
  maxVictoryPoints: 5,
  maxLosePoints: 4,
  hasPenalization: true,
  isPenalized: false,
  isPenalizationUsed: false,
  penalizationTime: 5,
  penalizedAudios: [track20N, track20CT],
};

const proMode: GameMode = {
  name: 'PRO',
  secondsCounter: 15,
  audios: [track15N, track15CT],
  victoryAudios: [victoryPro],
  defeatAudios: [defeat, brokenCar],
  victoryPoints: 0,
  losingPoints: 0,
  maxVictoryPoints: 5,
  maxLosePoints: 3,
  hasPenalization: false,
  isPenalized: false,
  isPenalizationUsed: false,
  penalizationTime: 0,
  penalizedAudios: [],
};

const gameModes: GameMode[] = [trainingMode, amateurMode, advancedMode, proMode];

// Each navigation away from Home starts a fresh game session, so we deep-clone
// the mode template to avoid sharing array references with the running game.
function cloneGameMode(mode: GameMode): GameMode {
  return {
    ...mode,
    audios: [...mode.audios],
    victoryAudios: [...mode.victoryAudios],
    defeatAudios: [...mode.defeatAudios],
    penalizedAudios: [...mode.penalizedAudios],
  };
}

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
