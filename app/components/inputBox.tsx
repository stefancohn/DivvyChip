import { Keyboard, TextInput, View } from "react-native";

type Props = {
    width : any,
    height : any,
    fontSize: any,
    value: any,
    setValue: (arg : any) => void,
}


export default function NumInputBox({width, height, fontSize, value, setValue} : Props) {
    {/* Wrap in this to get inside shadow */}
    return (
        <View className="p-[2px] bg-[#FF0000]/70 rounded-[0.625rem]">
            <TextInput
                className="bg-[#D9D9D9]/90 rounded-[0.625rem] p-2 text-center font-EncodeSans"  
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
                    setValue(text);
                }}
            />
        </View>
    );
}