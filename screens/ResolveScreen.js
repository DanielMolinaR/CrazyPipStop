import * as React from 'react';
import { View, Image, ImageBackground, Pressable } from 'react-native';

import CpsButtonBig from '../components/CpsButtonBig';
import CpsButtonSmall from '../components/CpsButtonSmall';
import CpsRoundButton from '../components/CpsRoundButton';
import StyledText from '../components/StyledText';

import Logo from "../assets/images/cps-logo.png"
import Background from "../assets/images/red-background-33_9-16.png"
import Pattern from "../assets/images/gray-pattern.png"
import black_X from "../assets/images/black-x.png"

let GameMode;
let SetIsPenalizationUsed 

function getVictoryPoints(MaxVictoriesPoints) {
    var victoryPoints = [];
    for (var i=0; i < MaxVictoriesPoints; i++) {
        var victoryPoint = (
            <View className="w-[52px] h-[52px]" key={i+1}>
                <CpsRoundButton>
                    <View className="w-full h-full bg-cps-yellow rounded-full items-center">
                        <StyledText style="text-3xl font-black" text={i+1} />
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
                        <Image className="w-full h-full" source={black_X} resizeMode="contain"/>
                    </View>
                </CpsButtonSmall>
            </View>
        )
        mistakePoints.push(mistakePoint);
    }
    return mistakePoints;
}

function addResult(userWon, navigation) {
    if (GameMode.isPenalized){
        GameMode.isPenalized = false
        SetIsPenalizationUsed(true)
    }

    if (userWon) {
        GameMode.victoryPoints += 1
    } else {
        GameMode.losingPoints += 1
    }
    // TODO: Check how the gamemode state can be updated without this navigatorç
    // currently works but it doesn't while using back navigation arrow
    navigation.navigate('Game', {gameMode: GameMode})
}

function askForResult(navigation) {
    // TODO: Add question if the user has won

    addResult(false, navigation)
}

export default function ResolveScreen({ route, navigation }){

    GameMode = route.params.gameMode;

    SetIsPenalizationUsed = route.params.setIsPenalizationUsed;

    let victoryPoints = getVictoryPoints(GameMode.maxVictoryPoints);
    let mistakePoints = getMistakePoints(GameMode.maxLosePoints);

    var wrap;
    if (GameMode.maxLosePoints < 5) {
        wrap = "";
    } else {
        wrap = "flex-wrap";
    }

    let time = GameMode.secondsCounter;

    if (GameMode.isPenalized) {
        time = (GameMode.secondsCounter - GameMode.penalizationTime)
    }

    let [timer, setTimer] = React.useState(time);

    React.useEffect(() => {
        const counter = setTimeout(async function() {
          function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
          }

          if(time == timer){
            await sleep(5000)
          }

          if (timer > 0) {
            setTimer(timer - 1);
          }
        }, 1000)
      return () => { // this should work flawlessly besides some milliseconds lost here and there 
        clearTimeout(counter)
      }
    }, [timer]);

    return (
    <View className="w-full h-full max-h-screen">
        <ImageBackground className="w-full h-full relative" source={Pattern} resizeMode="stretch">
            <View className="w-full h-1/3 flex justify-end items-center">
                <ImageBackground className="w-full h-full" source={Background} />
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
                                    <StyledText style="text-4xl text-cps-yellow font-black" text={`${time}"`} />
                                </View>
                            </CpsButtonBig>
                        </View>
                    </View>
                    <View className="flex w-full h-[55%] items-center">
                       <View className="w-3/4 h-[50%] z-0">
                            <CpsButtonBig>
                                <View className="w-full h-full bg-cps-brown rounded-md items-center justify-end">
                                    <StyledText style="text-8xl text-cps-yellow font-black" text={`${timer}"`} />
                                </View>
                            </CpsButtonBig>
                        </View>
                        <View className="flex w-full h-[50%] items-center -mt-4 z-10">
                            <Pressable key={"penalization"} className="w-2/4 h-[90%] z-10"
                              onPress={() => askForResult(navigation)}>
                                <CpsButtonBig>
                                    <View className="w-full h-full bg-cps-yellow rounded-md items-center justify-center">
                                        <StyledText style="text-5xl font-black" text="STOP" />
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