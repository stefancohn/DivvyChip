import { Stack } from "expo-router";
import "./globals.css"
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { StyleSheet, TouchableOpacity } from "react-native";
import { fonts } from '../backend/constants';
import { useFonts } from 'expo-font';
import { ChipProvider } from './components/ChipProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

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

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const insets = useSafeAreaInsets();
  
  return (
    <SafeAreaProvider>
    <ChipProvider>
      <RadialBackground/>
      <SafeAreaView style={{flex:1}} edges={['left', 'right', 'top', 'bottom']}>

        {/* Stack implcitily holds a View box, by changing contentStyle we can change that implicit box */}
        <Stack screenOptions={{
          headerShown: false, 
          contentStyle: {backgroundColor: 'transparent'},
          animation: 'none'
          
        }}>
          {/* 
          <Stack.Screen name="index" options={{title: "Divvy Chip", animation:"none"}} />
          <Stack.Screen name="divchip" options={{title: "Buy In", animation:"none"}} />
          <Stack.Screen name="chiptocash" options={{title: "Chip To Cash", animation:"none",}} />
          <Stack.Screen name="config" options={{title: "config", animation:"none",}} />
          <Stack.Screen name="payout" options={{title: "payout", animation:"none",}} />
          */}
        </Stack>

      </SafeAreaView>
    
    </ChipProvider>
    </SafeAreaProvider>
  );
}
