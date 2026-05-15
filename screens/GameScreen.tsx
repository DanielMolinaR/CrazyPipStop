import * as React from 'react';
import { View, Image, ImageBackground, Pressable } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import CpsButtonBig from '../components/CpsButtonBig';
import HomeButton from '../components/HomeButton';
import PhoneFrame from '../components/PhoneFrame';
import Scoreboard from '../components/Scoreboard';
import StyledText from '../components/StyledText';
import type { RootStackParamList } from '../types';

import Logo from '../assets/images/cps-logo.png';
import Background from '../assets/images/red-background-75_9-16.png';
import Pattern from '../assets/images/gray-pattern.png';

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

export default function GameScreen({ route, navigation }: Props) {
  const { gameMode } = route.params;
  const [isPenalized, setIsPenalized] = React.useState<boolean>(gameMode.isPenalized);
  const { isPenalizationUsed } = gameMode;

  const onStart = () => {
    // Bake the user's penalization choice into the gameMode passed forward.
    // The Resolve screen reads this to decide which audio cue to play.
    navigation.navigate('Resolve', {
      gameMode: { ...gameMode, isPenalized },
    });
  };

  // Top section: penalization toggle (only meaningful for modes with penalization).
  const renderPenalizationButton = () => {
    if (!gameMode.hasPenalization) {
      return <View className="w-[35%]" />;
    }
    const bg = isPenalized ? 'bg-cps-red' : 'bg-cps-yellow';
    const textColor = isPenalized ? 'text-white' : '';

    if (isPenalizationUsed) {
      return (
        <View className="w-[35%] z-10 opacity-25">
          <CpsButtonBig>
            <View className={`w-full h-full ${bg} rounded-md justify-center`}>
              <StyledText
                fontSize={32}
                style={`text-center ${textColor} font-black`}
                text={'-5"'}
              />
            </View>
          </CpsButtonBig>
        </View>
      );
    }

    return (
      <Pressable className="w-[35%] z-10" onPress={() => setIsPenalized(!isPenalized)}>
        <CpsButtonBig>
          <View className={`w-full h-full ${bg} rounded-md justify-center`}>
            <StyledText
              fontSize={32}
              style={`text-center ${textColor} font-black`}
              text={'-5"'}
            />
          </View>
        </CpsButtonBig>
      </Pressable>
    );
  };

  // Middle section: main timer display.
  const renderMainTimer = () => {
    const showPenaltyStyle = isPenalized && !isPenalizationUsed;
    const bg = showPenaltyStyle ? 'bg-cps-deep-red' : 'bg-cps-brown';
    const textColor = showPenaltyStyle ? 'text-cps-red' : 'text-cps-yellow';
    return (
      <View className="w-2/4 -mt-5 z-0">
        <CpsButtonBig>
          <View className={`flex w-full h-full ${bg} rounded-md items-center justify-center`}>
            <StyledText
              fontSize={48}
              style={`${textColor} font-black`}
              text={`${gameMode.secondsCounter}"`}
            />
          </View>
        </CpsButtonBig>
      </View>
    );
  };

  // Bottom of timer area: preview of the penalized (shorter) duration.
  const renderPenalizedPreview = () => {
    if (!isPenalized || isPenalizationUsed) {
      return <View className="w-[35%]" />;
    }
    const previewSeconds = gameMode.secondsCounter - gameMode.penalizationTime;
    return (
      <View className="w-[35%] z-10 -mt-4">
        <CpsButtonBig>
          <View className="w-full h-full bg-cps-brown rounded-md items-center justify-center">
            <StyledText
              fontSize={36}
              style="font-black text-cps-yellow"
              text={`${previewSeconds}"`}
            />
          </View>
        </CpsButtonBig>
      </View>
    );
  };

  return (
    <PhoneFrame>
      <View className="w-full h-full max-h-screen">
      <ImageBackground className="w-full h-full relative" source={Pattern} resizeMode="stretch">
        <View className="h-3/4">
          <ImageBackground className="w-full h-full" source={Background} />
        </View>
        <HomeButton onPress={() => navigation.popToTop()} />
        <View className="flex w-full h-full absolute">
          <View className="flex gap-y-1 w-full h-[73%]">
            <View className="w-full h-1/6 items-center justify-end">
              <Image className="w-5/6 h-5/6" source={Logo} resizeMode="contain" />
            </View>
            <View className="flex w-full h-3/6">
              <View className="w-full h-[35%] items-center justify-center">
                {renderPenalizationButton()}
              </View>
              <View className="w-full h-[40%] items-center justify-center">{renderMainTimer()}</View>
              <View className="w-full h-[25%] items-center justify-center">
                {renderPenalizedPreview()}
              </View>
            </View>
            <View className="flex w-full h-2/6 items-center">
              <Pressable className="w-3/5 h-5/6 z-10" onPress={onStart}>
                <CpsButtonBig>
                  <View className="w-full h-full bg-cps-green rounded-md justify-center">
                    <StyledText
                      fontSize={40}
                      style="text-center font-black text-white"
                      text="START"
                    />
                  </View>
                </CpsButtonBig>
              </Pressable>
            </View>
          </View>
          <Scoreboard
            victoryPoints={gameMode.victoryPoints}
            maxVictoryPoints={gameMode.maxVictoryPoints}
            losingPoints={gameMode.losingPoints}
            maxLosePoints={gameMode.maxLosePoints}
          />
        </View>
      </ImageBackground>
    </View>
    </PhoneFrame>
  );
}
