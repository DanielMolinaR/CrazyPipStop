import 'react-native-reanimated';
import './global.css';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, StyleSheet, Platform, View, ImageBackground } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Asset } from 'expo-asset';
import { Image } from 'expo-image';
import { setAudioModeAsync } from 'expo-audio';

import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
import ResolveScreen from './screens/ResolveScreen';
import FinalScreen from './screens/FinalScreen';
import PhoneFrame from './components/PhoneFrame';
import type { RootStackParamList } from './types';

// Keep the native splash visible until we explicitly hide it. The intro
// overlay below takes over the moment React paints, so the visible splash
// window is bounded by JS bridge boot time (typically ~1 second on a
// modern device).
SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignored — preventAutoHideAsync rejects only if the splash already
  // auto-hid before we got here, which we can't do anything about.
});

const Stack = createNativeStackNavigator<RootStackParamList>();

// Minimum on-screen time for the animated intro. The GIF loops, so we use
// this floor to ensure the player sees at least one full pass even if
// every async dep (fonts, asset cache) resolves instantly.
const MIN_INTRO_MS = 3000;

// iOS doesn't honour `StatusBar.backgroundColor`, so we render a coloured
// View under the status bar to match the dark Android styling.
const APP_BAR_HEIGHT = 44;

const introGif = require('./assets/images/intro.gif');
const introBackground = require('./assets/images/gray-pattern.png');
const introLogo = require('./assets/images/cps-logo.png');

// All image assets used by any in-app screen. Decoded into the asset cache
// during the intro so the first navigation doesn't stall on a cold image
// load. Audio is intentionally not preloaded here — the per-screen
// useAudioPlayer hook (expo-audio) handles allocation and disposal
// itself, and CountDown's 5.2 s lead-in masks any first-play latency.
const imageAssetsToPreload = [
  require('./assets/images/cps-logo.png'),
  require('./assets/images/gray-pattern.png'),
  require('./assets/images/red-background-9-16.png'),
  require('./assets/images/red-background-75_9-16.png'),
  require('./assets/images/red-background-33_9-16.png'),
  require('./assets/images/black-x.png'),
  require('./assets/images/white-x.png'),
  require('./assets/images/screw.png'),
  require('./assets/images/tick-small-white-border.png'),
  require('./assets/images/x-small-white-border.png'),
];

const styles = StyleSheet.create({
  root: { flex: 1 },
  appBar: {
    backgroundColor: '#000000',
    height: APP_BAR_HEIGHT,
  },
  introOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
    zIndex: 100,
    elevation: 100,
  },
  introContent: {
    flex: 1,
    width: '100%',
  },
  introLogoSlot: {
    width: '100%',
    height: '25%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  introLogo: {
    width: '83%',
    height: '83%',
  },
  introGifSlot: {
    width: '100%',
    height: '75%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  introGif: {
    width: '100%',
    height: '100%',
  },
});

export default function App() {
  const [fontsLoaded] = useFonts({
    Acumin: require('./assets/fonts/AcuminVariableConcept.otf'),
  });
  const [assetsLoaded, setAssetsLoaded] = React.useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = React.useState(false);

  // Minimum-display timer for the intro overlay. Even if everything else
  // is ready instantly, the GIF gets at least MIN_INTRO_MS on screen.
  React.useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), MIN_INTRO_MS);
    return () => clearTimeout(timer);
  }, []);

  // Preload image assets in parallel with the intro playing. Failures are
  // non-fatal — the per-screen imports will retry on demand if a cache
  // miss matters.
  React.useEffect(() => {
    (async () => {
      try {
        await Asset.loadAsync(imageAssetsToPreload);
      } catch {
        // ignore — proceed even if some assets failed to preload
      } finally {
        setAssetsLoaded(true);
      }
    })();
  }, []);

  // Hide the native OS splash as soon as React has mounted. The intro
  // overlay is already in the rendered tree at this point, so the visible
  // transition is splash -> GIF overlay with no blank flash.
  React.useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  // Configure the audio session once at boot so playback survives the iOS
  // hardware silent switch / iPad mute slider. expo-audio defaults to
  // respecting silent mode, which appears to have broken playback on the
  // iPad. Non-fatal on failure — worst case, audio still respects silent
  // mode (status quo).
  React.useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, []);

  const introComplete = fontsLoaded && assetsLoaded && minTimeElapsed;

  return (
    <View style={styles.root}>
      <NavigationContainer>
        <StatusBar
          animated={true}
          backgroundColor="#000000"
          barStyle="default"
          showHideTransition="fade"
          hidden={introComplete}
        />
        {Platform.OS === 'ios' && <View style={styles.appBar} />}
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Game" component={GameScreen} />
          <Stack.Screen name="Resolve" component={ResolveScreen} />
          <Stack.Screen name="Final" component={FinalScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      {!introComplete && (
        <View style={styles.introOverlay}>
          <PhoneFrame>
            <ImageBackground
              source={introBackground}
              style={styles.introContent}
              resizeMode="stretch"
            >
              <View style={styles.introLogoSlot}>
                <Image source={introLogo} style={styles.introLogo} contentFit="contain" />
              </View>
              <View style={styles.introGifSlot}>
                <Image source={introGif} style={styles.introGif} contentFit="contain" />
              </View>
            </ImageBackground>
          </PhoneFrame>
        </View>
      )}
    </View>
  );
}
