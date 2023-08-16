import * as React from 'react';
import { Text } from 'react-native';

// Fonts
import { useFonts } from "expo-font"
import AppLoading from "expo-app-loading"

export default function StyledText(title){
    let [fontLoaded] = useFonts({
        "Acumin": require("./../assets/fonts/AcuminVariableConcept.otf")
    })

    if (!fontLoaded) {
        return <AppLoading />
    }

    return (
      <Text className="font-[Acumin]">
        {title}
      </Text>
    )
}