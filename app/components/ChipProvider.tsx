import React, { createContext, useContext, useState } from 'react';

//we need the buyin and chips to be global
type ChipContextType = {
    buyIn: string;
    chips: number[];
    setBuyIn: (arg: string) => void;
    setChips: (arg: number[]) => void;
};

//create our context
const ChipContext = createContext<ChipContextType | null>(null);

//create our provider wrapper which initializes our vals
export const ChipProvider = ({ children } : {children : React.ReactNode}) => {
    const [buyIn, setBuyIn] = useState('');
    const [chips, setChips] = useState<number[]>([]);

    return (
        //when we do <ChipProvider>...</ChipProvider>, everything inbetween is 
        //taken as the paramter. so when we receive it, we just spit back
        //all of the children just wrapped with this for global use
        <ChipContext.Provider value={{buyIn, chips, setBuyIn, setChips}}>
            {children}
        </ChipContext.Provider>
    )
}

//custom func to handle use w/o provider
export const useChipContext = () => {
    const context = useContext(ChipContext);
    if (!context) throw new Error('useChipContext must be used within ChipProvider');
    return context;
};