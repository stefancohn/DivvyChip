import { TextInput, View, Image, Text } from "react-native";
import {images} from "../backend/constants"
import InputBox from "./components/inputBox";

export default function Index() {
  return (
    <View className="flex-1">

      {/* TOP section - Logo display */}
      <View className="flex-1 items-center mt-10">
        <Image source={images.logoWithText} className="size-80" resizeMode="contain"/>
      </View>

      {/* MIDDLE section - input for buy in */}
      <View className="flex-1 items-center gap-4">
      
        {/* Text input box 
        Wrap in this to get inside shadow */}
        <View className="p-[2px] bg-[#FF0000]/70 rounded-[0.625rem]">
          <InputBox fontSize={20} width={280} height={40}/>
        </View>

        {/* Undertext */}
        <Text className="font-EncodeSans text-3xl text-white/50">Enter Buy-in</Text>

      </View>
    </View>
  );
}
