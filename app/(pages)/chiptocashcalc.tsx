import { View, Text, Modal, TouchableOpacity, Pressable } from 'react-native';
import { useChipContext } from '../components/ChipProvider';
import NumInputBox from '../components/inputBox';
import ChipDisplay from '../components/ChipDisplay';
import { useEffect, useState } from 'react';
import { PayoutRow } from './payout';
import RectangleButton from '../components/rectangleButton';

type Props = {
    visible : boolean,
    setVisible : (value : boolean) => void,
    payoutRow : PayoutRow[],
    setPayoutRow : (value : PayoutRow[]) => void,
    index : number
}

export default function ChipToCashCalc({visible, setVisible, payoutRow, setPayoutRow, index} : Props) {
    const {diffColors, chipProfiles} = useChipContext();

    var [chipSize, setChipSize] = useState<number>(60);
    var [amounts, setAmount] = useState<number[]>([]);


    useEffect(() => {
        //initalize setAmount array, dynamically change chip size
        if (amounts.length != diffColors){
            setAmount(new Array(diffColors).fill(0));
            if (diffColors > 4) {
                setChipSize(45);
            } else {
                setChipSize(60);
            }
        }

    }, [diffColors, amounts]);

    //handle updates to calculate new cashout
    const chipAmountChange = (value: number, index?: number) => {
        if (index===undefined) return;
        const updatedAmounts = [...amounts];
        updatedAmounts[index] = Number(value);
        setAmount(updatedAmounts);
    }

    const handleSubmit = () => {
        var newRows = [...payoutRow];
        newRows[index].out = Number(getCashOut());
        setPayoutRow(newRows);

        setVisible(false);
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
        <Modal visible={visible} animationType="slide" transparent={true}>
        <Pressable style={{flex: 1, backgroundColor: "rgba(0,0,0,0.9)"}} onPress={()=>setVisible(false)}>

            <Pressable className="items-center gap-5" onPress={()=>{}}>

                {/* Upper Text */}
                <View style={{
                    flexDirection: "column",
                    gap: 10,
                    alignContent: "center",
                    paddingTop: 65,
                }}>
                    <Text style={{
                        fontFamily: "EncodeSansBold",
                        textAlign: "center",
                        color: "white",
                        fontSize: 22,
                    }}>
                        Calculate Cash
                    </Text>
                    <Text style={{
                        fontSize: 17, 
                        color: "gray", 
                        fontFamily: "EncodeSans",
                        textAlign: "center",
                    }}>
                        Enter Chip Amounts
                    </Text>
                </View>

                {/* Chip Display & Inputs */}
                <View style={{gap: chipSize < 4 ? 20 : 9.75}}>
                    {chipProfiles.map((profile, i) => {
                        return(
                            <View key={i} style={{ flexDirection:"row", gap: 50, alignItems:"center"}}>
                                <ChipDisplay profile={profile} key={i} size={chipSize} showCount={false}/>
                                <NumInputBox width={100} height={chipSize<4 ? 30 : 20} 
                                fontSize={18} index={i} setValue={chipAmountChange} value={amounts[i]!=undefined ? amounts[i].toString(): ""}/>
                            </View>
                        );
                    })}
                </View>

                {/* Clear and Total Amount */}
                <View style={{}}>
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

                    <TouchableOpacity onPress={()=>setAmount(new Array(diffColors).fill(0))}>
                        <Text style={{
                            color: "white",
                            fontSize: 22,
                            fontFamily: "EncodeSansBold",
                            textDecorationLine: "underline",
                            textAlign: "center"
                        }}>
                            Clear
                        </Text>
                    </TouchableOpacity>
                </View>

                <RectangleButton width={100} height={50} fontSize={16} text={"Submit"} onPress={handleSubmit}/>
            </Pressable>

        </Pressable>

        </Modal>
    );
}