import { useState } from "react";
import { Keyboard, TextInput, View } from "react-native";

type Props = {
    width : any,
    height : any,
    fontSize: any,
    setValue?: (arg? : any) => void,
    placeholderVal?: any;
}


export default function NumInputBox({width, height, fontSize, setValue, placeholderVal} : Props) {
    const [focused, setFocused] = useState(true);
    
    {/* Wrap in this to get inside border */}
    return (
        <View className="p-[2px] bg-[#FF0000]/70 rounded-[0.625rem]">
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
                        setValue(text);
                    }
                }}
                placeholder={placeholderVal && focused ? placeholderVal : ""}
                placeholderTextColor={"black"}
                onFocus={() => setFocused(false)}
                onBlur={() => setFocused(true)}
            />
        </View>
    );
}