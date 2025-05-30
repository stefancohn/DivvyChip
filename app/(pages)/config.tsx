import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { defDistributions, useChipContext } from '../components/ChipProvider';
import NumInputBox from '../components/inputBox';
import ChipDisplay from '../components/ChipDisplay';
import { useEffect, useState } from 'react';
import RectangleButton from '../components/rectangleButton';
import CircleButton from '../components/CircleButton';
import { chipDistribution, getDistributionVariants} from '@/backend/chipDivsionAlgo';
import { colorMap } from '@/backend/constants';
import ModalSelector from 'react-native-modal-selector'

const colWidth = "22%"

//simple helper to get jsx component for each option 
function getColorOption(color : string) : React.JSX.Element {
    return (
        <View style={{alignItems: "center"}}>
            <Text style={{
                color: colorMap[color.toLowerCase() as keyof typeof colorMap],
                fontSize: 20,
                fontFamily: "EncodeSans"
            }}>
                {color}
            </Text>
        </View>
    );
}

type ColorOption = {
    key: number;
    label: string;
    component: React.JSX.Element;
};

const colorData : ColorOption[] = [
    {key: 0, label: "Black", component: getColorOption("Black")},
    {key: 1, label: "White", component: getColorOption("White")},
    {key: 2, label: "Red", component: getColorOption("Red")},
    {key: 3, label: "Green", component: getColorOption("Green")},
    {key: 4, label: "Purple", component: getColorOption("Purple")},
    {key: 5, label: "Yellow", component: getColorOption("Yellow")},
    {key: 6, label: "Orange", component: getColorOption("Orange")},
    {key: 7, label: "Pink", component: getColorOption("Pink")},
    {key: 8, label: "Blue", component: getColorOption("Blue")},
    {key: 9, label: "Gray", component: getColorOption("Gray")},
];

export default function Config() {
    const {buyIn : buyIn, setBuyIn, diffColors, setDiffColors, totalCount, setTotalCount,
        countDistribution, setCountDistribution, distributionVariants, setDistributionVariants,
        setChipProfiles, chipProfiles} = useChipContext();
    
    var [unselectedColors, setUnseletedColors] = useState<ColorOption[]>(colorData);

    const router = useRouter();

    useEffect(() => {
        //update unselectedColors so colorpciker is well maintained
        var usedColors = new Set(chipProfiles.map(profile => profile.color.toLowerCase()));

        const available = colorData.filter(option => 
            !usedColors.has(option.label.toLowerCase())
        );

        setUnseletedColors(available);
    }, [chipProfiles])

    //function to take inputs from table and properly change value in 
    //chip profiles. handles verification
    const handleValChange = (value : any, i? : number, 
    field? : "value" | "amount" | "color") => {
        if (i === undefined || field===undefined) return;

        if (field ==="value") {
            const regex : RegExp = /^(?:\d+|\d*\.\d{1,2})$/
            const regexMatch = regex.test(value);
            if(!regexMatch) {
                alert("Value must be a valid decimal or whole number (i.e. 1, 1.32, .21)");
                return;
            }

            //set new buy in amount
            value *= 100;
            var differenceInValue = (value* chipProfiles[i].amount - chipProfiles[i].value * chipProfiles[i].amount);
            var newBuyIn =(Number(buyIn)*100 + differenceInValue) *.01 
            setBuyIn(String(Math.round(newBuyIn * 100)/100))
        } 
        else if (field === "amount") {
            const regex : RegExp = /^(?:\d+)$/
            const regexMatch = regex.test(value);
            if (!regexMatch) {
                alert("Count must be a whole number");
                return;
            }

            //set new total amount 
            value = Number(value);
            var differenceInAmount = value - chipProfiles[i].amount;
            var newAmount = (totalCount+differenceInAmount);
            setTotalCount(newAmount);
            //set new buy in amount
            var differenceInValue = (value* chipProfiles[i].value - chipProfiles[i].value * chipProfiles[i].amount);
            var newBuyIn =(Number(buyIn)*100 + differenceInValue) *.01 
            setBuyIn(String(Math.round(newBuyIn * 100)/100))
        }

        const updatedProfiles = [...chipProfiles];
        updatedProfiles[i] = {
            ...updatedProfiles[i],
            //brackets mean read var, not literal
            [field]: value
        }

        setChipProfiles(updatedProfiles);
    }

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
    
    return (
        <View className="flex-1 items-center gap-5 pt-[6.25rem]">
            {/* Upper Text */}
            <View>
                <Text style={{
                    fontFamily: "EncodeSansBold",
                    textAlign: "center",
                    color: "white",
                    fontSize: 25,
                }}>
                    CONFIGURATION
                </Text>
            </View>

            {/* Middle Table */}
            <View style={{
                backgroundColor: "#4B564C",
                borderRadius: 20,
                flexDirection: "column",
            }}>

                {/* The header*/}
                <View style={{
                    flexDirection: "row",
                    gap: 40,
                    margin: 10,
                }}> 
                    <View style={{width: colWidth}}>
                        <Text style={styles.tableHeader}>
                            Chip
                        </Text>
                    </View>

                    <View style={{width: colWidth}}>
                        <Text style={styles.tableHeader}>
                            Value
                        </Text>
                    </View>

                    <View style={{width: colWidth}}>
                        <Text style={styles.tableHeader}>
                            Count
                        </Text>
                    </View>
                </View>

                {/* Each row */}
                {chipProfiles.map((profile, index) => {
                    return (
                        <View key={index} style={{ flexDirection: "row", gap:40, margin:10, alignItems: "center"}}>
                            <View style={{width:colWidth}}>
                                <ModalSelector 
                                    data={unselectedColors} 
                                    overlayStyle={{backgroundColor: "transparent"}}
                                    optionContainerStyle={{backgroundColor: "white"}}
                                    optionTextStyle={{color: "black"}}
                                    onChange={(option) => handleValChange(option.label.toLowerCase(), index, "color")}
                                >
                                    <Text style={{
                                        fontFamily: "EncodeSans",
                                        color: profile.color,
                                        fontSize: 18,
                                    }}
                                    >
                                        {profile.color+"\n"}<Text style={{color:"gray", margin: 2}}>▼</Text>
                                    </Text>
                                </ModalSelector>
                            </View>

                            <View style={{width:colWidth}}>
                                <NumInputBox 
                                    width={"80%"} 
                                    height={20} 
                                    fontSize={14}
                                    placeholderVal={String((profile.value*.01).toFixed(2))} 
                                    onBlur={(val: any)=> handleValChange(val, index, "value")}
                                />
                            </View>

                            <View style={{width:colWidth}}>
                                <NumInputBox 
                                    width={"90%"}
                                    height={22} 
                                    fontSize={14} 
                                    placeholderVal={String(profile.amount)} 
                                    onBlur={(val: any)=> handleValChange(val, index, "amount")}
                                />
                            </View>
                        </View>
                    );
                })}

                {/* TOTALS ROW AT BOT */}
                <View style={{ flexDirection: "row", gap:40, margin:10, alignItems: "center"}}>
                    <View style={{width:colWidth}}>
                        <Text style={styles.tableHeader}>Totals:</Text>
                    </View>

                    <View style={{width:colWidth}}>
                        <Text style={styles.tableHeader}>{buyIn}</Text>
                    </View>

                    <View style={{width:colWidth}}>
                        <Text style={styles.tableHeader}>{totalCount}</Text>
                    </View>
                </View>
            </View>

            {/* Add/Remove chip */}
            <View style={{flexDirection: "row"}}>
                <CircleButton width={75} height={75} fontSize={18} text={diffColors + "\nChips"} onPress={changeDiffColor}/>
            </View>

            {/* Bottom Buttons */}
            <View style={{flexDirection: "row", justifyContent: "space-evenly", width: Dimensions.get('window').width, marginTop: 15}}>
                <RectangleButton width={100} height={40} fontSize={16} red={true} text="NO BANK PAYOUT"
                    style={{ marginLeft: 10}}
                />
                <RectangleButton width={100} height={40} fontSize={16} red={true} text="DIVVY CHIP"
                    style={{ marginRight: 10, }}
                    onPress={()=>router.push('./divchip')}
                />
                <RectangleButton width={100} height={40} fontSize={16} red={true} text="Chip to Cash"
                    style={{ marginRight: 10, }}
                    onPress={()=>router.push('./chiptocash')}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    tableHeader: {
      fontFamily: "EncodeSansBold",
      color: 'white',
      fontSize: 16.5
    },
})