import * as React from 'react';
import { View, Image, Pressable } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Background from '../components/Background';
import CountDown from '../components/CountDown';
import CpsButtonBig from '../components/CpsButtonBig';
import RedBackground from '../components/RedBackground';
import Scoreboard from '../components/Scoreboard';
import StyledText from '../components/StyledText';
import { useIsTablet } from '../hooks/useIsTablet';
import { advanceMode, isGameOver, didPlayerWin } from '../lib/gameLogic';
import type { RootStackParamList } from '../types';

import Logo from '../assets/images/cps-logo.png';
import Pattern from '../assets/images/gray-pattern.png';

// Tablet caps for the various button shapes on this screen — without
// these, percentage widths stretch on iPad and the buttons look way
// wider than their content intends. All no-ops on phone.
const TABLET_ACTION_MAX_WIDTH = 360;  // STOP / OK?
const TABLET_TIMER_MAX_WIDTH = 240;   // brown countdown displays
import redX from '../assets/images/x-small-white-border.png';
import greenTick from '../assets/images/tick-small-white-border.png';

type Props = NativeStackScreenProps<RootStackParamList, 'Resolve'>;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export default function ResolveScreen({ route, navigation }: Props) {
  const { gameMode } = route.params;
  const time = gameMode.isPenalized
    ? gameMode.secondsCounter - gameMode.penalizationTime
    : gameMode.secondsCounter;
  const isTablet = useIsTablet();
  const actionStyle = isTablet ? { maxWidth: TABLET_ACTION_MAX_WIDTH } : undefined;
  const timerStyle = isTablet ? { maxWidth: TABLET_TIMER_MAX_WIDTH } : undefined;

  // Pick the countdown audio track once per mount so the source passed to
  // useAudioPlayer is stable for the life of this screen. Penalized vs.
  // normal bank picked from the gameMode params, then a random pick within
  // that bank. Empty deps means the pick is final for this mount —
  // re-renders never roll a new track on the same round.
  const audioSource = React.useMemo(() => {
    const tracks = gameMode.isPenalized ? gameMode.penalizedAudios : gameMode.audios;
    if (tracks.length === 0) return null;
    return tracks[Math.floor(Math.random() * tracks.length)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useAudioPlayer ties the player's lifecycle to this component — when
  // the screen unmounts (next round, back navigation, etc.), the player is
  // released automatically. That replaces all the manual loadAsync /
  // unloadAsync / audioStoppedRef bookkeeping that lived here under
  // expo-av.
  const player = useAudioPlayer(audioSource);

  const [isRunning, setIsRunning] = React.useState<boolean>(true);
  const [showAppOptions, setShowAppOptions] = React.useState<boolean>(false);

  // CountDown calls this once on mount (via its onSound prop) to kick off
  // the audio cue alongside the visual lead-in delay.
  const playAudio = () => {
    if (audioSource) {
      player.play();
    }
  };

  const showOptionsAndHandleAudio = async (hasFinished: boolean) => {
    if (hasFinished) {
      // Let the final beat of the countdown audio play out before showing
      // the OK? overlay.
      await sleep(2000);
    }
    setIsRunning(false);
    setShowAppOptions(true);
    player.pause();
  };

  const onResult = (userWon: boolean) => {
    const next = advanceMode(gameMode, userWon);
    if (isGameOver(next)) {
      navigation.navigate('Final', { userHasWon: didPlayerWin(next), gameMode: next });
    } else {
      navigation.navigate('Game', { gameMode: next });
    }
  };

  return (
    <View className="w-full h-full max-h-screen">
      <Background className="w-full h-full relative" source={Pattern} resizeMode="stretch">
        {/* The red region only occupies the top 1/3 of the screen,
            but we render the RedBackground SVG at 3× height anchored
            upward and clip the overflow — so the stripes/notch are
            sized like Home's design with the top cropped off, rather
            than being squashed into a third of the area. */}
        <View className="w-full h-1/3 flex justify-end items-center overflow-hidden">
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '-200%',
              height: '300%',
            }}
          >
            <RedBackground chevronStart={0.4} vDepth={0.06} stripeCount={26} />
          </View>
        </View>
        <View className="w-full h-full absolute">
          <View className="w-full h-[73%]">
            <View className="w-full h-[15%] items-center">
              <Image className="w-5/6 h-5/6" source={Logo} resizeMode="contain" />
            </View>
            <View className="flex w-full h-[30%] items-center justify-center">
              <View className="w-2/4 h-[65%] -mt-4" style={timerStyle}>
                <CpsButtonBig>
                  <View className="w-full h-full bg-cps-brown rounded-md items-center justify-center">
                    <StyledText
                      fontSize={40}
                      style="text-cps-yellow font-black"
                      text={`${time}"`}
                    />
                  </View>
                </CpsButtonBig>
              </View>
            </View>
            <View className="flex w-full h-[55%] items-center">
              <CountDown
                style="w-3/4 h-[50%] z-0"
                until={time}
                onFinish={showOptionsAndHandleAudio}
                running={isRunning}
                onSound={playAudio}
              />
              <View className="flex w-full h-[50%] items-center -mt-4 z-10">
                <Pressable
                  className="w-3/5 h-[90%] z-10"
                  style={actionStyle}
                  onPress={() => showOptionsAndHandleAudio(false)}
                >
                  <CpsButtonBig>
                    <View className="w-full h-full bg-cps-yellow rounded-md items-center justify-center">
                      <StyledText fontSize={40} style="font-black" text="STOP" />
                    </View>
                  </CpsButtonBig>
                </Pressable>
              </View>
            </View>
          </View>
          <Scoreboard
            victoryPoints={gameMode.victoryPoints}
            maxVictoryPoints={gameMode.maxVictoryPoints}
            losingPoints={gameMode.losingPoints}
            maxLosePoints={gameMode.maxLosePoints}
            victoryFontSize={24}
          />
        </View>
        {showAppOptions && (
          <View className="w-full h-full absolute z-20">
            <View className="w-full h-full bg-cps-gray opacity-75" />
            <View className="w-full h-full absolute">
              <View className="w-full h-1/2 items-center justify-center">
                <View className="w-3/4 h-1/2" style={actionStyle}>
                  <CpsButtonBig>
                    <View className="w-full h-full bg-cps-yellow rounded-md items-center justify-center">
                      <StyledText fontSize={36} style="text-center font-black" text="OK?" />
                    </View>
                  </CpsButtonBig>
                </View>
              </View>
              <View className="w-full h-1/2 items-center justify-center flex flex-row">
                <View className="w-2/5 h-full items-start">
                  <Pressable className="w-4/5 h-1/3" onPress={() => onResult(false)}>
                    <View className="h-full rounded-md items-center justify-center">
                      <Image className="w-5/6" source={redX} resizeMode="contain" />
                    </View>
                  </Pressable>
                </View>
                <View className="w-2/5 h-full items-end">
                  <Pressable className="w-4/5 h-1/3" onPress={() => onResult(true)}>
                    <View className="h-full rounded-md items-center justify-center">
                      <Image className="w-5/6" source={greenTick} resizeMode="contain" />
                    </View>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        )}
      </Background>
    </View>
  );
}
