import * as React from 'react';
import { Text, View, Image, ImageBackground, Pressable } from 'react-native';
import CpsButtonBig from '../components/CpsButtonBig';
import CpsButtonSmall from '../components/CpsButtonSmall';
import CpsRoundButton from '../components/CpsRoundButton';

import Logo from "../assets/cps-logo.png"
import Background from "../assets/red-background.png"
import Pattern from "../assets/gray-pattern.png"

function getVictoryPoints(MaxVictoriesPoints) {
    var victoryPoints = []
    for (var i=0; i < MaxVictoriesPoints; i++) {
        var victoryPoint = (
            <View className="w-[52px] h-[52px]" key={i+1}>
                <CpsRoundButton>
                    <View className="w-full h-full bg-cps-yellow rounded-full items-center">
                        <Text className="text-3xl font-black">
                            {i+1}
                        </Text>
                    </View>
                </CpsRoundButton>
            </View>
        )
        victoryPoints.push(victoryPoint)
    }
    return victoryPoints
}

function getMistakePoints(MaxMistakesPoints) {
    var mistakePoints = []
    for (var i=0; i < MaxMistakesPoints; i++) {
        var mistakePoint = (
            <View className="w-1/5 h-[40%]">
                <CpsButtonSmall>
                    <View className="w-full h-full bg-cps-yellow rounded-md items-center justify-center">
                        <Text className="text-2xl font-black">
                            X
                        </Text>
                    </View>
                </CpsButtonSmall>
            </View>
        )
        mistakePoints.push(mistakePoint)
    }
    return mistakePoints
}

function getPenalizationButton(hasPenalization) {
    let penalizationButton = []
    if (hasPenalization) {
        penalizationButton = (
            <Pressable key={"penalization"} className="w-[26%] h-[35%] z-10"
            onPress={() => console.log(hasPenalization)}>
                <CpsButtonBig>
                    <View className="w-full h-full bg-cps-yellow rounded-md items-center justify-center">
                        <Text className="text-4xl font-black">
                            -5"
                        </Text>
                    </View>
                </CpsButtonBig>
            </Pressable>
        )
    } else {
        penalizationButton = (
            <View className="w-[26%] h-[35%]">
            </View>
        )
    }
    return penalizationButton
}

export default function GameScreen({ route, navigation }){

    let gameMode = route.params.gameMode;

    let victoryPoints = getVictoryPoints(gameMode.maxVictoryPoints)
    let mistakePoints = getMistakePoints(gameMode.maxLosePoints)
    let penalizationButton = getPenalizationButton(gameMode.hasPenalization)

    var wrap
    if (gameMode.maxLosePoints < 5) {
        wrap = ""
    } else {
        wrap = "flex-wrap"
    }

    return (
    <View className="w-full h-full flex flex-wrap max-h-max bg-gray-pattern">
        <View className="w-full h-[70%] bg-red-500">
            <View className="w-full h-1/6 items-center">
                <Image className="w-5/6 h-5/6" source={Logo} resizeMode="contain"/>
            </View>
            <View className="flex w-full h-3/6 items-center">
                {penalizationButton}
                <View className="w-2/4 h-[33%] -mt-6 z-0">
                    <CpsButtonBig>
                        <View className="w-full h-full bg-cps-brown rounded-md items-center justify-center">
                            <Text className="text-4xl text-cps-yellow font-black">
                                {gameMode.secondsCounter}"
                            </Text>
                        </View>
                    </CpsButtonBig>
                </View>
            </View>
            <View className="flex w-full h-[30%] items-center">
                <Pressable key={"penalization"} className="w-2/4 h-[90%] z-10"
                    onPress={() => console.log(gameMode.hasPenalization)}>
                    <CpsButtonBig>
                        <View className="w-full h-full bg-cps-green rounded-md items-center justify-center">
                            <Text className="text-7xl font-black text-white">
                                GO
                            </Text>
                        </View>
                    </CpsButtonBig>
                </Pressable>
            </View>
        </View>
        <View className="h-[30%] bg-cps-gray flex items-center justify-center">
            <View className="w-full basis-1/3 h-full flex flex-row gap-x-3 items-center justify-center">
                {victoryPoints}
            </View>
            <View className={`flex-1 w-5/6 flex flex-row gap-2 items-center justify-center ${wrap}`}>
                {mistakePoints}
            </View>
        </View>
    </View>
    )
}