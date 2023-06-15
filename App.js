import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import CpsButtonBig from './components/CpsButtonBig';
import CpsButtonSmall from './components/CpsButtonSmall';

export default function App() {
  return (
    <View className="w-full h-full bg-red-500">
      <View className="w-full h-full grid grid-cols-1 gap-y-4 justify-center items-center">
        <View className="w-2/3 h-24">
          <CpsButtonBig>
            <Text className="text-2xl">
              Test Big Button
            </Text>
          </CpsButtonBig>
        </View>
        <View className="w-1/2 h-16">
          <CpsButtonSmall>
          <Text className="text-xl">
              Test Small Button
            </Text>
          </CpsButtonSmall>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}
