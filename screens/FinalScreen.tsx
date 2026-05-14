import * as React from 'react';
import { View, ImageBackground, Image, Animated, Easing } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
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

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: userHasWon ? ['0deg', '0deg'] : ['0deg', '90deg'],
  });

  // Pick the outcome audio once per mount. Victory uses the configured
  // single victory sting (first entry); defeat randomly picks from the
  // bank. Empty deps -> the pick is final for this mount.
  const audioSource = React.useMemo(() => {
    if (userHasWon) {
      return gameMode.victoryAudios.length > 0 ? gameMode.victoryAudios[0] : null;
    }
    if (gameMode.defeatAudios.length === 0) return null;
    return gameMode.defeatAudios[
      Math.floor(Math.random() * gameMode.defeatAudios.length)
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useAudioPlayer's hook lifecycle releases the player when this screen
  // unmounts — no manual unloadAsync or audioStoppedRef bookkeeping
  // required.
  const player = useAudioPlayer(audioSource);

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

  // Start the outcome audio once on mount.
  React.useEffect(() => {
    if (audioSource) {
      player.play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When the audio finishes naturally, return to Home after a short
  // delay. Replaces the old setOnPlaybackStatusUpdate hook on the
  // Audio.Sound instance.
  React.useEffect(() => {
    const sub = player.addListener('playbackStatusUpdate', (status) => {
      if (status.didJustFinish) {
        navigateHomeAfterDelay(navigation);
      }
    });
    return () => sub.remove();
  }, [player, navigation]);

  // Override the system back button: any leave from this screen pops
  // straight to Home rather than landing back on Resolve.
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      unsubscribe(); // unsubscribe first to prevent infinite loop
      navigation.popToTop();
    });
    return unsubscribe;
  }, [navigation]);

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
        </View>
        {showConfetti && <CustomConfettiCannon />}
      </ImageBackground>
    </View>
  );
}
