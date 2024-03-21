import * as React from 'react';
import { View, ImageBackground } from 'react-native';

// Components
import CpsButtonBig from '../components/CpsButtonBig';
import StyledText from '../components/StyledText';

import Pattern from "../assets/images/gray-pattern.png"

const FinalScreen = ({ route, navigation }) => {

        return (
    <View className="w-full h-full max-h-screen">
        <ImageBackground className="w-full h-full relative" source={Pattern} resizeMode="stretch">
 
        </ImageBackground>
    </View>
    )
}

export default FinalScreen;