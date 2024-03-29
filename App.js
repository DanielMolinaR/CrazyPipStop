import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import ComponentsScreen from "./screens/ComponentsScreen"
import HomeScreen from "./screens/HomeScreen"
import GameScreen from "./screens/GameScreen"
import ResolveScreen from "./screens/ResolveScreen"
import FinalScreen from "./screens/FinalScreen"
import RankingScreen from "./screens/RankingScreen"

const Stack = createNativeStackNavigator();

export default function App() {

  // TODO: Lock screen orientation

  const [fontsLoaded] = useFonts({
    'Acumin': require('./assets/fonts/AcuminVariableConcept.otf'),
  });

  const onLayoutRootView = React.useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer onReady={onLayoutRootView}>
      <StatusBar 
        animated={true}
        backgroundColor="#000000"
        barStyle={'default'}
        showHideTransition={'fade'}
        hidden={false}
      />
    <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen key="Home" name='Home' component={HomeScreen}/>
      <Stack.Screen key="Game" name='Game' >{(props) => <GameScreen {...props}/>}</Stack.Screen>
      <Stack.Screen key="Resolve" name='Resolve' >{(props) => <ResolveScreen {...props}/>}</Stack.Screen>
      <Stack.Screen key="Final" name='Final' >{(props) => <FinalScreen {...props}/>}</Stack.Screen>
      <Stack.Screen key="Ranking" name='Ranking' >{(props) => <RankingScreen {...props}/>}</Stack.Screen>
      <Stack.Screen key="ComponentsScreen" name='ComponentsScreen' component={ComponentsScreen} />
    </Stack.Navigator>
  </NavigationContainer>
  );
}
