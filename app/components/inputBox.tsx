import { useState } from "react";
import { Keyboard, TextInput, View } from "react-native";

type Props = {
    width : any,
    height : any,
    fontSize: any,
    setValue?: (arg? : any, index? : number) => void,
    placeholderVal?: any;
    onBlur? : any;
    index? : number;
}


export default function NumInputBox({width, height, fontSize, setValue, placeholderVal, onBlur, index} : Props) {
    const [focused, setFocused] = useState(true);
    const [input, setInput] = useState("");
    
    {/* Wrap in this to get inside border */}
    return (
        <View className="p-[2px] bg-[#FF0000]/70 rounded-[0.625rem]" style={{}}>
            <TextInput
                className="bg-[#D9D9D9]/90 rounded-[0.625rem] p-0 text-center font-EncodeSans"  
                style={{
                    boxShadow: "inset 0px 4px 3px 3px rgba(0,0,0,0.25)", 
                    fontSize,
                    width,
                    height,
                }}
                keyboardType="numeric"
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
                onChangeText={(text) => {
                    if (setValue) {
                        setValue(text, index);
                    } 
                    setInput(text);
                }}
                placeholder={placeholderVal && focused ? placeholderVal : ""}
                placeholderTextColor={"black"}
                onFocus={() => setFocused(false)}
                onBlur={() => {
                    setFocused(true);
                    if (onBlur) {
                        onBlur(input);
                    }
                }}
            />
        </View>
    );
}