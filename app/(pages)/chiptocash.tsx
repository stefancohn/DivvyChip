import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useChipContext } from '../components/ChipProvider';
import NumInputBox from '../components/inputBox';
import ChipDisplay from '../components/ChipDisplay';
import { useEffect, useState } from 'react';
import RectangleButton from '../components/rectangleButton';

export default function ChipToCash() {
    const {diffColors, chipProfiles} = useChipContext();

    var [chipSize, setChipSize] = useState<number>(60);
    var [amounts, setAmount] = useState<number[]>([]);
    const router = useRouter();


    useEffect(() => {
        //initalize setAmount array, dynamically change chip size
        if (amounts.length != diffColors){
            setAmount(new Array(diffColors).fill(0));
            if (diffColors > 4) {
                setChipSize(50);
            } else {
                setChipSize(60);
            }
        }

    });

    //handle updates to calculate new cashout
    const chipAmountChange = (value: number, index?: number) => {
        if (index===undefined) return;
        const updatedAmounts = [...amounts];
        updatedAmounts[index] = Number(value);
        setAmount(updatedAmounts);
    }

    //return the cashout!
    function getCashOut() {
        var total = 0;
        amounts.forEach((amount, i) => {
            if(amounts.length == diffColors) {
                total += (amount * (chipProfiles[i].value*.01));
            }
        })
        return total.toFixed(2);
    }
    
    return (

        <View className="flex-1 items-center gap-5">

            {/* Upper Text */}
            <View style={{
                flexDirection: "column",
                gap: 10,
                alignContent: "center",
                paddingTop: 65,
                flex: 1.5
            }}>
                <Text style={{
                    fontFamily: "EncodeSansBold",
                    textAlign: "center",
                    color: "white",
                    fontSize: 25,
                }}>
                    Calculate Cash
                </Text>
                <Text style={{
                    fontSize: 20, 
                    color: "gray", 
                    fontFamily: "EncodeSans",
                    textAlign: "center",
                }}>
                    Enter Chip Amounts
                </Text>
            </View>

            {/* Chip Display & Inputs */}
            <View style={{flex: 7, gap: chipSize < 4 ? 20 : 10}}>
                {chipProfiles.map((profile, i) => {
                    return(
                        <View key={i} style={{ flexDirection:"row", gap: 50, alignItems:"center"}}>
                            <ChipDisplay profile={profile} key={i} size={chipSize} showCount={false}/>
                            <NumInputBox width={100} height={chipSize<4 ? 30 : 20} fontSize={18} index={i} setValue={chipAmountChange}/>
                        </View>
                    );
                })}
            </View>

            {/* Clear and Total Amount */}
            <View style={{flex: 1}}>
                <Text style={{
                    color: "#2DE443",
                    fontSize: 25,
                    fontFamily: "EncodeSansBold",
                    shadowColor: "#2DE443",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.9,
                    shadowRadius: 12,
                }}>
                    {getCashOut()} Credits
                </Text>

                <TouchableOpacity>
                    <Text style={{
                        color: "#2DE443",
                        fontSize: 22,
                        fontFamily: "EncodeSansBold",
                        textDecorationStyle: "solid"
                    }}>
                        Clear
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Change page */}
            <View style={{flex: 0.8, flexDirection: "row", justifyContent: "space-evenly", width: Dimensions.get('window').width, marginTop: 15}}>
                <RectangleButton width={100} height={40} fontSize={16} red={true} text="NO BANK PAYOUT"
                    style={{ marginLeft: 10}}
                />
                <RectangleButton width={100} height={40} fontSize={16} red={false} text="CONFIG/SETTINGS"/>
                <RectangleButton width={100} height={40} fontSize={16} red={true} text="DIVVY CHIP"
                    style={{ marginRight: 10, }}
                    onPress={()=>router.push('./divchip')}
                />
            </View>
        </View>
    );
}