import * as React from 'react';
import { View, Text, Pressable } from 'react-native';

export default function CpsButtonBig(props){
    return (
      <View className="w-full h-full bg-white border-4 border-cps-gray rounded-2xl" >
        <View className="w-full h-full bg-cps-gray border-[7px] border-white rounded-xl">
          <View className="w-full h-full bg-cps-orange border-[10px] border-cps-gray rounded-xl items-center justify-center">
            {props.children}
          </View>
        </View>
      </View>
    )
}