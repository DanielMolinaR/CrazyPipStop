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
    let penalizationButton = (
        <View className="w-[26%] h-[35%]">
        </View>
    );
    if (GameMode.hasPenalization) {
        let backgroundStyle = "bg-cps-yellow";
        let textStyle = ""

        if (isPenalized){
            backgroundStyle = "bg-cps-red"
            textStyle = "text-white"
        }

        penalizationButton = (
            <Pressable key={"penalization"} className="w-[24%] h-[32%] z-10"
            onPress={() => setIsPenalized(!isPenalized)}>
                <CpsButtonBig>
                    <View className={`w-full h-full ${backgroundStyle} rounded-md items-center justify-center`}>
                        <Text className={`text-4xl ${textStyle} font-black`}>
                            -5"
                        </Text>
                    </View>
                </CpsButtonBig>
            </Pressable>
        )
    }

    return penalizationButton
}


function getMainTimer(isPenalized) {
    let backgroundStyle = "bg-cps-brown";
    let textStyle = "text-cps-yellow"

    if (isPenalized) {
        backgroundStyle = "bg-cps-deep-red"
        textStyle = "text-cps-red"
    }

    return (
        <View className="w-2/4 h-[40%] -mt-5 z-0">
           <CpsButtonBig>
              <View className={`flex w-full h-full ${backgroundStyle} rounded-md`}>
                <Text className={`text-6xl ${textStyle} font-black`}>
                  {GameMode.secondsCounter}"
                </Text>
              </View>
          </CpsButtonBig>
        </View>
    )
}

function getPenalizedTime(isPenalized) {
    let penalizationTimeContainer = penalizationTimeContainer = (
        <View className="w-[26%] h-[35%]">
        </View>
    );

    if (isPenalized) {
        penalizationTimeContainer = (
            <View className="w-[26%] h-[28%] z-10 -mt-4">
                <CpsButtonBig>
                    <View className="w-full h-full bg-cps-brown rounded-md items-center justify-center">
                        <Text className="text-3xl font-black text-cps-yellow">
                            {GameMode.secondsCounter-5}"
                        </Text>
                    </View>
                </CpsButtonBig>
            </View>
        )
    } 

    return penalizationTimeContainer;
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
                    <View className="flex w-full h-[36%] items-center">
                        <Pressable key={"penalization"} className="w-2/4 h-[84%] z-10 -mt-4"
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