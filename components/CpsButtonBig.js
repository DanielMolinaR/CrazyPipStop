import * as React from 'react';
import { View } from 'react-native';

export default function CpsButtonBig(props){
    return (
      <View className="bg-white border-[3px] border-cps-gray rounded-xl" >
        <View className="bg-cps-gray border-[4px] border-white rounded-xl">
          <View className="border-[6px] border-cps-gray rounded-lg">
            {props.children}
          </View>
        </View>
      </View>
    )
}