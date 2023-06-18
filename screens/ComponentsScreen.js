import * as React from 'react';
import { Text, View } from 'react-native';
import CpsButtonBig from '../components/CpsButtonBig';
import CpsButtonSmall from '../components/CpsButtonSmall';
import CpsRoundButton from '../components/CpsRoundButton';

export default function ComponentsScreen(){
    return (
    <View className="w-full h-full max-h-max bg-red-500">
        <View className="w-full h-full grid grid-cols-1 gap-y-4 justify-center items-center">
            <View className="w-2/3 h-[10%]">
                <CpsButtonBig>
                <View className="w-full h-full bg-cps-yellow rounded-md items-center justify-center">
                    <Text className="text-2xl">
                    Test Big Button
                    </Text>
                </View>
                </CpsButtonBig>
            </View>
            <View className="w-1/2 h-16">
                <CpsButtonSmall>
                <View className="w-full h-full bg-cps-yellow rounded-md items-center justify-center">
                    <Text className="text-xl">
                    Test Small Button
                    </Text>
                </View>
                </CpsButtonSmall>
            </View>
            <View className="w-12 h-12">
                <CpsRoundButton>
                    <View className="w-full h-full bg-cps-yellow rounded-full items-center">
                        <Text className="text-3xl font-black">
                        1
                        </Text>
                    </View>
                </CpsRoundButton>
            </View>
            <View className="w-12 h-12">
                <CpsRoundButton>
                <View className="w-full h-full bg-cps-green rounded-full items-center">
                    <Text className="text-3xl font-black text-white">
                    1
                    </Text>
                </View>
                </CpsRoundButton>
            </View>
        </View>
    </View>
    )
}