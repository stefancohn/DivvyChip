import { View, Image, Text } from "react-native";
import { images } from "../../backend/constants";
import { ChipProfile } from "@/backend/chipDivsionAlgo";

type Props = {
    profile: ChipProfile,
    key?: any,
    size?: any,
};

export default function ChipDisplay({ profile, size = 85 }: Props) {
    return (
        <View className="gap-2">
            {/* Chip Img with circle & blur under */}
            <View style={{position: "relative",}}>
                {/* Circle */}
                <View style={{
                    position: 'absolute', 
                    width: "100%", 
                    height: "100%", 
                    borderRadius: size, 
                    backgroundColor: profile.color,
                }}/>

                {/* Shadow */}
                <View style={{
                    position: 'absolute', 
                    width: "100%", 
                    height: "100%",
                    opacity: 0.4,
                    shadowColor: profile.color,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.8,
                    shadowRadius: 10,
                    borderRadius: size, 
                    backgroundColor: profile.color,
                }}/>
                <Image source={images.baseChip} resizeMode="contain" style={{width:size, height:size, margin: 0}}/>
            </View>

            <Text style={{
                fontFamily: "EncodeSansBold", 
                color: profile.color, 
                textAlign: "center",
                overflow: "hidden",
                maxWidth: size,
            }}>
                {profile.amount + " count"}
            </Text>
            <Text style={{
                fontFamily: "EncodeSans", 
                color: profile.color, 
                textAlign: "center",
                overflow: "hidden",
                maxWidth: size,
                marginTop: -7,
                fontSize: 16
            }}>
                {profile.value * .01}
            </Text>
        </View>
    );
}