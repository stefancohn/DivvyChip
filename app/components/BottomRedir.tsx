import { View } from "react-native";
import RectangleButton from "./rectangleButton";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

type BottomProps = {
    curField: "index" | "divchip" | "payout" | "chiptocash";
};

type TextLink = {
    text : string,
    link : any,
}

const routeText = ["No Bank Payout", "Chip2Cash", "DivChip"]
const routeLink = ["./payout", "./chiptocash", "./divchip"]

export default function Bottom({curField} : BottomProps) {
    const router = useRouter();
    var [routes, setRoutes] = useState<TextLink[]>([{text:"",link:"/"},{text:"",link:"/"}]);

    useEffect(() => {
        if (curField == "index" || curField == "divchip") {
            setRoutes([
                {text: "No Bank\nPayout", link: "./payout"},
                {text: "Chip2Cash", link: "./chiptocash"}
            ]);
        }
        else if (curField == "payout") {
            setRoutes([
                {text: "Chip2Cash", link: "./chiptocash"},
                {text: "DivChip", link: "./divchip"},
            ]);
        }
        else if (curField == "chiptocash") {
            setRoutes([
                {text: "No Bank Payout", link: "./payout"},
                {text: "DivChip", link: "./divchip"},
            ]);
        }
    },[])

    {/* Change page */}
    return (<View style={{flexDirection: "row", justifyContent: "space-evenly", marginTop: 15}}>

        <RectangleButton width={110} height={40} fontSize={15} red={true} text={routes[0].text}
            style={{ marginRight: 5}}
            onPress={()=>router.replace(routes[0].link)
            }
        />
        <RectangleButton width={115} height={40} fontSize={15} red={false} text="Config"
            onPress={()=>router.replace('./config')}
            style={{marginLeft: 5, marginRight: 5}}
        />
        <RectangleButton width={110} height={40} fontSize={15} red={true} text={routes[1].text}
            style={{ marginLeft: 5, }}
            onPress={()=>router.replace(routes[1].link)}
        />

    </View>);
}