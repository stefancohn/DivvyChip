import { TextInput } from "react-native";

type Props = {
    width : any,
    height : any,
    fontSize: any,
}


export default function InputBox({width, height, fontSize} : Props) {
    return (
        <TextInput
            className="bg-[#D9D9D9]/90 rounded-[0.625rem] p-2 text-center font-EncodeSans"  
            style={{
                boxShadow: "inset 0px 4px 3px 3px rgba(0,0,0,0.25)", 
                fontSize,
                width,
                height,
            }}
        />
    );
}