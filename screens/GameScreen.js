import * as React from 'react';
import { View, Image, ImageBackground, Pressable } from 'react-native';

import CpsButtonBig from '../components/CpsButtonBig';
import CpsButtonSmall from '../components/CpsButtonSmall';
import CpsRoundButton from '../components/CpsRoundButton';
import StyledText from '../components/StyledText';

import Logo from "../assets/images/cps-logo.png"
import Background from "../assets/images/red-background-75_9-16.png"
import Pattern from "../assets/images/gray-pattern.png"
import black_X from "../assets/images/black-x.png"
import white_X from "../assets/images/white-x.png"

let GameMode;

function getVictoryPoints() {
    var victoryPoints = [];
    let maxVictoriesPoints = GameMode.maxVictoryPoints;
    let actualVictoryPoints = GameMode.victoryPoints
    for (var i=0; i < maxVictoriesPoints; i++) {
        if (actualVictoryPoints <= i){
            var victoryPoint = (
                <View className="w-[13%] h-[75%]" key={i+1}>
                    <CpsRoundButton>
                        <View className="w-full h-full bg-cps-yellow rounded-full items-center justify-center">
                            <View className="-mt-1">
                                <StyledText fontSize={30} style="font-black" text={i+1} />
                            </View>
                        </View>
                    </CpsRoundButton>
                </View>
            )
        } else {
            var victoryPoint = (
                <View className="w-[13%] h-[75%]" key={i+1}>
                    <CpsRoundButton>
                        <View className="w-full h-full bg-cps-green rounded-full items-center">
                        <View className="-mt-1">
                                <StyledText fontSize={30} style="font-black text-white" text={i+1} />
                            </View>
                        </View>
                    </CpsRoundButton>
                </View>
            )
        }
        victoryPoints.push(victoryPoint);
    }
    return victoryPoints;
}

function getMistakePoints() {
    var mistakePoints = [];
    let maxLosePoints = GameMode.maxLosePoints;
    let actualLosingPoints = GameMode.losingPoints
    for (var i=0; i < maxLosePoints; i++) {
        if (actualLosingPoints <= i) {
            var mistakePoint = (
                <View className="w-[18%] h-[40%]">
                    <CpsButtonSmall>
                        <View className="w-full h-full bg-cps-yellow rounded-md items-center justify-center">
                            <Image className="w-full h-full" source={black_X} resizeMode="contain"/>
                        </View>
                    </CpsButtonSmall>
                </View>
            )
        } else {
            var mistakePoint = (
                <View className="w-[18%] h-[40%]">
                    <CpsButtonSmall>
                        <View className="w-full h-full bg-cps-red rounded-md items-center justify-center">
                            <Image className="w-full h-full" source={white_X} resizeMode="contain"/>
                        </View>
                    </CpsButtonSmall>
                </View>
            )
        }
        mistakePoints.push(mistakePoint);
    }
    return mistakePoints;
}

function getPenalizationButton(isPenalized, setIsPenalized, isPenalizationUsed) {
    let penalizationButton = (
        <View className="w-[26%]">
        </View>
    );
    if (GameMode.hasPenalization) {
        let backgroundStyle = "bg-cps-yellow";
        let textStyle = ""

        if (isPenalized){
            backgroundStyle = "bg-cps-red"
            textStyle = "text-white"
        }

        if (isPenalizationUsed) {
            penalizationButton = (
                <View className="w-[24%] z-10 opacity-25">
                    <CpsButtonBig>
                        <View className={`w-full h-full ${backgroundStyle} rounded-md justify-center`}>
                            <StyledText fontSize={40} style={`text-center ${textStyle} font-black`} text={'-5"'} />
                        </View>
                    </CpsButtonBig>
                </View>
            )
        } else {
            penalizationButton = (
                <Pressable key={"penalization"} className="w-[24%] z-10"
                onPress={() => setIsPenalized(!isPenalized)}>
                    <CpsButtonBig>
                        <View className={`w-full h-full ${backgroundStyle} rounded-md justify-center`}>
                            <StyledText fontSize={40} style={`text-center ${textStyle} font-black`} text={'-5"'} />
                        </View>
                    </CpsButtonBig>
                </Pressable>
            )
        }
    }

    return penalizationButton
}


function getMainTimer(isPenalized, isPenalizationUsed) {
    let backgroundStyle = "bg-cps-brown";
    let textStyle = "text-cps-yellow"

    if (isPenalized && !isPenalizationUsed) {
        backgroundStyle = "bg-cps-deep-red"
        textStyle = "text-cps-red"
    }

    return (
        <View className="w-2/4 -mt-5 z-0">
           <CpsButtonBig>
              <View className={`flex w-full h-full ${backgroundStyle} rounded-md items-center justify-center`}>
                <StyledText 
                    fontSize={60}
                    style={`${textStyle} font-black`} 
                    text={`${GameMode.secondsCounter}"`} 
                />
              </View>
          </CpsButtonBig>
        </View>
    )
}

function getPenalizedTime(isPenalized, isPenalizationUsed) {
    let penalizationTimeContainer = penalizationTimeContainer = (
        <View className="w-[26%]">
        </View>
    );

    if (isPenalized && !isPenalizationUsed) {
        penalizationTimeContainer = (
            <View className="w-[26%] z-10 -mt-4">
                <CpsButtonBig>
                    <View className="w-full h-full bg-cps-brown rounded-md items-center justify-center">
                        <StyledText 
                            fontSize={36}
                            style="font-black text-cps-yellow"
                            text={`${GameMode.secondsCounter - GameMode.penalizationTime}"`}
                        />
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

    const [isPenalizationUsed, setIsPenalizationUsed] = React.useState(false);

    let penalizationButton = getPenalizationButton(isPenalized, setIsPenalized, isPenalizationUsed);
    let mainTimer = getMainTimer(isPenalized, isPenalizationUsed);
    let penalizedTime = getPenalizedTime(isPenalized, isPenalizationUsed);

    React.useEffect(() => {
        penalizationButton = getPenalizationButton(isPenalized, setIsPenalized, isPenalizationUsed);
    }, [isPenalizationUsed])

    React.useEffect(() => {
        penalizationButton = getPenalizationButton(isPenalized, setIsPenalized);
        mainTimer = getMainTimer(isPenalized, isPenalizationUsed);
        penalizedTime = getPenalizedTime(isPenalized, isPenalizationUsed);
        GameMode.isPenalized = isPenalized
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
                <ImageBackground className="w-full h-full" source={Background}>
                </ImageBackground>
            </View>
            <View className="flex w-full h-full absolute">
                <View className="flex gap-y-1 w-full h-[73%]">
                    <View className="w-full h-1/6 items-center">
                        <Image className="w-5/6 h-5/6" source={Logo} resizeMode="contain"/>
                    </View>
                    <View className="flex w-full h-3/6">
                        <View className="w-full h-[35%] items-center justify-center">
                            {penalizationButton}
                        </View>
                        <View className="w-full h-[40%] items-center justify-center">
                            {mainTimer}
                        </View>
                        <View className="w-full h-[25%] items-center justify-center">
                            {penalizedTime}
                        </View>
                    </View>
                    <View className="flex w-full h-2/6 items-center">
                        <Pressable key={"penalization"} className="w-2/4 h-5/6 z-10"
                            onPress={() => navigation.navigate('Resolve', {gameMode: GameMode, setIsPenalizationUsed: setIsPenalizationUsed})}>
                            <CpsButtonBig>
                                <View className="w-full h-full bg-cps-green rounded-md justify-center">
                                    <StyledText fontSize={86} style="text-center font-black text-white" text={"GO"} />
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