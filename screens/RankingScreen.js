import * as React from 'react';
import { View, ImageBackground } from 'react-native';

// Components
import CpsButtonBig from '../components/CpsButtonBig';
import StyledText from '../components/StyledText';

import Pattern from "../assets/images/gray-pattern.png"

import scoreData from '../assets/score/score.json';

function createRanking() {
    var rankingComponents = []
    /*
    for  (let i = 0; i < scoreData.length; i++) {
        scoreData[i]

        var components = (
            <View className="w-full h-[87%] grid grid-cols-1 gap-y-4 items-center">
            {score.map((gameMode, index) => 
                <Pressable key={gameMode.name} className="w-2/3 h-[16%]"
                onPress={() => navigation.navigate(gameMode.screen, {gameMode: _.cloneDeep(gameMode)})}>
                    <CpsButtonBig>
                        <View className={`w-full h-full ${gameMode.background} rounded-md items-center justify-center`}>
                            <StyledText fontSize={gameMode.fontSize} style="font-black" text={gameMode.name.toUpperCase()} />
                        </View>
                    </CpsButtonBig>
                </Pressable>
            )}    
        </View>
        )

        rankingComponents.push(component)
    }*/
}

const FinalScreen = ({ route, navigation }) => {

    let scoreRanking = createRanking()

    return (
        <View className="w-full h-full max-h-screen">
            <ImageBackground className="w-full h-full justify-center" source={Pattern} resizeMode="stretch">
                <View className="w-full h-[95%] justify-center grid grid-cols-1 items-center">
                    {scoreData.ranking.map((score, index) => 
                        <View key={score.score} className="w-[90%] h-[30%] flex gap-y-2 justify-center items-center">
                            <View className="w-1/4 h-1/3">
                                <CpsButtonBig>
                                    <View className={`w-full h-full bg-cps-orange rounded-md items-center justify-center`}>
                                        <StyledText fontSize="26" style="font-black" text={index+1+"º"} />
                                    </View>
                                </CpsButtonBig>
                            </View>
                            <View className="w-2/3 h-2/5">
                                <CpsButtonBig className="w-2/3">
                                    <View className={`w-full h-full bg-cps-yellow rounded-md items-center justify-center`}>
                                        <StyledText fontSize="20" style="font-black" text={score.gameMode.toUpperCase() + " " + score.score + " pts"} />
                                    </View>
                                </CpsButtonBig>
                            </View>
                        </View>
                    )}    
                </View>
            </ImageBackground>
        </View>
    )
}

export default FinalScreen;