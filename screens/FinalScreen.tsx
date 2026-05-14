import * as React from 'react';
import { View, ImageBackground, Image, Animated, Easing } from 'react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import CpsButtonBig from '../components/CpsButtonBig';
import StyledText from '../components/StyledText';
import CustomConfettiCannon from '../components/ConfettiCannon';
import type { RootStackParamList } from '../types';

import Pattern from '../assets/images/gray-pattern.png';
import Screw from '../assets/images/screw.png';

type Props = NativeStackScreenProps<RootStackParamList, 'Final'>;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// `transformOrigin` is supported on both iOS and Android since RN 0.74,
// but the public TypeScript style types haven't caught up. The cast is
// purely to satisfy the compiler — it does nothing at runtime.
// Pivot is set to roughly where the screw image sits on the badge so the
// defeat animation hinges on it instead of swinging around the centre.
const transformOriginStyle = { transformOrigin: '25% 50%' } as unknown as object;

async function navigateHomeAfterDelay(navigation: Props['navigation']) {
  await sleep(1000);
  if (navigation.canGoBack()) {
    navigation.popToTop();
  }
}

export default function FinalScreen({ route, navigation }: Props) {
  const { gameMode, userHasWon } = route.params;

  const [showConfetti] = React.useState<boolean>(userHasWon);
  const rotateAnim = React.useRef(new Animated.Value(0)).current;
  const sound = React.useRef(new Audio.Sound());
  // See ResolveScreen.tsx for the full rationale — set once when audio
  // should no longer play, checked after each async audio op.
  const audioStoppedRef = React.useRef<boolean>(false);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: userHasWon ? ['0deg', '0deg'] : ['0deg', '90deg'],
  });

  // Defeat animation: bounce the badge sideways. Always declare the effect
  // at the top level (rules of hooks); skip the animation when the user won.
  React.useEffect(() => {
    if (userHasWon) return;
    Animated.timing(rotateAnim, {
      delay: 500,
      toValue: 1,
      duration: 5000,
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start();
  }, [rotateAnim, userHasWon]);

  // Audio lifecycle: register the playback-finished handler and the
  // beforeRemove listener that pops to home on back navigation.
  React.useEffect(() => {
    const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
      if (status.isLoaded && status.didJustFinish && !status.isLooping) {
        sound.current.unloadAsync();
        navigateHomeAfterDelay(navigation);
      }
    };
    sound.current.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

    const unsubscribe = navigation.addListener('beforeRemove', () => {
      unsubscribe(); // unsubscribe first to prevent infinite loop
      audioStoppedRef.current = true;
      sound.current.unloadAsync();
      navigation.popToTop();
    });

    return () => {
      audioStoppedRef.current = true;
      sound.current.unloadAsync();
    };
  }, [navigation]);

  // Load and play the victory/defeat audio once on mount.
  React.useEffect(() => {
    const loadAndPlay = async () => {
      if (audioStoppedRef.current) return;
      try {
        if (userHasWon) {
          if (gameMode.victoryAudios.length === 0) return;
          await sound.current.loadAsync(gameMode.victoryAudios[0], {}, false);
        } else {
          if (gameMode.defeatAudios.length === 0) return;
          const idx = Math.floor(Math.random() * gameMode.defeatAudios.length);
          await sound.current.loadAsync(gameMode.defeatAudios[idx], {}, false);
        }
        if (audioStoppedRef.current) {
          await sound.current.unloadAsync();
          return;
        }
        await sound.current.playAsync();
      } catch {
        try {
          await sound.current.unloadAsync();
        } catch {
          /* ignore */
        }
      }
    };
    loadAndPlay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View className="w-full h-full max-h-screen">
      <ImageBackground className="w-full h-full relative" source={Pattern} resizeMode="stretch">
        <View className="w-full h-full items-center justify-center">
          <Animated.View
            style={[
              transformOriginStyle,
              {
                transform: [{ rotate: spin }],
              },
            ]}
          >
            <CpsButtonBig>
              <View className="w-full bg-cps-yellow">
                <View className="w-full basis-[15%] flex-row items-center justify-center">
                  <Image className="w-[10%] h-full" source={Screw} resizeMode="contain" />
                  {userHasWon ? (
                    <View className="rounded-md -mt-2">
                      <StyledText
                        fontSize={36}
                        style="text-cps-green text-center font-black"
                        text="VICTORY!!"
                      />
                    </View>
                  ) : (
                    <View className="rounded-md -mt-2">
                      <StyledText
                        fontSize={36}
                        style="text-cps-red text-center font-black"
                        text="DEFEAT"
                      />
                    </View>
                  )}
                  {userHasWon && (
                    <Image className="w-[10%]" source={Screw} resizeMode="contain" />
                  )}
                </View>
              </View>
            </CpsButtonBig>
          </Animated.View>
 