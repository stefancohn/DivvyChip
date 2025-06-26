import { View, Image, Text, TouchableOpacity } from "react-native";
import {images, validBuyIn} from "../backend/constants"
import NumInputBox from "./components/inputBox";
import RectangleButton from "./components/rectangleButton";
import { calculateChipProfiles,} from "../backend/chipDivsionAlgo";
import { useRouter } from "expo-router";
import { useChipContext } from "./components/ChipProvider";
import { useEffect } from "react";
import Bottom from "./components/BottomRedir";
import PremiumButton from "./components/PremiumButton";

export default function Index() {
  //get router and context vars
  const router = useRouter();
  const {buyIn : buyIn, setBuyIn, diffColors, totalCount, 
    setChipProfiles,} = useChipContext();

  //func for when go gets pressed
  const handleGo = () => {
    //validify
    if (validBuyIn(buyIn)) {
      var distRes = calculateChipProfiles(Number(buyIn), diffColors, totalCount);
      setChipProfiles(distRes);

      router.push('./divchip');
    } 
  
    //on invalid input give proper alert
    else {
      alert('Please enter a valid amount (e.g., 5, 2.50, .99) of 1.00 or above. Only up to two decimal places are allowed.');
    }
  }

  useEffect(()=>{
    var distRes = calculateChipProfiles(Number(buyIn), diffColors, totalCount);
    setChipProfiles(distRes);
  }, [])
 

  return (
    <>
    <PremiumButton/>
    
    <View className="flex-1" style={{justifyContent: "center", alignItems: "center"}}>

      {/* TOP section - Logo display */}
      <View className="items-center mt-[4.2rem]" style={{flex: 5}}>
        <Image source={images.logoWithText} className="size-72" resizeMode="contain"/>
      </View>

      {/* MIDDLE TOP section - input for buy in, go button */}
      <View className="items-center gap-2" style={{flex: 4}}>
        <NumInputBox fontSize={20} width={200} height={32} setValue={setBuyIn}/>

        {/* Undertext */}
        <Text className="font-EncodeSans text-[1.8rem] text-white/50">Enter Buy-in</Text>

        {/* GO button */}
        <RectangleButton width={150} height={70} fontSize={40} text="GO" style={{marginTop: 40}}
          onPress={handleGo}
        />
      </View>

      {/* BOTTOM SECTION - go to other section */}
      <Bottom curField="index" />
    </View>
    </>
  );
}
