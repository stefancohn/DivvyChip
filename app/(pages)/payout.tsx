import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import NumInputBox from '../components/inputBox';
import { useState } from 'react';
import RectangleButton from '../components/rectangleButton';
import CircleButton from '../components/CircleButton';
import ChipToCashCalc from './chiptocashcalc';
import { calculatePayouts } from '@/backend/chipDivsionAlgo';
import Bottom from '../components/BottomRedir';
import PremiumButton from '../components/PremiumButton';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const colWidth = "18%"
const rowHeight = 22;
const rowValWidth = "95%"

export type PayoutRow = {
    player : string,
    in : number,
    out: number,
    isOut: boolean,
    net? : number,
}

export type PaymentRow = {
    from : string, 
    to : string, 
    amount : number,
    err? : string,
}

const defaultPayout : PayoutRow[] = [
    {player: "Player 1", in: 0, out: 0, isOut: false}, 
    {player: "Player 2", in: 0, out: 0, isOut: false},
];

export default function Payout() {
    const [payoutRows, setPayoutRow] = useState<PayoutRow[]>(defaultPayout);

    //stateful vars for payout and chip modals
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [chipModal, setChipModal] = useState<boolean>(false);
    const [selectedChipIdx, setSelectedChipIdx] = useState<number>(0);
    const [paymentRows, setPaymentRows] = useState<PaymentRow[]>(new Array<PaymentRow>())
    const [paymentsVisible, setPaymentsVisible] = useState(false);

    const handleValueChange = (value : string|number, i:number, field: "player"|"in"|"out") => {
        //validation
        if (field == "in") {
            if (value==="") return;
            const regex : RegExp = /^(?:\d+|\d*\.\d{1,2})$/
            const regexMatch = regex.test(value.toString());
            if(!regexMatch) {
                alert("Value must be a valid positive decimal or whole number (i.e. 1, 1.32, .21)");
                return;
            }
        }
        else if (field == "out") {
            if (value==="") return;
            const regex : RegExp = /^-?(?:\d+|\d*\.\d{1,2})$/
            const regexMatch = regex.test(value.toString());
            if(!regexMatch) {
                alert("Value must be a valid decimal or whole number (i.e. 1, 1.32, .21)");
                return;
            }
        }

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

    const handleChip2CashPress = function(index:number) {
        setSelectedChipIdx(index);
        setChipModal(true);
    }

    //once payout gets pressed, calculate the payout rows
    const handlePayout = function() {
        var oneOut : boolean = false;
        payoutRows.forEach(row => {
            if (row.isOut) {
                oneOut = true;
                return;
            }
        });

        if (oneOut) {
            setModalVisible(false);
            setPaymentRows(calculatePayouts(payoutRows));
            setPaymentsVisible(true);
        }
    }

    return(
        <>
        <PremiumButton/>
        

        <View style={{alignItems: "center",}}>
            {/* INITIAL PAYOUTS */}
            {!paymentsVisible && (
            <Animated.View
                entering={FadeIn.duration(500)}
                exiting={FadeOut.duration(500)}
                layout={FadeIn.springify()}
            >
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
                                alignItems: "center",
                                justifyContent:"center"
                            }}>

                                {/* player Field */}
                                <View style={{width: colWidth, padding: 5}}>
                                    <NumInputBox 
                                        isDecimal={false} 
                                        width={rowValWidth}
                                        height={rowHeight} 
                                        fontSize={12}
                                        placeholderVal={row.player}
                                        onBlur={(value:any) => handleValueChange(value, index, "player")}
                                    />
                                </View>

                                {/* in Field */}
                                <View style={{width: colWidth, padding: 5}}>
                                    <NumInputBox
                                        width={rowValWidth}
                                        height={rowHeight} 
                                        fontSize={12}
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
                                                fontSize={12}
                                                placeholderVal={String(row.out)}
                                                onBlur={(value:any) => handleValueChange(value, index, "out")}
                                            />
                                        </View>

                                        <View style={{flex:1}}>
                                            <CircleButton 
                                                height={24} 
                                                width={24} 
                                                fontSize={8} 
                                                text={"chip2cash"} 
                                                onPress={()=> handleChip2CashPress(index)}
                                            />
                                        </View>

                                    </View>

                                </View>

                                {/* net Field */}
                                <View style={{width: colWidth,padding:5}}>
                                    <Text style={{
                                        fontSize: 15,
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
                    <RectangleButton width={130} height={50} fontSize={36} text="GO" style={{}}
                        onPress={()=>setModalVisible(true)}
                    />
                </View>
            </Animated.View>)}
            

            {/* //
            PAYMENTS VIEW
            // */}
            {paymentsVisible && (
                <Animated.View
                    entering={FadeIn.duration(500)}
                    exiting={FadeOut.duration(500)}
                    layout={FadeIn.duration(500)}
                    style={{
                        //backgroundColor: "#EAEAEA",
                        borderRadius: 10,
                        padding: 10,
                        gap: 16,
                        marginTop: 55,
                        alignItems:"center"
                    }}
                >
                    <Text 
                        style={{
                            fontSize: 30,
                            fontFamily: "EncodeSansBold",
                            marginBottom: 10,
                            textAlign: 'center',
                            color: "white",
                        }}
                    >
                        Payments
                    </Text>

                    {paymentRows.map((payment, i)=>(
                        /* Each row in table */
                        <View key={i} style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            padding: 12,
                            backgroundColor: "#EAEAEA",
                            borderRadius: 8,
                            gap: 50
                        }}>
                            <Text style={{fontFamily: "EncodeSans", fontSize: 16}}>
                                {payment.from} → {payment.to}
                            </Text>

                            <Text style={{ fontFamily: "EncodeSansBold", fontSize: 16 }}>
                                ${payment.amount.toFixed(2)}
                            </Text>
                        </View>
                    ))}

                    <TouchableOpacity onPress={()=>{
                        setPayoutRow(defaultPayout);
                        setPaymentsVisible(false);
                        setPaymentRows(new Array<PaymentRow>());
                    }}>
                        <Text style={{
                            fontSize:20,
                            fontFamily:"EncodeSansBold",
                            textDecorationLine:"underline",
                            color:"#CBCBCB",
                            marginTop: 20,
                        }}>
                            Reset
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
            
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
                                        backgroundColor: (row.isOut ? "black" : "#E5E5E5"),
                                        borderRadius: 10,
                                    }}>
                                        <Text style={{fontFamily: "EncodeSans", fontSize: 15, padding: 5, color: row.isOut ? "white":"black"}}>
                                            {String(row.player)}
                                        </Text>
                                    </View>

                                    <Text style={{fontFamily: "EncodeSans", fontSize: 15, color: netColor(row.in, row.out)}}>
                                        {String((row.out - row.in).toFixed(2))}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}

                        <TouchableOpacity style={{backgroundColor: "white",borderRadius: 10,}} onPress={allOut}>
                            <Text style={{padding:5, fontSize: 15, fontFamily: "EncodeSansBold"}}>
                                All
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=>handlePayout()}>
                            <Text style={{padding:5, fontSize: 25, fontFamily: "EncodeSansBold", color: "green", textDecorationLine: "underline"}}>
                                Payout
                            </Text>
                        </TouchableOpacity>

                    </Pressable>
                </Pressable>
            </Modal>

            <ChipToCashCalc visible={chipModal} setVisible={setChipModal} payoutRow={payoutRows} setPayoutRow={setPayoutRow} index={selectedChipIdx}/>

            <View style={{marginTop:25}}>
                <Bottom curField='payout'/>
            </View>
        </View>
        </>
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