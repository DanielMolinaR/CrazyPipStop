import * as React from 'react';
import { Text, View, Image, ImageBackground, Pressable } from 'react-native';
import CpsButtonBig from '../components/CpsButtonBig';
import CpsButtonSmall from '../components/CpsButtonSmall';
import CpsRoundButton from '../components/CpsRoundButton';

import Logo from "../assets/cps-logo.png"
import Background from "../assets/red-background-33_9-16.png"
import Pattern from "../assets/gray-pattern.png"

function getVictoryPoints(MaxVictoriesPoints) {
    var victoryPoints = [];
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
        victoryPoints.push(victoryPoint);
    }
    return victoryPoints;
}

function getMistakePoints(MaxMistakesPoints) {
    var mistakePoints = [];
    for (var i=0; i < MaxMistakesPoints; i++) {
        var mistakePoint = (
            <View className="w-[18%] h-[40%]">
                <CpsButtonSmall>
                    <View className="w-full h-full bg-cps-yellow rounded-md items-center justify-center">
                        <Text className="text-2xl font-black">
                            X
                        </Text>
                    </View>
                </CpsButtonSmall>
            </View>
        )
        mistakePoints.push(mistakePoint);
    }
    return mistakePoints;
}

export default function ResolveScreen({ route }){

    let gameMode = route.params.gameMode;

    let victoryPoints = getVictoryPoints(gameMode.maxVictoryPoints);
    let mistakePoints = getMistakePoints(gameMode.maxLosePoints);

    let [timer, setTimer] = React.useState(gameMode.secondsCounter);

    var wrap;
    if (gameMode.maxLosePoints < 5) {
        wrap = "";
    } else {
        wrap = "flex-wrap";
    }

    return (
    <View className="w-full h-full max-h-screen">
        <ImageBackground className="w-full h-full relative" source={Pattern} resizeMode="stretch">
            <View className="w-full h-1/3 bg-yellow-500 flex justify-end items-center">
                <ImageBackground className="w-full h-full absolute bottom-0" source={Background} resizeMode='stretch' resizeMethod='auto' />
            </View>
            <View className="w-full h-full absolute">
                <View className="w-full h-[73%]">
                    <View className="w-full h-[15%] items-center">
                        <Image className="w-5/6 h-5/6" source={Logo} resizeMode="contain"/>
                    </View>
                    <View className="flex w-full h-[30%] items-center justify-center">
                        <View className="w-2/4 h-[65%] -mt-4">
                            <CpsButtonBig>
                                <View className="w-full h-full bg-cps-brown rounded-md items-center justify-center">
                                    <Text className="text-4xl text-cps-yellow font-black">
                                        {gameMode.secondsCounter}"
                                    </Text>
                                </View>
                            </CpsButtonBig>
                        </View>
                    </View>
                    <View className="flex w-full h-[55%] items-center">
                       <View className="w-3/4 h-[50%] z-0">
                            <CpsButtonBig>
                                <View className="w-full h-full bg-cps-brown rounded-md items-center justify-end">
                                    <Text className="text-8xl text-cps-yellow font-black">
                                        {timer}"
                                    </Text>
                                </View>
                            </CpsButtonBig>
                        </View>
                        <View className="flex w-full h-[50%] items-center -mt-4 z-10">
                            <Pressable key={"penalization"} className="w-2/4 h-[90%] z-10"
                              onPress={() => navigation.navigate('Resolve', {gameMode: GameMode})}>
                                <CpsButtonBig>
                                    <View className="w-full h-full bg-cps-yellow rounded-md items-center justify-center">
                                        <Text className="text-5xl font-black">
                                            STOP
                                        </Text>
                                    </View>
                                </CpsButtonBig>
                            </Pressable>
                        </View>
                    </View>
                </View>
                <View className="h-[27%] flex items-center justify-center">
                    <View className="w-full basis-1/3 h-full flex flex-row gap-x-3 items-center justify-center">
                        {victoryPoints}
                    </View>
                    <View className={`flex-1 w-5/6 flex flex-row gap-2 items-center justify-center ${wrap}`}>
                        {mistakePoints}
                    </View>
                </View>
            </View>
        </ImageBackground>
    </View>
    )
}