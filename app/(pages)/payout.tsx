import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput, Modal, Pressable } from 'react-native';
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
    isOut: boolean,
}

export default function Payout() {
    const [payoutRows, setPayoutRow] = useState<PayoutRow[]>([
        {player: "Player 1", in: 0, out: 0, isOut: false}, 
        {player: "Player 2", in: 0, out: 0, isOut: false}
    ]);

    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const handleValueChange = (value : string|number, i:number, field: "player"|"in"|"out") => {
        var newRows = [...payoutRows];
        newRows[i]= {
            ...newRows[i],
            [field]: value
        };
        setPayoutRow(newRows);
    }

    const removePlayer = function (){
        
        var newRows = [...payoutRows];
        newRows.pop();

        setPayoutRow(newRows);
    }

    const addPlayer = function () {
        //limit
        if (payoutRows.length >= 10) {
            alert("Max players");
            return;
        }

        var newRows=[...payoutRows];

        var proposedRow : PayoutRow = {
            player: "Player " + (newRows.length+1),
            in: 0.00,
            out: 0.00,
            isOut: false
        };

        newRows.push(proposedRow);

        setPayoutRow(newRows);
    }

    //return green on pos, red on neg, and black on 0
    const netColor = function (inn : any, out : any) {
        if ((out - inn) < 0) {
            return "red";
        } else if ((out-inn) > 0) {
            return "green";
        }
        return "black";
    }

    const allOut = ()=> {
        setPayoutRow(payoutRows.map((row : PayoutRow) => ({ ...row, isOut: true })))
    }

    //flip whether a player is out or not
    const onPlayerTap = (index : number) => {
        var newRows = [...payoutRows];

        newRows[index].isOut = !newRows[index].isOut;

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
                                    {String((row.out - row.in).toFixed(2))}
                                </Text>
                            </View>

                        </View>
                    );
                })}

            </View>
            
            {/* Add or Remove Row */}
            <View style={{alignItems: "center", justifyContent: "center", marginTop: -10}}>
                <View style={{flexDirection: "row", gap: 70, alignItems:"center", justifyContent: "center"}}>
                    <TouchableOpacity onPress={removePlayer}>
                        <Text style={{
                            color: "red",
                            textAlignVertical:"center",
                            fontFamily: "EncodeSansBold", 
                            fontSize: 60,
                            textAlign: "center",
                            shadowColor: "red",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.9,
                            shadowRadius: 12,
                        }}>
                            -
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={addPlayer}>
                        <Text style={{
                            fontFamily: "EncodeSansBold", 
                            fontSize: 60, 
                            color: "green", 
                            textAlignVertical:"center",
                            textAlign: "center",
                            shadowColor: "green",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.9,
                            shadowRadius: 12,
                        }}>
                            +
                        </Text>
                    </TouchableOpacity>

                </View>

                {/* GO button, modal appears asking who is out */}
                <RectangleButton width={150} height={70} fontSize={40} text="GO" style={{}}
                    onPress={()=>setModalVisible(true)}
                />
            </View>
            
            {/* Modal that asks user who is out */}
            <Modal
                animationType='slide'
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable 
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        flex:1,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                    }}
                    onPress={()=> setModalVisible(false)}
                >
                    <Pressable 
                        style={{
                            backgroundColor:"#D9D9D9", 
                            opacity: .9, 
                            flexDirection: "column", 
                            alignItems:"center",
                            width: "75%",
                            borderRadius: 10,
                            padding: 10,
                            gap: 10,
                        }}
                        onPress={()=>{}}
                    >
                        <Text style={{
                            fontFamily: "EncodeSansBold",
                            fontSize: 20,
                            marginBottom: 5,
                            textAlign: "center"
                        }}>
                            Tap On Who Is Out
                        </Text>

                        {payoutRows.map((row, index) => {
                            return(
                                <TouchableOpacity key={index} style={{flexDirection: "row",alignItems: "center",gap: 15}} 
                                    onPress={() => onPlayerTap(index)}
                                >
                                    <View style={{
                                        backgroundColor: (row.isOut ? "#C3D7CB" : "#E5E5E5"),
                                        borderRadius: 10,
                                    }}>
                                        <Text style={{fontFamily: "EncodeSans", fontSize: 15, padding: 5}}>
                                            {String(row.player)}
                                        </Text>
                                    </View>

                                    <Text style={{fontFamily: "EncodeSans", fontSize: 15, color: netColor(row.in, row.out)}}>
                                        {String((row.out - row.in).toFixed(2))}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}

                        <TouchableOpacity style={{backgroundColor: "#E5E5E5",borderRadius: 10,}} onPress={allOut}>
                            <Text style={{padding:5, fontSize: 15, fontFamily: "EncodeSans"}}>
                                All
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=>console.log("")}>
                            <Text style={{padding:5, fontSize: 17, fontFamily: "EncodeSansBold", color: "green", textDecorationLine: "underline"}}>
                                Payout
                            </Text>
                        </TouchableOpacity>

                    </Pressable>
                </Pressable>
            </Modal>

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