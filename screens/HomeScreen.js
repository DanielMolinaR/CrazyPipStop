import * as React from 'react';
import { View, Image, ImageBackground, Pressable } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';

var _ = require('lodash');

// Components
import CpsButtonBig from '../components/CpsButtonBig';
import CpsButtonSmall from '../components/CpsButtonSmall';
import StyledText from '../components/StyledText';

// Images
import Logo from "../assets/images/cps-logo.png"
import Background from "../assets/images/red-background-9-16.png"
import Pattern from "../assets/images/gray-pattern.png"

const track15N = require('../assets/music/countdowns/PIT_15.wav')
const track15CT = require('../assets/music/countdowns/PIT_15_CT.wav')
const track20N = require('../assets/music/countdowns/PIT_20.wav')
const track20CT = require('../assets/music/countdowns/PIT_20_CT.wav')
const track25N = require('../assets/music/countdowns/PIT_25.wav')
const track25CT = require('../assets/music/countdowns/PIT_25_CT.wav')
const track30N = require('../assets/music/countdowns/PIT_30.wav')
const track30B = require('../assets/music/countdowns/PIT_30_B.wav')
const track30CT = require('../assets/music/countdowns/PIT_30_CT.wav')
const track40N = require('../assets/music/countdowns/PIT_40.wav')
const track40CT = require('../assets/music/countdowns/PIT_40_CT.wav')

const ovation = require('../assets/music/victory/OVATION.mp3')
const victoryPro = require('../assets/music/victory/FINAL_PRO.mp3')
const brokenCar = require('../assets/music/defeat/BROKEN_CAR.mp3')
const defeat = require('../assets/music/defeat/DEFEAT.wav')

const trainingMode = {
    name: "TRAINING",
    fontSize: 30,
    screen: "Game",
    secondsCounter: 40,
    audios: [track40N, track40CT],
    victoryAudios: [ovation],
    defeatAudios: [defeat, brokenCar],
    victoryPoints: 0,
    maxVictoryPoints: 5,
    losingPoints: 0,
    maxLosePoints: 6,
    hasPenalization: false,
};
  
const amateurMode = {
    name: "AMATEUR",
    fontSize: 30,
    screen: "Game",
    secondsCounter: 30,
    audios: [track30N, track30B, track30CT],
    victoryAudios: [ovation],
    defeatAudios: [defeat, brokenCar],
    victoryPoints: 0,
    maxVictoryPoints: 5,
    losingPoints: 0,
    maxLosePoints: 4,
    penalizationTime: 5,
    hasPenalization: true,
    penalizedAudios: [track25N, track25CT]
};
  
const advancedMode = {
    name: "ADVANCED",
    fontSize: 30,
    screen: "Game",
    secondsCounter: 25,
    audios: [track25N, track25CT],
    victoryAudios: [ovation],
    defeatAudios: [defeat, brokenCar],
    victoryPoints: 0,
    maxVictoryPoints: 5,
    losingPoints: 0,
    maxLosePoints: 4,
    hasPenalization: true,
    isPenalized: false,
    penalizationTime: 5,
    penalizedAudios: [track20N, track20CT]
};
  
const proMode = {
    name: "PRO",
    fontSize: 30,
    screen: "Game",
    secondsCounter: 15,
    audios: [track15N, track15CT],
    victoryAudios: [victoryPro],
    defeatAudios: [defeat, brokenCar],
    victoryPoints: 0,
    maxVictoryPoints: 5,
    losingPoints: 0,
    maxLosePoints: 3,
    hasPenalization: false,
    isPenalized: false,
    penalizationTime: 5,
};
  
const fastAndFurious = {
    name: "Fast & Furious",
    fontSize: 24,
    screen: "Game",
    secondsCounter: 180,
    audios: [track15N, track15CT],
    victoryAudios: [victoryPro],
    defeatAudios: [defeat, brokenCar],
    victoryPoints: 0,
    maxVictoryPoints: 5,
    losingPoints: 0,
    maxLosePoints: 3,
    hasPenalization: false,
    isPenalized: false,
    penalizationTime: 5,
};


export default function HomeScreen({ navigation }){

    let gameModes = [
        trainingMode, 
        amateurMode, 
        advancedMode, 
        proMode,
        fastAndFurious
    ]

    return (
    <View className="w-full h-full max-h-max bg-gray-pattern">
        <ImageBackground className="w-full h-full" source={Pattern} resizeMode="resize">
            <ImageBackground className="w-full h-full" source={Background} resizeMode="resize">
                <View className="w-full h-[25%] items-center">
                    <Image className="w-5/6 h-5/6" source={Logo} resizeMode="contain"/>
                </View>
                <View className="w-full h-[75%]">
                    <View className="w-full h-[87%] grid grid-cols-1 gap-y-4 items-center">
                        {gameModes.map((gameMode, index) => 
                            <Pressable key={gameMode.name} className="w-2/3 h-[16%]"
                            onPress={() => navigation.navigate(gameMode.screen, {gameMode: _.cloneDeep(gameMode)})}>
                                <CpsButtonBig>
                                    <View className="w-full h-full bg-cps-yellow rounded-md items-center justify-center">
                                        <StyledText fontSize={gameMode.fontSize} style="font-black" text={gameMode.name.toUpperCase()} />
                                    </View>
                                </CpsButtonBig>
                            </Pressable>
                        )}    
                    </View>
                    <View className="w-full h-[13%] items-end">
                        <Pressable key="ThrophyButton" className="w-1/6 h-[80%] mr-6"
                        onPress={() => navigation.navigate('Ranking')}>
                            <CpsButtonSmall>
                                <View className="w-full h-full bg-cps-yellow rounded-md items-center justify-center">
                                    <Ionicons name="trophy-outline" size={24} color="black" />
                                </View>
                            </CpsButtonSmall>
                        </Pressable>
                    </View>
                </View>
            </ImageBackground>
        </ImageBackground>
    </View>
    )
}