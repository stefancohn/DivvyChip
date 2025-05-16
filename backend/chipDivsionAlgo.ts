/*
5 Dollar Buy in:
5 * 0.05
5 * 0.1
7 * 0.25
5 * 0.50

5c 10c blinds
*/
class ChipProfile {
    value: number;
    amount: number;
    distribution: number;

    constructor(value:number,amount:number,distribution:number) {
        this.value = value;
        this.amount = amount;
        this.distribution = distribution;
    }
}

//algo to split chips!
export function chipDistribution(buyIn : number, diffChips: number, totalChips : number, countDistribution : number[]) {
    //convert to cents
    buyIn*=100;

    //get blinds
    var smallBlind = buyIn * .01;
    var bigBlind = smallBlind * 2;

    var progessionFactor = 8;
    //TODO: code different progression factors

    //high percentage:low val -> low percentage: high val
    var chipProfiles: ChipProfile[] = new Array(diffChips);
    
    //initialize each chip profile, assigning it its distribution, amount, and val 
    for (var i =0; i < chipProfiles.length; i++) {
        //chipProfiles[i] = new ChipProfile(0, ,countDistribution[i]);
    }
}