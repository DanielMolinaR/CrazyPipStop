import * as React from 'react';
import { Text, View, Image, ImageBackground, Pressable } from 'react-native';
import CpsButtonBig from '../components/CpsButtonBig';

import Logo from "../assets/cps-logo.png"
import Background from "../assets/red-background.png"
import Pattern from "../assets/gray-pattern.png"

var familyMode = {
    name: "FAMILY",
    secondsCounter: 40,
    audiosPath: ["PIT_40_MASTER.mp3"],
    maxVictoryPoints: 5,
    maxLosePoints: 6,
    hasPenalization: false,
}
  
var normalMode = {
    name: "NORMAL",
    secondsCounter: 30,
    audiosPath: ["PIT_30_MASTER.mp3"],
    maxVictoryPoints: 5,
    maxLosePoints: 4,
    hasPenalization: false
}
  
var avanzadoMode = {
    name: "AVANZADO",
    secondsCounter: 25,
    audiosPath: ["PIT_25_MASTER.mp3"],
    maxVictoryPoints: 5,
    maxLosePoints: 4,
    hasPenalization: true,
    penalizationTime: 5,
    penalizedAudiosPath: ["PIT_20_MASTER.mp3"]
}
  
var proMode = {
    name: "PRO",
    secondsCounter: 20,
    audioPath: ["PIT_20_MASTER.mp3"],
    maxVictoryPoints: 5,
    maxLosePoints: 3,
    hasPenalization: true,
    penalizationTime: 5,
    penalizedAudiosPath: []
}
  
const gameModes = [familyMode, normalMode, avanzadoMode, proMode]


export default function HomeScreen({ navigation }){
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
                      onPress={() => navigation.navigate('Game', {gameMode: gameMode})}>
                        <CpsButtonBig>
                            <View className="w-full h-full bg-cps-yellow rounded-md items-center justify-center">
                                <Text className="text-2xl">
                                    {gameMode.name.toUpperCase()}
                                </Text>
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