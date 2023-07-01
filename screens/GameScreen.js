import * as React from 'react';
import { Text, View, Image, ImageBackground, Pressable } from 'react-native';
import CpsButtonBig from '../components/CpsButtonBig';
import CpsButtonSmall from '../components/CpsButtonSmall';
import CpsRoundButton from '../components/CpsRoundButton';

import Logo from "../assets/cps-logo.png"
import Background from "../assets/red-background-75_9-16.png"
import Pattern from "../assets/gray-pattern.png"

let GameMode;

function getVictoryPoints(MaxVictoriesPoints) {
    var victoryPoints = [];
    MaxVictoriesPoints = GameMode.maxVictoryPoints;
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

function getMistakePoints() {
    var mistakePoints = [];
    let MaxMistakesPoints = GameMode.maxLosePoints;
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

function getPenalizationButton(isPenalized, setIsPenalized) {
    let penalizationButton = [];
    if (GameMode.hasPenalization) {
        if (isPenalized){
            penalizationButton = (
                <Pressable key={"penalization"} className="w-[26%] h-[35%] z-10"
                onPress={() => setIsPenalized(!isPenalized)}>
                    <CpsButtonBig>
                        <View className="w-full h-full bg-cps-red rounded-md items-center justify-center">
                            <Text className="text-4xl text-white font-black">
                                -5"
                            </Text>
                        </View>
                    </CpsButtonBig>
                </Pressable>
            )
        } else {
            penalizationButton = (
                <Pressable key={"penalization"} className="w-[26%] h-[35%] z-10"
                onPress={() => setIsPenalized(!isPenalized)}>
                    <CpsButtonBig>
                        <View className="w-full h-full bg-cps-yellow rounded-md items-center justify-center">
                            <Text className="text-4xl font-black">
                                -5"
                            </Text>
                        </View>
                    </CpsButtonBig>
                </Pressable>
            )
        }
    } else {
        penalizationButton = (
            <View className="w-[26%] h-[35%]">
            </View>
        )
    }
    return penalizationButton
}

function getPenalizedTime(isPenalized) {
    let penalizationTimeContainer = [];
    if (isPenalized) {
        penalizationTimeContainer = (
            <View className="w-[26%] h-[35%] z-10 -mt-6">
                <CpsButtonBig>
                    <View className="w-full h-full bg-cps-brown rounded-md items-center justify-center">
                        <Text className="text-4xl font-black text-cps-yellow">
                            {GameMode.secondsCounter-5}"
                        </Text>
                    </View>
                </CpsButtonBig>
            </View>
        )
    } else {
        penalizationTimeContainer = (
            <View className="w-[26%] h-[35%]">
            </View>
        )
    }
    return penalizationTimeContainer
}


function getMainTimer(isPenalized) {
    let mainTimerContainer = [];
    if (isPenalized) {
        mainTimerContainer = (
            <View className="w-2/4 h-[33%] -mt-6 z-0">
               <CpsButtonBig>
                  <View className="w-full h-full bg-cps-brown rounded-md items-center justify-center">
                    <Text className="text-4xl text-cps-red font-black">
                      {GameMode.secondsCounter}"
                    </Text>
                  </View>
              </CpsButtonBig>
            </View>
        )
    } else {
        mainTimerContainer = (
            <View className="w-2/4 h-[33%] -mt-6 z-0">
              <CpsButtonBig>
                <View className="w-full h-full bg-cps-brown rounded-md items-center justify-center">
                  <Text className="text-4xl text-cps-yellow font-black">
                   {GameMode.secondsCounter}"
                  </Text>
                </View>
              </CpsButtonBig>
            </View>
        )
    }
    return mainTimerContainer
}

export default function GameScreen({ route, navigation }){

    GameMode = route.params.gameMode;

    let victoryPoints = getVictoryPoints();
    let mistakePoints = getMistakePoints();

    const [isPenalized, setIsPenalized] = React.useState(GameMode.isPenalized);

    let penalizationButton = getPenalizationButton(isPenalized, setIsPenalized);
    let mainTimer = getMainTimer(isPenalized);
    let penalizedTime = getPenalizedTime(isPenalized);

    React.useEffect(() => {
        penalizationButton = getPenalizationButton(isPenalized, setIsPenalized);
    }, [GameMode.hasPenalization])

    React.useEffect(() => {
        penalizationButton = getPenalizationButton(isPenalized, setIsPenalized);
        mainTimer = getMainTimer(isPenalized);
        penalizedTime = getPenalizedTime(isPenalized);
    }, [isPenalized])

    var wrap;
    if (GameMode.maxLosePoints < 5) {
        wrap = "";
    } else {
        wrap = "flex-wrap";
    }

    return (
    <View className="w-full h-full max-h-screen">
        <ImageBackground className="w-full h-full relative" source={Pattern} resizeMode="stretch">
            <View className="h-3/4">
                <ImageBackground className="w-full h-full" source={Background} resizeMode="stretch">
                </ImageBackground>
            </View>
            <View className="w-full h-full absolute">
                <View className="w-full h-[73%]">
                    <View className="w-full h-1/6 items-center">
                        <Image className="w-5/6 h-5/6" source={Logo} resizeMode="contain"/>
                    </View>
                    <View className="flex w-full h-3/6 items-center">
                        {penalizationButton}
                        {mainTimer}
                        {penalizedTime}
                    </View>
                    <View className="flex w-full h-[30%] items-center">
                        <Pressable key={"penalization"} className="w-2/4 h-[90%] z-10"
                            onPress={() => navigation.navigate('Resolve', {gameMode: GameMode})}>
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