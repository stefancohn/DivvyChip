import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { defDistributions, useChipContext } from '../components/ChipProvider';
import NumInputBox from '../components/inputBox';
import { useEffect, useState } from 'react';
import RectangleButton from '../components/rectangleButton';
import CircleButton from '../components/CircleButton';
import { chipDistribution, getDistributionVariants} from '@/backend/chipDivsionAlgo';
import { colorMap } from '@/backend/constants';

const colWidth = "18%"
const rowHeight = 22;
const rowValWidth = "95%"

type PayoutRow = {
    player : string,
    in : number,
    out: number,
}

export default function Payout() {
    const [payoutRows, setPayoutRow] = useState<PayoutRow[]>([
        {player: "Player 1", in: 0, out: 0,}, 
        {player: "Player 2", in: 0, out: 0,}
    ]);

    const handleValueChange = (value : string|number, i:number, field: "player"|"in"|"out") => {
        var newRows = [...payoutRows];
        newRows[i]= {
            ...newRows[i],
            [field]: value
        };
        setPayoutRow(newRows);
    }

    return(
        <View style={{alignItems: "center",}}>
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
                    No Bank Payout
                </Text>
                <Text style={{
                    fontSize: 17, 
                    color: "gray", 
                    fontFamily: "EncodeSans",
                    textAlign: "center",
                }}>
                    Enter Player, In, & Out
                </Text>
            </View>

            {/* Middle Table */}
            <View style={{alignItems: "center", marginTop: 20}}>

                {/* Header Row */}
                <View style={{
                    flexDirection: "row",
                    gap: 20,
                    margin: 10,
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <View style={{width: colWidth, }}>
                        <Text style={styles.tableHeader}>
                            Player
                        </Text>
                    </View>

                    <View style={{width: colWidth, }}>
                        <Text style={styles.tableHeader}>
                            In
                        </Text>
                    </View>

                    <View style={{width: colWidth}}>
                        <Text style={styles.tableHeader}>
                            Out
                        </Text>
                    </View>

                    <View style={{width: colWidth}}>
                        <Text style={styles.tableHeader}>
                            Net
                        </Text>
                    </View>

                </View>

                {/* Each Player Row */}
                {payoutRows.map((row, index) => {
                    return(
                        <View key={index} style={{
                            backgroundColor: "#C8C8C8", 
                            borderRadius: 10, 
                            flexDirection: "row", 
                            gap:20, 
                            marginBottom:5,
                            alignItems: "center"
                        }}>

                            {/* player Field */}
                            <View style={{width: colWidth, padding: 5}}>
                                <NumInputBox 
                                    isDecimal={false} 
                                    width={rowValWidth}
                                    height={rowHeight} 
                                    fontSize={16}
                                    placeholderVal={row.player}
                                    onBlur={(value:any) => handleValueChange(value, index, "player")}
                                />
                            </View>

                            {/* in Field */}
                            <View style={{width: colWidth, padding: 5}}>
                                <NumInputBox
                                    width={rowValWidth}
                                    height={rowHeight} 
                                    fontSize={16}
                                    placeholderVal={String(row.in)}
                                    onBlur={(value:any) => handleValueChange(value, index, "in")}
                                />
                            </View>

                            {/* out Field */}
                            <View style={{width: colWidth, paddingTop:5, paddingBottom:5,}}>
                                <View style={{flex:1, flexDirection: "row", alignItems: "center",}}>
                                    <View style={{flex:8}}>
                                        <NumInputBox
                                            width={"100%"}
                                            height={rowHeight} 
                                            fontSize={16}
                                            placeholderVal={String(row.out)}
                                            onBlur={(value:any) => handleValueChange(value, index, "out")}
                                        />
                                    </View>

                                    <View style={{flex:1}}>
                                        <CircleButton height={24} width={24} fontSize={8} text={"chip2cash"}/>
                                    </View>

                                </View>

                            </View>

                            {/* net Field */}
                            <View style={{width: colWidth,padding:5}}>
                                <Text style={{
                                    width: rowValWidth,
                                    height: rowHeight,
                                    fontSize: 16,
                                }}>
                                    {String((row.in - row.out).toFixed(2))}
                                </Text>
                            </View>

                        </View>
                    );
                })}

            </View>
            
            {/* Add or Remove Row */}
            <View>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    tableHeader: {
      fontFamily: "EncodeSans",
      color: 'white',
      fontSize: 20,
      textAlign: "left",
    },
    rowText: {
        fontFamily: "EncodeSansBold",
        color: 'black',
        fontSize: 18,
        textAlign: "left",

    },
})