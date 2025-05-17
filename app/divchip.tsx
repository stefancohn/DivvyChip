import { TouchableOpacity, View, Text, Image } from 'react-native';
import {images} from "../backend/constants"
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useChipContext } from './components/ChipProvider';
import NumInputBox from './components/inputBox';
import RectangleButton from './components/rectangleButton';

export default function Index() {
    //get router and context vars
    const router = useRouter();
    const {buyIn : buyIn, setBuyIn, diffColors, totalCount, 
    countDistribution, chipProfiles} = useChipContext();

    useEffect(()=> {
        console.log(chipProfiles)
    });
    return(
        <View style={{flex: 1,}}>
            <RectangleButton width={100} height={100} fontSize={10} text="WIENER"/>
        </View>
    );
}