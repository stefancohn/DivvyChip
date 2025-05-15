import { View, Image, Text } from "react-native";
import {images} from "../backend/constants"
import InputBox from "./components/inputBox";
import RectangleButton from "./components/rectangleButton";

export default function Index() {
  return (
    <View className="flex-1">

      {/* TOP section - Logo display */}
      <View className="items-center mt-16" style={{flex: 1}}>
        <Image source={images.logoWithText} className="size-72" resizeMode="contain"/>
      </View>

      {/* MIDDLE TOP section - input for buy in, go button */}
      <View className="items-center gap-2" style={{flex: 0.9}}>
        <InputBox fontSize={20} width={200} height={32}/>

        {/* Undertext */}
        <Text className="font-EncodeSans text-[1.8rem] text-white/50">Enter Buy-in</Text>

        <RectangleButton width={150} height={70} fontSize={40} text="GO" style={{marginTop: 40}}/>
      </View>

      {/* BOTTOM SECTION - go to other section */}
      <RectangleButton width={120} height={70} fontSize={22} red={true} text="CHIP-TO-CASH"
        style={{alignSelf: "flex-end", marginRight: 10}}
      />
    </View>
  );
}
