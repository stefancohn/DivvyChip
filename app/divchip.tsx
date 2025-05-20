import { TouchableOpacity, View, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useChipContext } from './components/ChipProvider';
import NumInputBox from './components/inputBox';
import { chipDistribution } from '@/backend/chipDivsionAlgo';
import ChipDisplay from './components/ChipDisplay';
import CircleButton from './components/CircleButton';
import Slider from "@react-native-community/slider";
import { useEffect, useRef } from 'react';

const defDistributions : number[][] = [
    [.80, .20,0,0,0,0],
    [.50, .35,.15,0,0,0],
    [.40, .30, .20, .10,0,0],
    [.80, .20,0,0,0,0],
    [.80, .20,0,0,0,0],
]

//.25 .35. 25 .15
//. 30 .35 .25 .10
// .35 .35 .20 .10
//     .40, 0.30 .20, .0.10
// .45, 0.3, 0.2 0.05
//.50, 0.3, .15, 0.05
//.55, 0.25, 0.15, 0.05

export default function DivChip() {
    //get router and context vars
    const router = useRouter();
    const {buyIn : buyIn, setBuyIn, diffColors, setDiffColors, totalCount, setTotalCount,
    countDistribution, setCountDistribution, setChipProfiles, chipProfiles} = useChipContext();
    const previousSliderChip = useRef(5);
    console.log(chipProfiles);
    
    //when chip button gets pressed, properly change diff chip amt
    //and recalculate distribution
    const changeDiffColor = () => {
        //ensure next val is between 2-6
        let next = (diffColors + 1)%7;
        if (next==0) next+=2;
        setDiffColors(next);

        setCountDistribution(defDistributions[next-2]);

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
        //set previousSliderChip to amt of diffcolors
        if (previousSliderChip.current > diffColors-1) {
            previousSliderChip.current=diffColors-1;
        }

        //get change - this is all based on first dist val
        var valChange : number = (value - chipProfiles[0].distribution);
        valChange = Math.round((valChange*100))/100

        //get shallow copy
        var newDist : number[] = [...countDistribution];

        //update values appropriately
        newDist[0] = Math.round((newDist[0] + valChange)*100)/100;
        
        newDist[previousSliderChip.current]= Math.round((newDist[previousSliderChip.current]-valChange)*100)/100;
        //if value is already 0, keep at 0
        if (newDist[previousSliderChip.current] < 0) {
            newDist[previousSliderChip.current]=0;
            //we don't want neg values adding to first chip
            newDist[0] -= 0.05;
        }

        //move percentage from highest 2nd lowest iteratively
        previousSliderChip.current--;
        if(previousSliderChip.current == 0) {
            previousSliderChip.current=diffColors-1;
        }

        setCountDistribution(newDist);

        //update chip profiles
        var distRes = chipDistribution(Number(buyIn), diffColors, totalCount, newDist);
        setChipProfiles(distRes);
    }

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
                {(diffColors == 2 || diffColors ==3) && 
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
                    maximumValue={1}
                    step={0.05}
                    value={chipProfiles[0].distribution}
                    onValueChange={onSliderChange}
                />
            </View>
        </View>
    );
}