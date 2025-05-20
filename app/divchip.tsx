import { TouchableOpacity, View, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useChipContext } from './components/ChipProvider';
import NumInputBox from './components/inputBox';
import { getDistributionVariants, chipDistribution } from '@/backend/chipDivsionAlgo';
import ChipDisplay from './components/ChipDisplay';
import CircleButton from './components/CircleButton';
import Slider from "@react-native-community/slider";
import { useEffect, useRef } from 'react';

const defDistributions : number[][] = [
    [0.8, 0.2, 0, 0, 0, 0],
    [0.5, 0.35, 0.15, 0, 0, 0],
    [0.4, 0.3, 0.2, 0.1, 0, 0],
    [.80, .20,0,0,0,0],
    [.80, .20,0,0,0,0],
]

export default function DivChip() {
    //get router and context vars
    const router = useRouter();
    const {buyIn : buyIn, setBuyIn, diffColors, setDiffColors, totalCount, setTotalCount,
    countDistribution, setCountDistribution, distributionVariants, setDistributionVariants,
    setChipProfiles, chipProfiles} = useChipContext();

    const previousSliderChip = useRef(5);
    
    //when chip button gets pressed, properly change diff chip amt
    //and recalculate distribution
    const changeDiffColor = () => {
        //ensure next val is between 2-6
        let next = (diffColors + 1)%7;
        if (next==0) next+=2;
        setDiffColors(next);

        setCountDistribution(defDistributions[next-2]);

        setDistributionVariants(getDistributionVariants(defDistributions[next-2],next));

        //update chip profiles
        var distRes = chipDistribution(Number(buyIn), next, totalCount, defDistributions[next-2]);
        setChipProfiles(distRes);
    } 

    //when user changes top right value, properly handle 
    //and recalculate distribution
    const onTotalCountChange = (value : any) => {
        //min of 10 chips 
        if(value>=10){
            setTotalCount(value);
            var distRes = chipDistribution(Number(buyIn), diffColors, value, countDistribution);
            setChipProfiles(distRes);
            console.log(chipProfiles);
        }
    }

    //convert the slider value to appropriate
    //change in distributions
    const onSliderChange = (value: any) => {
        const distRes = chipDistribution(Number(buyIn), diffColors, totalCount, distributionVariants[value]);
        setChipProfiles(distRes);
    }

    //need to find current by searching variants for def
    const getSliderValue = () => {
        function arraysEqual(a: number[], b: number[]) {
            return a.every((val, index) => val === b[index]);
        }

        for (var i = 0; i < distributionVariants.length; i++) {
            if (arraysEqual(defDistributions[diffColors-2], distributionVariants[i])){
                return(i)
            }
        }
    }

    getSliderValue();

    return(
        <View style={{flex: 1, alignItems: 'center', flexDirection:"column"}}>
            {/* TOTAL COUNT */}
            <View className="self-end mr-5 flex-col gap-2 flex-0.5">
                <Text className="font-EncodeSansBold color-white">Total Count:</Text>
                <NumInputBox width="100%" height={25} fontSize={20} setValue={onTotalCountChange} placeholderVal={String(totalCount)}/>
            </View>

            {/* Coin Display */}
            <View className="flex-1 align-top flex-col justify-start m-16">
                {/* For 2 chip, iterate over profiles! */}
                {(diffColors == 2 || diffColors ==3 ) && 
                    <View style={{flexDirection: "row", gap: 50}}>
                        {chipProfiles.map((profile, index) => (
                            <ChipDisplay profile={profile} key={index}/>
                        ))}
                    </View>                
                }
            </View>

            {/* Middle Section - chip amount, dist slider, new buy-in */}
            <View className='flex-1 gap-4 items-center'>
                <CircleButton width={75} height={75} fontSize={18} text={diffColors + "\nChips"} onPress={changeDiffColor}/>
                <Slider
                    style={{width: 250}}
                    thumbTintColor='gray'
                    minimumTrackTintColor='#1C7D2F'
                    maximumTrackTintColor='#571F1F'
                    minimumValue={0}
                    maximumValue={distributionVariants.length-1}
                    step={1}
                    value={getSliderValue()}
                    onValueChange={onSliderChange}
                />
            </View>
        </View>
    );
}