import 'react-native-reanimated';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, StyleSheet, Platform, View } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
import ResolveScreen from './screens/ResolveScreen';
import FinalScreen from './screens/FinalScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

// iOS doesn't honour `StatusBar.backgroundColor`, so we render a coloured
// View under the status bar to match the dark Android styling.
const APP_BAR_HEIGHT = 44;

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: '#000000',
    height: APP_BAR_HEIGHT,
  },
});

export default function App() {
  const [fontsLoaded] = useFonts({
    Acumin: require('./assets/fonts/AcuminVariableConcept.otf'),
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
        barStyle="default"
        showHideTransition="fade"
        hidden={false}
      />
      {Platform.OS === 'ios' && <View style={styles.appBar} />}
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="Resolve" component={ResolveScreen} />
        <Stack.Screen name="Final" component={FinalScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
