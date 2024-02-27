import * as React from 'react';
import { View, ImageBackground, Image, Animated, Easing, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

// Components
import CpsButtonBig from '../components/CpsButtonBig';
import StyledText from '../components/StyledText';
import CustomConfettiCannon from '../components/ConfettiCannon';

import Pattern from "../assets/images/gray-pattern.png"
import Screw from "../assets/images/screw.png"

const FinalScreen = ({ route, navigation }) => {

    const styles = StyleSheet.create({
        transformOriginView: {
          transformOrigin: 'left',
        },
      });

    UserHasWon = route.params.userHasWon;

    const [showConfetti, setShowConfetti] = React.useState(UserHasWon);

    React.useEffect(() => {
      setTimeout(() => {
        setShowConfetti(false);
        UserHasWon = false
      }, 4500);
    }, [showConfetti]);

    const isFocused = useIsFocused();

    /*React.useEffect(() => {
        setTimeout(() => {
          navigation.navigate('Home')
        }, 6200);
      }, [isFocused]);*/

    //if (!UserHasWon) {
        const rotateAnim = React.useRef(new Animated.Value(0)).current;

        React.useEffect(() => {
            Animated.timing(rotateAnim, {
              delay: 1000,
              toValue: 1,
              duration: 5000,
              easing: Easing.bounce,
              useNativeDriver: true,
            }).start();
        }, [rotateAnim]);
      
        const spin = rotateAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '90deg'],
        });
    //}

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
                    ]}
                    className="w-[78%] justify-center">
                    <CpsButtonBig >
                        <View className="w-full bg-cps-yellow">
                            <View className="w-full basis-[15%] flex-row gap-x-1 items-center justify-center">
                                <Image className="w-[10%] h-full" source={Screw} resizeMode="contain"/>
                                {UserHasWon ? (
                                    <View className="bg-cps-orange rounded-md mt-2">
                                        <StyledText style="text-5xl text-cps-green text-center font-black" text="¡¡HABEIS GANADO!!" />
                                    </View>
                                ) : (
                                    <View className="bg-cps-yellow rounded-md mt-2">
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