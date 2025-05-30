export const images = {
    logoWithText: require('../assets/images/LogoWithText.png'),
    premium: require('../assets/images/premium-img.png'),
    baseChip: require('../assets/images/baseChip.png')
}

export const fonts = {
    encodeSans: require('../assets/fonts/Encode Sans SC.ttf'),
    encodeSansBold: require('../assets/fonts/EncodeSansBold.ttf')
};

//func to validify we receive a string that represent
//a valid money value, i.e. 32, 1.3, 2.43, .12
export function validBuyIn (value:string): boolean {
    const regex : RegExp = /^(?:\d+|\d*\.\d{1,2})$/
    const regexMatch = regex.test(value);
  
    //if we get a format match, let's ensure 
    //the value is atleast <= 1
    if (regexMatch && Number(value) >= 1.00) {
      return true;
    }
  
    return false;
}

//map color name to actual color we want
export const colorMap = {
    black: "black",
    yellow: "#8B8000",
    red: "red",
    green: "green",
    purple: "purple",
    orange: "orange",
    white: "black",
    pink: "pink",
    blue: "blue",
    gray: "darkslategray"
}

export const invertedColorMap = Object.fromEntries(
    Object.entries(colorMap).map(([key, value]) => [value, key])
);