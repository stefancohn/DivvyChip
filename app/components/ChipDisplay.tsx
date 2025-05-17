import { View, Image, Text } from "react-native";
import { images } from "../../backend/constants";
import Svg, { Circle, Defs, FeGaussianBlur } from 'react-native-svg';

type Props = {
    color : string,
};

export default function ChipDisplay({color} : Props) {
    return (
        <View style={{position: "relative",}}>
            {/* Circle */}
            <View style={{
                position: 'absolute', 
                width: "100%", 
                height: "100%", 
                borderRadius: 100, 
                backgroundColor: color,
            }}/>

            {/* Shadow */}
            <View style={{
                position: 'absolute', 
                width: "100%", 
                height: "100%",
                opacity: 0.4,
                shadowColor: color,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 10,
                borderRadius: 100, 
                backgroundColor: color,
            }}/>
            <Image source={images.baseChip} resizeMode="contain" style={{width:100, height:100, margin: 0}}/>
        </View>
    );
}