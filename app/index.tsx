import { Link } from "expo-router";
import { TextInput, View, Image } from "react-native";
import {images} from "../backend/constants"

export default function Index() {
  return (
    <View className="flex-1">

      {/* TOP section - Logo display */}
      <View className="flex-1 items-center mt-10">
        <Image source={images.logoWithText} className="size-80" resizeMode="contain"/>
      </View>

      {/* MIDDLE section - input for buy in */}
      <View className="flex-1 items-center">
        <TextInput
          className="bg-[#D9D9D9]/90 rounded-[0.625rem] w-[18rem] h-[2.5rem] p-2 text-center"  
          style={{boxShadow: "inset 0px 4px 3px 3px rgba(0,0,0,0.25)" , }}
        />

      </View>
    </View>
  );
}
