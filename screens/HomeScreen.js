import * as React from 'react';
import { View, Image, ImageBackground, Pressable } from 'react-native';
import { Audio } from 'expo-av';

var _ = require('lodash');

// Components
import CpsButtonBig from '../components/CpsButtonBig';
import StyledText from '../components/StyledText';

// Images
import Logo from "../assets/images/cps-logo.png"
import Background from "../assets/images/red-background-9-16.png"
import Pattern from "../assets/images/gray-pattern.png"

const track40 = require('../assets/music/PIT_40_MASTER.mp3')
const track30 = require('../assets/music/PIT_30_MASTER.mp3')
const track25 = require('../assets/music/PIT_25_MASTER.mp3')
const track20 = require('../assets/music/PIT_20_MASTER.mp3')
const track15 = require('../assets/music/PIT_15_MASTER.mp3')

const familyMode = {
    name: "FAMILY",
    secondsCounter: 40,
    audios: [track40],
    victoryPoints: 0,
    maxVictoryPoints: 5,
    losingPoints: 0,
    maxLosePoints: 6,
    hasPenalization: false,
};
  
const normalMode = {
    name: "NORMAL",
    secondsCounter: 30,
    audios: [track30],
    victoryPoints: 0,
    maxVictoryPoints: 5,
    losingPoints: 0,
    maxLosePoints: 4,
    hasPenalization: false,
};
  
const advancedMode = {
    name: "AVANZADO",
    secondsCounter: 25,
    audios: [track25],
    victoryPoints: 0,
    maxVictoryPoints: 5,
    losingPoints: 0,
    maxLosePoints: 4,
    hasPenalization: true,
    isPenalized: false,
    penalizationTime: 5,
    penalizedAudios: [track20]
};
  
const proMode = {
    name: "PRO",
    secondsCounter: 20,
    audios: [track20],
    victoryPoints: 0,
    maxVictoryPoints: 5,
    losingPoints: 0,
    maxLosePoints: 3,
    hasPenalization: true,
    isPenalized: false,
    penalizationTime: 5,
    penalizedAudios: [track15]
};

export default function HomeScreen({ navigation }){

    async function loadAudios() {
        familyMode.audios[0] = await Audio.Sound.createAsync(audio40)
        normalMode.audios[0] = await Audio.Sound.createAsync(audio30)
        advancedMode.audios[0] = await Audio.Sound.createAsync(audio25)
        advancedMode.penalizedAudios[0] = await Audio.Sound.createAsync(audio20)
        proMode.audios[0] = await Audio.Sound.createAsync(audio20)
        proMode.penalizedAudios[0] = await Audio.Sound.createAsync(audio15)
    }

    // loadAudios()

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