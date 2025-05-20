import Svg, { Defs, RadialGradient, Circle, Stop } from 'react-native-svg';
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { TouchableOpacity, View, Text } from 'react-native';

const outline = 0;

function BlackRadialBg({ width, height }: { width: any; height: any }) {
    return (
      <Svg height={height} width={width} style={[StyleSheet.absoluteFillObject, { width: "100%" }]}>
        <Defs>
          <RadialGradient id="grad" cx="50%" cy="50%" r="60%">
            <Stop offset="0" stopColor="#000000" stopOpacity="1" />
            <Stop offset="0.86" stopColor="#3A3A3A" stopOpacity="1" />
            <Stop offset="1.00" stopColor="#313131" stopOpacity="1" />
          </RadialGradient>
        </Defs>
  
        {/* Fill circle with our defined gradient*/}
        <Circle cx={outline/2 + width/2} cy={outline/2 + height/2} r={ width/2.18} fill="url(#grad)" />
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
}

export default function CircleButton({width, height, fontSize, text, style, onPress,} : Props) {
    return(
        <TouchableOpacity onPress={onPress} style={style}>
            
            <View style={{
                width: width+outline, 
                height: height + outline, 
                alignItems: "center", justifyContent: "center",
                borderRadius: 100,

                backgroundColor: "gray"
            }}>

                <BlackRadialBg width={width} height={height}/>

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

