import * as React from 'react';
import { View } from 'react-native';

export default function CpsButtonBig(props){
    return (
      <View className="w-full h-full bg-white border-4 border-cps-gray rounded-xl" >
        <View className="w-full h-full bg-cps-gray border-[5px] border-white rounded-xl">
          <View className="w-full h-full border-[8px] border-cps-gray rounded-lg">
            {props.children}
          </View>
        </View>
      </View>
    )
}