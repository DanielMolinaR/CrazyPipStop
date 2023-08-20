import * as React from 'react';
import { Text, View, Image, ImageBackground, Pressable } from 'react-native';

var _ = require('lodash');

// Components
import CpsButtonBig from '../components/CpsButtonBig';
import StyledText from '../components/StyledText';

// Images
import Logo from "../assets/images/cps-logo.png"
import Background from "../assets/images/red-background-9-16.png"
import Pattern from "../assets/images/gray-pattern.png"

const familyMode = {
    name: "FAMILY",
    secondsCounter: 40,
    audiosPath: ["PIT_40_MASTER.mp3"],
    maxVictoryPoints: 5,
    maxLosePoints: 6,
    hasPenalization: false,
};
  
const normalMode = {
    name: "NORMAL",
    secondsCounter: 30,
    audiosPath: ["PIT_30_MASTER.mp3"],
    maxVictoryPoints: 5,
    maxLosePoints: 4,
    hasPenalization: false,
};
  
const advancedMode = {
    name: "AVANZADO",
    secondsCounter: 25,
    audiosPath: ["PIT_25_MASTER.mp3"],
    maxVictoryPoints: 5,
    maxLosePoints: 4,
    hasPenalization: true,
    isPenalized: false,
    penalizationTime: 5,
    penalizedAudiosPath: ["PIT_20_MASTER.mp3"]
};
  
const proMode = {
    name: "PRO",
    secondsCounter: 20,
    audioPath: ["PIT_20_MASTER.mp3"],
    maxVictoryPoints: 5,
    maxLosePoints: 3,
    hasPenalization: true,
    isPenalized: false,
    penalizationTime: 5,
    penalizedAudiosPath: []
};

export default function HomeScreen({ navigation }){
      
    let gameModes = [
        familyMode, 
        normalMode, 
        advancedMode, 
        proMode
    ]

    return (
    <View className="w-full h-full max-h-max bg-gray-pattern">
        <ImageBackground className="w-full h-full" source={Pattern} resizeMode="stretch">
            <ImageBackground className="w-full h-full" source={Background} resizeMode="stretch">
                <View className="w-full h-[30%] items-center">
                    <Image className="w-5/6 h-5/6" source={Logo} resizeMode="contain"/>
                </View>
                <View className="w-full h-full grid grid-cols-1 gap-y-4 items-center">
                    {gameModes.map((gameMode, index) => 
                        <Pressable key={gameMode.name} className="w-2/3 h-[12%]"
                        onPress={() => navigation.navigate('Game', {gameMode: _.cloneDeep(gameMode)})}>
                            <CpsButtonBig>
                                <View className="w-full h-full bg-cps-yellow rounded-md items-center justify-center">
                                    <StyledText style="text-3xl font-black" text={gameMode.name.toUpperCase()} />
                                </View>
                            </CpsButtonBig>
                        </Pressable>
                    )}    
                </View>
            </ImageBackground>
        </ImageBackground>
    </View>
    )
}