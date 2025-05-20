import React, { createContext, useContext, useState } from 'react';
import {ChipProfile} from "../../backend/chipDivsionAlgo";

//we need the buyin and chips to be global
type ChipContextType = {
    buyIn: string;
    setBuyIn: (arg: string) => void;
    
    totalCount : number;
    setTotalCount : (arg : number) => void;

    diffColors : number;
    setDiffColors : (arg : number) => void;

    countDistribution : number[];
    setCountDistribution : (arg : number[]) => void;

    chipProfiles : ChipProfile[];
    setChipProfiles : (arg : ChipProfile[])=>void;
};

//create our context
const ChipContext = createContext<ChipContextType | null>(null);

//create our provider wrapper which initializes our vals
export const ChipProvider = ({ children } : {children : React.ReactNode}) => {
    const [buyIn, setBuyIn] = useState('');
    const [totalCount, setTotalCount] = useState(20);
    const [diffColors, setDiffColors] = useState<number>(2);
    const [countDistribution, setCountDistribution] = useState([.80, .20,0,0,0,0]);
    const [chipProfiles, setChipProfiles] = useState<ChipProfile[]>([]);

    return (
        //when we do <ChipProvider>...</ChipProvider>, everything inbetween is 
        //taken as the paramter. so when we receive it, we just spit back
        //all of the children just wrapped with this for global use
        <ChipContext.Provider value={{buyIn, setBuyIn, totalCount, setTotalCount, 
        diffColors, setDiffColors, countDistribution, setCountDistribution, chipProfiles, setChipProfiles}}>
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