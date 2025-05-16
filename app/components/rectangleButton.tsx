import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { TouchableOpacity, View, Text } from 'react-native';

function GreenRadialBg({ width, height }: { width: any; height: any }) {
  return (
    <Svg height={height} width={width} style={StyleSheet.absoluteFillObject}>
      <Defs>
        <RadialGradient id="grad" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#097522" stopOpacity="1" />
          <Stop offset="0.32" stopColor="#176A2A" stopOpacity="1" />
          <Stop offset="0.97" stopColor="#0B4A19" stopOpacity="1" />
        </RadialGradient>
      </Defs>

      {/* Fill rect with our defined gradient*/}
      <Rect x="0" y="0" width={width} height={height} fill="url(#grad)" />
    </Svg>
  );
}

function RedRadialBg({ width, height }: { width: any; height: any }) {
    return (
      <Svg height={height} width={width} style={StyleSheet.absoluteFillObject}>
        <Defs>
          <RadialGradient id="grad" cx="50%" cy="50%" r="60%">
            <Stop offset="0" stopColor="#FF0000" stopOpacity="1" />
            <Stop offset="0.4" stopColor="#AF0000" stopOpacity="1" />
            <Stop offset="0.97" stopColor="#7E0000" stopOpacity="1" />
          </RadialGradient>
        </Defs>
  
        {/* Fill rect with our defined gradient*/}
        <Rect x="0" y="0" width={width} height={height} fill="url(#grad)" />
      </Svg>
    );
  }

type Props = {
    width : any,
    height : any,
    fontSize: any,
    text: String,
    style? : StyleProp<ViewStyle>,
    onPress?: () => void,
    red?: boolean,
}

export default function RectangleButton({width, height, fontSize, text, style, onPress, red=false} : Props) {
    return(
        <TouchableOpacity onPress={onPress} style={style}>
            
            <View style={{
                width, height, 
                alignItems: "center", justifyContent: "center",
                borderRadius: 10,
                overflow: "hidden",
            }}>

                {red ? <RedRadialBg width={width} height={height}/> : <GreenRadialBg width={width} height={height}/>}

                <Text className="color-white text-lg font-EncodeSansBold text-center" style={{
                    fontSize,
                    textAlign: 'center',
                    lineHeight: fontSize,
                    flexWrap: "wrap",
                }}>
                    {text}
                </Text>

            </View>

        </TouchableOpacity>
    );
};

