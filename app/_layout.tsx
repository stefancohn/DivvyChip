import { Stack } from "expo-router";
import "./globals.css"
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { StyleSheet } from "react-native";
import { fonts } from '../backend/constants';
import { useFonts } from 'expo-font';
import { images } from "../backend/constants";
import { Image } from "react-native";
import { ChipProvider } from './components/ChipProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function RadialBackground() {
  return (
    <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
      <Defs>
        <RadialGradient id="grad" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#2D2D2D" stopOpacity="1" />
          <Stop offset="0.6" stopColor="#212121" stopOpacity="1" />
          <Stop offset="1" stopColor="#1A1919" stopOpacity="1" />
        </RadialGradient>
      </Defs>

      {/* Fill rect with our defined gradient*/}
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
    </Svg>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    EncodeSans: fonts.encodeSans,
    EncodeSansBold: fonts.encodeSansBold,
  });

  const insets = useSafeAreaInsets();
  
  return (
    <SafeAreaProvider>
    <ChipProvider>
      <RadialBackground/>

      <SafeAreaView style={{flex:1}} edges={['left', 'right', 'top', 'bottom']}>

        <Image 
          source={images.premium}
          resizeMode="stretch"
          style={{
            width: 115,
            height: 40,
            marginLeft: 25,
            marginTop:insets.top + 5,
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />

        {/* Stack implcitily holds a View box, by changing contentStyle we can change that implicit box */}
        <Stack screenOptions={{headerShown: false, contentStyle: {backgroundColor: 'transparent'}}}>
          <Stack.Screen name="index" options={{title: "Divvy Chip", }} />
          <Stack.Screen name="divchip" options={{title: "Buy In", animation:"default"}} />
        </Stack>

      </SafeAreaView>
    
    </ChipProvider>
    </SafeAreaProvider>
  );
}
