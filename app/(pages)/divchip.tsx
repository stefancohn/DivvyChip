import { View, Text, } from 'react-native';
import { useRouter } from 'expo-router';
import { useChipContext } from '../components/ChipProvider';
import NumInputBox from '../components/inputBox';
import { calculateChipProfiles } from '@/backend/chipDivsionAlgo';
import ChipDisplay from '../components/ChipDisplay';
import CircleButton from '../components/CircleButton';
import Slider from "@react-native-community/slider";
import { useState } from 'react';
import { validBuyIn } from '@/backend/constants';
import Bottom from '../components/BottomRedir';
import PremiumButton from '../components/PremiumButton';
import Animated, { FadeIn } from 'react-native-reanimated';

//for polar coordinates for chip placements
//need different radius for diff chip amounts
const getRadius = (diffColors:number) : number => {
    var arr = [80, 120, 100, 120, 120];
    return(arr[diffColors]);
}
const getChipSize = (diffColors:number) : number => {
    var arr = [80, 80, 70, 70, 60];
    return(arr[diffColors])
};


export default function DivChip() {
    //get router and context vars
    const router = useRouter();
    const {buyIn : buyIn, setBuyIn, diffColors, setDiffColors, totalCount, setTotalCount, 
    setChipProfiles, chipProfiles} = useChipContext();
    const [wrapperDimensions, setWrapperDimensions] = useState({ width: 0, height: 0 });
    
    //get dimension of a view
    const handleWrapperLayout = (event: any) => {
        const { width, height } = event.nativeEvent.layout;
        setWrapperDimensions({ width, height });
    };

    //when chip button gets pressed, properly change diff chip amt
    //and recalculate distribution
    const changeDiffColor = async () => {
        //ensure next val is between 2-5
        let next = (diffColors + 1)%6;
        if (next==0) next+=2;
        setDiffColors(next);

        //update chip profiles
        var distRes = calculateChipProfiles(Number(buyIn), next, totalCount,);
        setChipProfiles(distRes);
    } 

    //when user changes top right value, properly handle 
    //and recalculate distribution
    const verifyNewTotalCount = async (value : any) => {
        if (value === "") {return}
        
        value = Number(value);
        //min of 10 chips 
        if(value>=10 && Number.isInteger(value)){
            setTotalCount(value);
            var distRes = calculateChipProfiles(Number(buyIn), diffColors, value,);
            setChipProfiles(distRes);
        } else {
            alert("Total count must be greater than 10 and a whole number.");
        }
    }

    //convert the slider value to appropriate
    //change in distributions
    const onSliderChange = async (value: any) => {

    }

    //need to find current by searching variants for def
    const getSliderValue = () => {

    }

    const newBuyIn = async (value : any) => {
        if (value === "") {return}

        if (validBuyIn(value)) {
            setBuyIn(value);
            var distRes = calculateChipProfiles(value, diffColors, totalCount,);
            setChipProfiles(distRes);
        } else {
            alert('Please enter a valid amount (e.g., 5, 2.50, .99) of 1.00 or above. Only up to two decimal places are allowed.');
        }
    }

    function getTotalCount() {
        var total=0;
        chipProfiles.forEach(prof=>total+=prof.amount);
        return total;
    }

    function getTotalBuyIn() {
        var total=0;
        chipProfiles.forEach(prof=>total+=(prof.value*prof.amount));
        return total/100;
    }

    //The actual UI is here lol
    return(
        <>
        <PremiumButton/>

        <Animated.View 
            style={{flex: 1, alignItems: 'center', flexDirection:"column"}}
            entering={FadeIn.duration(500)}
            exiting={FadeIn.duration(500).springify()}
            layout={FadeIn.duration(500)}
        >
            {/* TOTAL COUNT */}
            <View className="self-end mr-5 flex-col gap-2 flex-0.5">
                <Text className="font-EncodeSansBold color-white">Total Count:</Text>
                <NumInputBox width="100%" height={25} fontSize={20} onBlur={verifyNewTotalCount} placeholderVal={String(getTotalCount())}/>
            </View>

            {/* Recommended Blinds */}
            <Text style={{
                fontSize: 15,
                color: "white",
                alignSelf: "flex-start",
                fontFamily: "EncodeSansBold",
                left: 20,
                marginBottom: -50,
                marginTop: 5
            }}>
                Small Blind: {" "}
                <Text className="font-EncodeSans">{(chipProfiles[0].value*.01).toFixed(2)+"\n"}</Text> 
                Big Blind: {" "}
                <Text className="font-EncodeSans">{(chipProfiles[0].value*.01*2).toFixed(2)}</Text>
            </Text>

            {/* Coin Display */}
            <View style={{flex: 1.4}} onLayout={handleWrapperLayout}>
                {/* Polar coordinates to get its proper position */}
                {chipProfiles.map((profile, index) => {
                    var chipSize = getChipSize(diffColors-2);

                    var angle : number = (2*Math.PI)/diffColors;
                    var centerY: number = (wrapperDimensions.height/2) - (chipSize/2);

                    var x : number =(Math.cos((angle*index)+((Math.PI)/2)) * getRadius(diffColors-2)) - (chipSize/2);
                    var y : number = (Math.sin((angle*index)-((Math.PI)/2)) * getRadius(diffColors-2)) + (centerY);

                    return (
                        <View key={index} style={{position: "absolute", left:x, top: y, }}>
                            <ChipDisplay profile={profile} key={index} size={chipSize}/>
                        </View>
                    );
                })}
            </View>

            {/* Middle Section - chip amount, dist slider, new buy-in */}
            <View className='gap-4 items-center mt-5 mb-7' style={{flex: 0.8}}>

                <CircleButton width={75} height={75} fontSize={18} text={diffColors + "\nChips"} onPress={changeDiffColor}/>
                {/*
                <Slider
                    style={{width: 270}}
                    thumbTintColor='gray'
                    minimumTrackTintColor='#1C7D2F'
                    maximumTrackTintColor='#571F1F'
                    minimumValue={0}
                    maximumValue={distributionVariants.length-1}
                    step={1}
                    value={getSliderValue()}
                    onValueChange={onSliderChange}
                />
                
                {/* Tags under slider *\/}
                <View style={{flexDirection: "row", justifyContent: "space-between"}}className="mt-[-0.85rem]">
                    <Text className="font-EncodeSans self-start justify-self-start text-red-600 text-[1rem] mr-12">Less Blind Chips</Text>
                    <Text className="font-EncodeSans self-end justify-self-end text-green-600 text-[1rem] ml-12">More Blind Chips</Text>
                </View>
                }

                {/* New Buy In */}
                <View style={{alignContent: "center", flexDirection: "column", gap:5}}>
                    <NumInputBox 
                        width={120} 
                        height={50} 
                        fontSize={20} 
                        placeholderVal={String(getTotalBuyIn())}
                        onBlur={newBuyIn}
                    />
                    <Text style={{fontFamily: "EncodeSansBold", fontSize: 15, color: "gray", textAlign: "center"}}>New Buy-In</Text>
                </View>
            </View>

            <Bottom curField="divchip"/>
        </Animated.View>
        </>
    );
}