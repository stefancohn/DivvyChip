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

    //high percentage:low val -> low percentage: high val
    var chipProfiles: ChipProfile[] = new Array(diffChips);

    //smallest chip must atleast be the small blind
    var currentVal : number = smallBlind; 
    var currentCentsLeft : number= buyIn;
    
    //initialize each chip profile, assigning it its distribution, amount, and val
    for (var i =0; i < chipProfiles.length; i++) {
        var chipsToUse : number = totalChips * countDistribution[i];

        chipProfiles[i] = { 
            value: currentVal, 
            amount: chipsToUse, 
            distribution: countDistribution[i],
            color: colors[i],
        };

        //calculate value of chip necessary to fill in its distribution
        currentCentsLeft -= (currentVal*chipsToUse);
        if (i!=chipProfiles.length-1) {
            currentVal = currentCentsLeft/(totalChips * countDistribution[i+1]);
        }
    }

    return chipProfiles;
}