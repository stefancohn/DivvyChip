import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useChipContext } from '../components/ChipProvider';
import NumInputBox from '../components/inputBox';
import ChipDisplay from '../components/ChipDisplay';
import { useEffect, useState } from 'react';
import RectangleButton from '../components/rectangleButton';

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

        const updatedProfiles = [...chipProfiles];
        updatedProfiles[i] = {
            ...updatedProfiles[i],
            //brackets mean read var, not literal
            [field]: value
        }

        setChipProfiles(updatedProfiles);
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
                                    fontSize: 12
                                }}>
                                    {profile.color}
                                </Text>
                            </View>

                            <View style={{width:"15%"}}>
                                <NumInputBox 
                                    width={40} 
                                    height={20} 
                                    fontSize={12}
                                    placeholderVal={String((profile.value*.01).toFixed(2))} 
                                    setValue={(val)=> handleValChange(val, index, "value")}
                                />
                            </View>

                            <View style={{width:"15%"}}>
                                <NumInputBox 
                                    width={40}
                                    height={20} 
                                    fontSize={12} 
                                    placeholderVal={String(profile.amount)} 
                                    setValue={(val)=> handleValChange(val, index, "amount")}
                                />
                            </View>

                            <View style={{width:"15%"}}>
                                <NumInputBox 
                                    width={40} 
                                    height={20} 
                                    fontSize={12} 
                                    placeholderVal={String(profile.distribution)} 
                                    setValue={(val)=> handleValChange(val, index, "distribution")}
                                />
                            </View>
                        </View>
                    );
                })}
            </View>

            {/* Bottom Buttons */}
            <View style={{flexDirection: "row", justifyContent: "space-evenly", width: Dimensions.get('window').width, marginTop: 15}}>
                                <RectangleButton width={100} height={40} fontSize={16} red={true} text="NO BANK PAYOUT"
                                    style={{ marginLeft: 10}}
                                />
                                <RectangleButton width={100} height={40} fontSize={16} red={false} text="CONFIG"
                                    onPress={()=>router.push('./config')}/>
                                <RectangleButton width={100} height={40} fontSize={16} red={true} text="DIVVY CHIP"
                                    style={{ marginRight: 10, }}
                                    onPress={()=>router.push('./divchip')}
                                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    tableHeader: {
      fontFamily: "EncodeSansBold",
      color: 'white',
      fontSize: 14
    },
})