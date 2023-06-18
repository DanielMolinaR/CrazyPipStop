import * as React from 'react';
import { View } from 'react-native';

export default function CpsRoundButton(props){
    return (
        <View className="w-full h-full bg-white border-[1px] border-cps-gray rounded-full" >
        <View className="w-full h-full bg-cps-gray border-[2px] border-white rounded-full">
          <View className="w-full h-full border-[5px] border-cps-gray rounded-full">
            {props.children}
          </View>
        </View>
      </View>
    )
}