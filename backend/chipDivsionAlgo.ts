/*
5 Dollar Buy in:
5 * 0.05
5 * 0.1
7 * 0.25
5 * 0.50

5c 10c blinds
*/
export interface ChipProfile {
    value: number;
    amount: number;
    distribution: number;
    color: string;
}

//for when a user selects a screen that displays chips
//without entering a buy-in 
function defaultChipProfileInit() : ChipProfile[] {
    return [
        { value: 1, amount: 1, distribution: 1, color: "white" },
    ];
}

var colors : string[] = ["white", "red", "green", "black", "blue", "orange"]

//algo to split chips!
export function chipDistribution(buyIn : number, diffChips: number, totalChips : number, countDistribution : number[]) {
    //convert to cents
    buyIn*=100;

    //get blind for starting chip
    var smallBlind = buyIn * .01;

    //TODO: code different progression factors
    var progressionFactor = 6;

    //high percentage:low val -> low percentage: high val
    var chipProfiles: ChipProfile[] = new Array(diffChips);

    //smallest chip must atleast be the small blind
    var currentVal : number = smallBlind; 
    var currentCentsLeft : number= buyIn;

    //hard code first value as the small blind!
    chipProfiles[0] = {value: currentVal, amount: (totalChips*countDistribution[0]), 
        distribution: countDistribution[0], color: colors[0]}
    currentCentsLeft -= (chipProfiles[0].amount*chipProfiles[0].value);
    
    //initialize each chip profile, assigning it its distribution, amount, and val
    for (var i =1; i < chipProfiles.length; i++) {
        var chipsToUse : number = totalChips * countDistribution[i];

        //calculate value of chip necessary to fill in its distribution
        //get amount of cents that chips has to fill, i.e. 
        //if a chip should be 15% of the chips, it should fill 
        //15% of the total buyin amount
        if (i!=chipProfiles.length-1) {
            currentVal*=progressionFactor;
            currentCentsLeft-=(chipsToUse*currentVal);
        } else {
            currentVal = currentCentsLeft/chipsToUse;
        }

        chipProfiles[i] = { 
            value: currentVal, 
            amount: chipsToUse, 
            distribution: countDistribution[i],
            color: colors[i],
        };
    }

    return chipProfiles;
}