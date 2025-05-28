import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { defDistributions, useChipContext } from '../components/ChipProvider';
import NumInputBox from '../components/inputBox';
import ChipDisplay from '../components/ChipDisplay';
import { useEffect, useState } from 'react';
import RectangleButton from '../components/rectangleButton';
import CircleButton from '../components/CircleButton';
import { chipDistribution, getDistributionVariants } from '@/backend/chipDivsionAlgo';

export default function Config() {
    const {buyIn : buyIn, setBuyIn, diffColors, setDiffColors, totalCount, setTotalCount,
        countDistribution, setCountDistribution, distributionVariants, setDistributionVariants,
        setChipProfiles, chipProfiles} = useChipContext();

    const router = useRouter();

    //function to take inputs from table and properly change value in 
    //chip profiles
    const handleValChange = (value : any, i? : number, 
    field? : "value" | "amount" | "distribution" | "color") => {
        if (i === undefined || field===undefined) return;

        if (field ==="value") {
            value *= 100;
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
                    <View style={{width: "15%"}}>
                        <Text style={styles.tableHeader}>
                            Chip
                        </Text>
                    </View>

                    <View style={{width: "15%"}}>
                        <Text style={styles.tableHeader}>
                            Value
                        </Text>
                    </View>

                    <View style={{width: "15%"}}>
                        <Text style={styles.tableHeader}>
                            Count
                        </Text>
                    </View>

                    <View style={{width: "15%"}}>
                        <Text style={styles.tableHeader}>
                            %
                        </Text>
                    </View>
                </View>

                {/* Each row */}
                {chipProfiles.map((profile, index) => {
                    return (
                        <View key={index} style={{ flexDirection: "row", gap:40, margin:10,  }}>
                            <View style={{width:"15%"}}>
                                <Text style={{
                                    fontFamily: "EncodeSans",
                                    color: profile.color,
                                    fontSize: 18,
                                }}>
                                    {profile.color}<Text style={{color:"gray", margin: 2}}>▼</Text>
                                </Text>
                            </View>

                            <View style={{width:"15%"}}>
                                <NumInputBox 
                                    width={40} 
                                    height={20} 
                                    fontSize={14}
                                    placeholderVal={String((profile.value*.01).toFixed(2))} 
                                    setValue={(val)=> handleValChange(val, index, "value")}
                                />
                            </View>

                            <View style={{width:"15%"}}>
                                <NumInputBox 
                                    width={40}
                                    height={20} 
                                    fontSize={14} 
                                    placeholderVal={String(profile.amount)} 
                                    setValue={(val)=> handleValChange(val, index, "amount")}
                                />
                            </View>

                            <View style={{width:"15%"}}>
                                <NumInputBox 
                                    width={40} 
                                    height={20} 
                                    fontSize={14} 
                                    placeholderVal={String(profile.distribution)} 
                                    setValue={(val)=> handleValChange(val, index, "distribution")}
                                />
                            </View>
                        </View>
                    );
                })}
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
                <RectangleButton width={100} height={40} fontSize={16} red={true} text="DIVVY CHIP"
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