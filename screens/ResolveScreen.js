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
import white_X from "../assets/images/white-x.png"

import red_X from "../assets/images/x-small-white-border.png"
import green_tick from "../assets/images/tick-small-white-border.png"

let GameMode;
let SetIsPenalizationUsed 

function getVictoryPoints() {
    var victoryPoints = [];
    let maxVictoriesPoints = GameMode.maxVictoryPoints;
    let actualVictoryPoints = GameMode.victoryPoints
    for (var i=0; i < maxVictoriesPoints; i++) {
        if (actualVictoryPoints <= i){
            var victoryPoint = (
                <View className="w-[52px] h-[52px]" key={i+1}>
                    <CpsRoundButton>
                        <View className="w-full h-full bg-cps-yellow rounded-full items-center">
                            <StyledText style="text-3xl font-black" text={i+1} />
                        </View>
                    </CpsRoundButton>
                </View>
            )
        } else {
            var victoryPoint = (
                <View className="w-[52px] h-[52px]" key={i+1}>
                    <CpsRoundButton>
                        <View className="w-full h-full bg-cps-green rounded-full items-center">
                            <StyledText style="text-3xl font-black text-white" text={i+1} />
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
        if (actualLosingPoints < i) {
            var mistakePoint = (
                <View className="w-[18%] h-[40%]">
                    <CpsButtonSmall>
                        <View className="w-full h-full bg-cps-yellow rounded-md items-center justify-center">
                            <Image className="w-full h-full" source={black_X} resizeMode="contain"/>
                        </View>
                    </CpsButtonSmall>
                </View>
            )
        } else if (actualLosingPoints == i ){
            var mistakePoint = (
                <View className="w-[18%] h-[40%]">
                    <CpsButtonSmall>
                        <View className="w-full h-full bg-cps-orange rounded-md items-center justify-center">
                            <Image className="w-full h-full" source={white_X} resizeMode="contain"/>
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

    if (GameMode.victoryPoints >= GameMode.maxVictoryPoints) {
        console.log('Has ganado')
        navigation.navigate('Home')
    }

    if (GameMode.losingPoints >= GameMode.maxLosePoints) {
        console.log('Has perdido')
        navigation.navigate('Home')
    }
    // TODO: Check how the gamemode state can be updated without this navigatorç
    // currently works but it doesn't while using back navigation arrow
    navigation.navigate('Game', {gameMode: GameMode})
}

export default function ResolveScreen({ route, navigation }){

    GameMode = route.params.gameMode;

    SetIsPenalizationUsed = route.params.setIsPenalizationUsed;

    let victoryPoints = getVictoryPoints();
    let mistakePoints = getMistakePoints();

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

    const [showAppOptions, setShowAppOptions] = React.useState(false); 

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
          } else {
            setShowAppOptions(true);
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
                              onPress={() => setShowAppOptions(true)}>
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
            {showAppOptions ? (
                <View className="w-full h-full absolute z-20">
                    <View className="w-full h-full bg-cps-gray opacity-75"></View>
                    <View className="w-full h-full absolute">
                        <View className="w-full h-1/2 items-center justify-center">
                            <View className="w-3/4 h-1/2">
                                <CpsButtonBig>
                                    <View className="w-full h-full bg-cps-yellow rounded-md items-center justify-center">
                                        <StyledText style="text-5xl text-center font-black" text="¿HABEIS GANADO?" />
                                    </View>
                                </CpsButtonBig>
                            </View>
                        </View>
                        <View className="w-full h-1/2 items-center justify-center flex flex-row">
                            <View className="w-2/5 h-full items-start">
                                <Pressable key={"penalization"} className="w-4/5 h-1/3"
                                    onPress={() => addResult(false, navigation)}>
                                        <View className="h-full rounded-md items-center justify-center">
                                            <Image className="w-5/6" source={red_X} resizeMode="contain"/>
                                        </View>
                                </Pressable>
                            </View>
                            <View className="w-2/5 h-full items-end">
                                <Pressable key={"penalization"} className="w-4/5 h-1/3"
                                    onPress={() => addResult(true, navigation)}>
                                        <View className="h-full rounded-md items-center justify-center">
                                            <Image className="w-5/6" source={green_tick} resizeMode="contain"/>
                                        </View>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>
            ) : (
                <View />
            )}
        </ImageBackground>
    </View>
    )
}