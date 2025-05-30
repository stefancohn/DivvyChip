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

var colors : string[] = ["white", "red", "green", "gray", "blue", "orange"]

//algo to split chips!
export function chipDistribution(buyIn : number, diffChips: number, totalChips : number, countDistribution : number[]) {
    //convert to cents
    buyIn*=100;

    //get blind for starting chip
    var smallBlind = buyIn * .01;

    //TODO: code different progression factors
    var progressionFactor = [2,2,1.5, 1.5];

    //high percentage:low val -> low percentage: high val
    var chipProfiles: ChipProfile[] = new Array(diffChips);

    //smallest chip must atleast be the small blind
    var currentVal : number = smallBlind; 
    var currentCentsLeft : number= buyIn;

    //hard code first value as the small blind!
    chipProfiles[0] = {value: currentVal, amount: Math.floor(totalChips*countDistribution[0]), 
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
            currentVal*=progressionFactor[i-1];
            currentCentsLeft-=(chipsToUse*currentVal);
        } else {
            currentVal = currentCentsLeft/chipsToUse;
        }

        //floor 
        currentVal = Math.floor(currentVal);
        chipsToUse = Math.floor(chipsToUse);

        chipProfiles[i] = { 
            value: currentVal, 
            amount: chipsToUse, 
            distribution: countDistribution[i],
            color: colors[i],
        };
    }

    return chipProfiles;
}

//returns all different variations of distribution
export function getDistributionVariants(distribution : number[], diffColors : number) {
    var allVariants : number[][] = [];

    //shallow copy 
    var distributionC = [...distribution];

    allVariants.push([...distributionC]);

    //keep taking away from dist[0] until it reaches
    //0.05
    var counter = 1;
    while(distributionC[0] > 0.05) {
        distributionC[0]-=0.05;
        distributionC[counter]+=0.05;

        //round
        distributionC[0] = Math.round(distributionC[0]*100)/100;
        distributionC[counter] = Math.round(distributionC[counter]*100)/100;

        counter++;
        if (counter>=diffColors) {
            counter=1; 
        }
        allVariants.push([...distributionC]);
    }

    //reverse the list so it is in proper order!
    allVariants.reverse();

    distributionC = [...distribution]; //reset to og arr
    //keep adding to dist[0] until max element reaches .05
    var maxE = diffColors-1;
    var incCounter = maxE;
    while(distributionC[maxE] > 0.05) {
        distributionC[0]+=0.05;
        distributionC[incCounter]-=0.05;

        //round
        distributionC[0] = Math.round(distributionC[0]*100)/100;
        distributionC[incCounter] = Math.round(distributionC[incCounter]*100)/100;

        incCounter--;
        if (incCounter <= 0) {
            incCounter = maxE;
        }
        allVariants.push([...distributionC]);
    }

    return allVariants;
}