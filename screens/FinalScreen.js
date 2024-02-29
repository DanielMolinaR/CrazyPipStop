import * as React from 'react';
import { View, ImageBackground, Image, Animated, Easing, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';


// Components
import CpsButtonBig from '../components/CpsButtonBig';
import StyledText from '../components/StyledText';
import CustomConfettiCannon from '../components/ConfettiCannon';

import Pattern from "../assets/images/gray-pattern.png"
import Screw from "../assets/images/screw.png"

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function navigate(navigation) {
  await sleep(1000)
  navigation.popToTop();
}

const FinalScreen = ({ route, navigation }) => {

    const styles = StyleSheet.create({
      transformOriginView: {
        transformOrigin: '16%',
      },
    });

    GameMode = route.params.gameMode;
    UserHasWon = route.params.userHasWon;

    const [showConfetti, setShowConfetti] = React.useState(UserHasWon);

    React.useEffect(() => {
      setTimeout(() => {
        setShowConfetti(false);
        UserHasWon = false
      }, 4500);
    }, [showConfetti]);

    const rotateAnim = React.useRef(new Animated.Value(0)).current;

    var spin = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '0deg'],
    });

    if (!UserHasWon) {
      React.useEffect(() => {
          Animated.timing(rotateAnim, {
            delay: 500,
            toValue: 1,
            duration: 5000,
            easing: Easing.bounce,
            useNativeDriver: true,
          }).start();
      }, [rotateAnim]);
    
      spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg'],
      });
    }

    const sound = React.useRef(new Audio.Sound());
  
    React.useEffect(() => {
      const playbackStatus  = async (playbackStatus ) => {
        if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
          sound.current.unloadAsync();
          navigate(navigation)
        }
      }
      sound.current.setOnPlaybackStatusUpdate(playbackStatus);
      const unsubscribe = navigation.addListener('beforeRemove', e => {
        e.preventDefault(); // Prevent default action
        unsubscribe() // Unsubscribe the event on first call to prevent infinite loop
        sound.current.unloadAsync();
        navigation.popToTop()// Navigate to your desired screen
      });
    }, []);

    const play = () => {
      (async () => {
        await LoadAudio()
        sound.current.playAsync();
      })();  
    }

    const LoadAudio = async () => {
      if (UserHasWon) {
        await sound.current.loadAsync(GameMode.victoryAudios[0], {}, true);
      } else {
        const randomNumber =  Math.floor(Math.random() * (GameMode.defeatAudios.length - 0)); 
        await sound.current.loadAsync(GameMode.defeatAudios[randomNumber], {}, true);
      }
    };
    
    play()

    return (
    <View className="w-full h-full max-h-screen">
        <ImageBackground className="w-full h-full relative" source={Pattern} resizeMode="stretch">
            <View className="w-full h-full items-center justify-center">
                <Animated.View 
                    style={[
                        styles.transformOriginView,
                        {
                        transform: [{rotate: spin}],
                        },
                    ]}>
                    <CpsButtonBig >
                        <View className="w-full bg-cps-yellow">
                            <View className="w-full basis-[15%] flex-row items-center justify-center">
                                <Image className="w-[10%] h-full" source={Screw} resizeMode="contain"/>
                                {UserHasWon ? (
                                    <View className="rounded-md mt-2">
                                        <StyledText style="text-5xl text-cps-green text-center font-black" text="¡¡HABEIS GANADO!!" />
                                    </View>
                                ) : (
                                    <View className="rounded-md mt-2">
                                        <StyledText style="text-5xl text-cps-red text-center font-black" text="¡¡HABEIS PERDIDO!!" />
                                    </View>
                                )}
                                {UserHasWon ? (
                                    <Image className="w-[10%]" source={Screw} resizeMode="contain"/>
                                ) : (
                                    <View className="w-[5.5%] h-[13.8%] bg-black rounded-full">
                                    </View>
                                )}
                            </View>
                       </View>
                    </CpsButtonBig>
                </Animated.View>
            </View>
            {showConfetti && (
                <CustomConfettiCannon />
            )}
        </ImageBackground>
    </View>
    )
}

const styles = StyleSheet.create({
    transformOriginView: {
      transformOrigin: 'top',
    },
  });

export default FinalScreen;