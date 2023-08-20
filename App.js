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

const Stack = createNativeStackNavigator();

export default function App() {

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
      <Stack.Screen key="Home" name='Home' component={HomeScreen} options={{unmountOnBlur: true}} />
      <Stack.Screen key="Game" name='Game' >{(props) => <GameScreen {...props}/>}</Stack.Screen>
      <Stack.Screen key="Resolve" name='Resolve' >{(props) => <ResolveScreen {...props}/>}</Stack.Screen>
      <Stack.Screen key="ComponentsScreen" name='ComponentsScreen' component={ComponentsScreen} />
    </Stack.Navigator>
  </NavigationContainer>
  );
}
