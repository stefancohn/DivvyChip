import { TouchableOpacity, View, Text, Image } from 'react-native';
import {images} from "../backend/constants"
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useChipContext } from './components/ChipProvider';
import NumInputBox from './components/inputBox';
import RectangleButton from './components/rectangleButton';
import { chipDistribution } from '@/backend/chipDivsionAlgo';
import ChipDisplay from './components/ChipDisplay';

export default function DivChip() {
    //get router and context vars
    const router = useRouter();
    const {buyIn : buyIn, setBuyIn, diffColors, totalCount, setTotalCount,
    countDistribution, setChipProfiles, chipProfiles} = useChipContext();

    useEffect(()=> {
        console.log(chipProfiles)
    });

    const onTotalCountChange = (value : any) => {
        //min of 10 chips 
        if(value>=10){
            setTotalCount(value);
            var distRes = chipDistribution(Number(buyIn), diffColors, totalCount, countDistribution);
            setChipProfiles(distRes);
            console.log(chipProfiles);
        }
    }

    return(
        <View style={{flex: 1, alignItems: 'center', flexDirection:"column"}}>
            {/* TOTAL COUNT */}
            <View className="self-end mr-5 flex-col gap-2">
                <Text className="font-EncodeSansBold color-white">Total Count:</Text>
                <NumInputBox width="100%" height={25} fontSize={20} setValue={onTotalCountChange} placeholderVal={String(totalCount)}/>
            </View>

            {/* All The Coins */}
            <View className="flex-1 align-top flex-col justify-start">
                <ChipDisplay color="yellow"/>
                <ChipDisplay color="green"/>
            </View>
        </View>
    );
}