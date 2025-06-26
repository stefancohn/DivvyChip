import { PayoutRow, PaymentRow } from "@/app/(pages)/payout";
import {positiveValueFill, valueChange} from './solver'

export interface ChipProfile {
    value: number;
    amount: number;
    distribution: number;
    color: string;
}

var colors : string[] = ["white", "red", "green", "gray", "blue", "orange"]


//algo to split chips!
export function chipDistribution1(buyIn : number, diffChips: number, totalChips : number, 
    countDistribution : number[], progressionFactor : number[], smallBlind : number):ChipProfile[]{
        //when our preset does not land us what we need
        function amountFill(): Boolean {
            const coeffs: number[] = chipProfiles.map(prof => prof.value);
            const addChips = currentTotal < buyIn;
            
            let result;
            
            // Calculate minimum chips needed for each denomination
            const minChips = chipProfiles.map(prof => Math.max(1, Math.floor(prof.amount * 0.3))); // Keep at least 30% of original chips
            
            if (addChips) {
                const target: number = buyIn - currentTotal;
                result = positiveValueFill(target, coeffs, undefined, minChips);
            } else {
                const currentAmounts = chipProfiles.map(prof => prof.amount);
                const maxRemovable = currentAmounts.map((amount, i) => 
                    Math.max(0, amount - minChips[i])
                );
                
                const target: number = (buyIn - currentTotal) * -1;
                result = positiveValueFill(target, coeffs, maxRemovable, Array(coeffs.length).fill(0));
            }
        
            if (result) {
                for (const key in result) {
                    const idx = Number(key.slice(1));
                    const change = Math.floor(result[key]); // Ensure whole numbers
                    
                    // Verify the change won't reduce below minimum
                    if (addChips || (chipProfiles[idx].amount - change >= minChips[idx])) {
                        chipProfiles[idx].amount += addChips ? change : -change;
                    }
                }
                return true;
            }
        
            return false;
        }
    
        //convert to cents
        buyIn*=100;

        //high percentage:low val -> low percentage: high val
        var chipProfiles: ChipProfile[] = new Array(diffChips);
    
        //smallest chip must atleast be the small blind
        var currentVal : number = smallBlind; 
        var currentCentsLeft : number= buyIn;
    
        //hard code first value as the small blind!
        chipProfiles[0] = {value: Math.floor(currentVal), amount: Math.floor(totalChips*countDistribution[0]), 
            distribution: countDistribution[0], color: colors[0]}
    
        currentCentsLeft -= (chipProfiles[0].amount*chipProfiles[0].value);
        
        var currentTotal = chipProfiles[0].value*chipProfiles[0].amount;
        var currentAmount = chipProfiles[0].amount;
        //initialize each chip profile, assigning it its distribution, amount, and val
        //based on preset
        for (var i =1; i < chipProfiles.length; i++) {
            var chipsToUse : number = totalChips * countDistribution[i];
    
            currentVal*=progressionFactor[i];
            currentVal = Math.round(currentVal*100)/100
            currentCentsLeft-=(chipsToUse*currentVal);
    
            //floor 
            currentVal = Math.floor(currentVal);
            chipsToUse = Math.floor(chipsToUse);
    
            chipProfiles[i] = { 
                value: currentVal, 
                amount: chipsToUse, 
                distribution: countDistribution[i],
                color: colors[i],
            };
    
            currentTotal += currentVal * chipsToUse;
            currentAmount += chipsToUse;
        }
    
        //once preset is done we are going to fix
        //if currenttotal and buyin not synced
        var couldFill : Boolean = true;
        if (currentTotal != buyIn) {
            couldFill = amountFill();
        }
    
        //if we could not fill 
        //run algorithm to see if we can change cent values
        if (!couldFill) {
            if (currentAmount != totalChips) {
                var amountError = totalChips - currentAmount;
                chipProfiles[0].amount+=amountError;
            }
    
            var nums : number[] = chipProfiles.map((val)=>val.amount);
            var coeffs : number[] = chipProfiles.map((val)=>val.value);
            var valChange = valueChange(nums, coeffs, buyIn);
    
            if (valChange) {
                for (const key in valChange) {
                    var idx = key.slice(1, key.length);
                    var numericIdx = Number(idx);
                    
                    chipProfiles[numericIdx].value = valChange[key];
                }
            } else {
                chipProfiles[0].color = "null";
            }
        }
    
        return chipProfiles;
    }

const defCountDistributions : number[][][] = [
    [
        [0.85, 0.15, 0, 0, 0, 0],
        [0.80, 0.20, 0, 0, 0, 0],
        [0.75, 0.25, 0, 0, 0, 0],
        [0.70, 0.30, 0, 0, 0, 0],
    ],
    [
        [0.55, 0.35, 0.1, 0, 0, 0],
        [0.6, 0.3, 0.1, 0, 0, 0],
        [0.5, 0.35, 0.15, 0, 0, 0],
        [0.65, 0.25, 0.1, 0, 0, 0],
    ],
    [
        [0.40, 0.30, 0.20, 0.10, 0, 0],
        [0.35, 0.35, 0.2, 0.1, 0, 0],
        [0.30, 0.30, 0.25, 0.15, 0, 0],
        [0.35, 0.30, 0.20, 0.15, 0, 0],
        [0.40, 0.25, 0.20, 0.15, 0, 0],
        [0.30, 0.30, 0.25, 0.15, 0, 0],
    ],
    [
        [.4, .25, 0.15,0.12,0.08,0],
        [0.30, 0.25, 0.20, 0.15, 0.10, 0],
        [0.45, 0.25, 0.15, 0.10, 0.05, 0],
        [0.25, 0.20, 0.20, 0.20, 0.15, 0],
        [0.38, 0.22, 0.20, 0.12, 0.08, 0],
        [0.30, 0.25, 0.20, 0.15, 0.10, 0],
        [0.35, 0.25, 0.20, 0.12, 0.08, 0],
        [0.25, 0.25, 0.25, 0.15, 0.10, 0],
    ],
]



//going to try 3-5 different count distributions with 2-3 different progression factors 
//begin building solution - look for one that fits buyin and totalchips the best
//if no solution found find closest to the desired buyin and chiptotal and sanity check it
export function calculateChipProfiles(buyIn : number, diffChips: number, totalChips : number,) : ChipProfile[] {
    function calculateProgressionFactor() : number[] {
        if (diffChips <= 2) {
            return [1, 2];
        } else if (diffChips <=3) {
            return [1, 2, 2];
        }
        else {
            return [1,2,2,1.5, 1.5, 1.5];
        } 
    }

    function calculateSmallBlind() : number{
        // Base calculation from buy-in
        let sbPercentage: number;
        if (diffChips <= 3) {
            sbPercentage = 0.05; // 5% of buy-in
        } else {
            sbPercentage = 0.025; // 2.5% of buy-in
        } 
        // Adjust based on total chips
        const chipAdjustment = Math.max(0.1, Math.min(1, 50 / totalChips));
        
        // Calculate initial small blind
        let smallBlind = (centBuyIn * sbPercentage * chipAdjustment);

        // Ensure minimum and maximum values
        const minValue = 1; // Minimum 1 cent
        const maxValue = centBuyIn * 0.1; // Maximum 10% of buy-in
        
        // Clamp the small blind between min and max values
        smallBlind = Math.max(minValue, Math.min(maxValue, smallBlind));
        
        // Round to nearest cent
        return Math.floor(smallBlind);
    }; 

    const countDistrbutions = defCountDistributions[diffChips-2];
    var progressionFactor = calculateProgressionFactor();
    var centBuyIn : number = buyIn*100;

    //different smallblinds for different prog factors
    var sb = calculateSmallBlind();
    var smallBlinds : number[] = Array();
    smallBlinds.push(sb);
    smallBlinds.push(sb+0.005);
    smallBlinds.push(sb-0.005);

    var solutions : ChipProfile[][] = new Array();

    var noSol : ChipProfile[] = new Array();

    var buyInDiff = Number.MAX_VALUE;
    var totalDiff = Number.MAX_VALUE;
    var solutionsPushed = 0;

    //iterate over distributions
    for (var i = 0; i < countDistrbutions.length; i++) {
        for (var k = 0; k < smallBlinds.length; k++) {
            var currentProfs = chipDistribution1(buyIn, diffChips, totalChips, countDistrbutions[i], progressionFactor, smallBlinds[k]);

            //check current solution
            var curBuyIn = 0;
            var curTotal = 0;
            for (var j = 0; j < currentProfs.length; j++) {
                curTotal += currentProfs[j].amount;
                curBuyIn += (currentProfs[j].amount*currentProfs[j].value);
            }

            //if its at desired buyIn and total return, else lets give it rank
            if (curBuyIn == centBuyIn && curTotal == totalChips) return currentProfs
            else {
                //no sol found
                if (currentProfs[0].color == "null") {
                    noSol = currentProfs;
                    continue;
                }

                var curBuyInDiff = Math.abs(centBuyIn - curBuyIn);
                var curTotalDiff = Math.abs(totalChips - curTotal);

                //if we have a total chips and buyin <= diffs, update best sol
                if (curTotalDiff <= totalDiff && curBuyInDiff < buyInDiff) {
                    solutions.push(currentProfs);
                    solutionsPushed++;
                }
            }
        }
    }

    if (solutions[solutionsPushed-1] == null) return noSol;
    return solutions[solutionsPushed-1];
}


//function to calculate how a set of players should 
//pay each other once they want to cashout 
export function calculatePayouts(players : PayoutRow[]) : PaymentRow[] {
    var playersC : PayoutRow[] = [...players];
    var outPlayers : Set<string> = new Set<string>();

    //we are going to bruteforce our solution since we only have 10 players max
    //debt will be represented by positive nums
    var totalDebt : number = 0;
    var totalCredit : number = 0;

    //deep coppies
    //the debtors are the weights
    //the creditors are the buckets
    var debtors : PayoutRow[] = new Array<PayoutRow>();
    var creditors : PayoutRow[] = new Array<PayoutRow>();
    
    //first calculate net for each player
    playersC.forEach((player) => {
        if (player.isOut) outPlayers.add(player.player);

        player.net = (player.out - player.in);

        if (player.net < 0) { 
            player.net*=-1;
            debtors.push(player);
            totalDebt+=player.net;
        } else {
            creditors.push(player);
            totalCredit+=player.net;
        }
    })

    var payments : PaymentRow[] = new Array<PaymentRow>();

    //not enough credit for debt check
    if (totalCredit < totalDebt) {
        payments.push({
            from: "",
            to: "",
            amount: 0,
            err: "Not enough credit for debt",
        })
        return payments;
    }

    //sort creditors, debitors descending
    creditors.sort((p1, p2) => {return (p2.net! - p1.net!);})
    debtors.sort((p1, p2) => {return (p2.net! - p1.net!);})

    //start assigning creditors for debtors
    for (var i = 0; i < debtors.length; i++) {

        //see if we can fit debtor into creditor directly no split
        if (debtors[i].net! <= creditors[0].net!) {
            payments.push({
                from: debtors[i].player,
                to: creditors[0].player,
                amount: debtors[i].net!,
            });

            //subtract debt from credit, remove creditor
            creditors[0].net! -= debtors[i].net!;

            //if there was a perfect match, remove that creditor
            if (creditors[0].net! <= 0) {
                creditors.splice(0, 1); 
            }

            creditors.sort((p1,p2) => {return (p2.net!-p1.net!)})
            continue;
        }

        //else we must split payment among creditors
        for (var j = 0; j < creditors.length; j++) {
            var paymentAmt : number = 0;
            var debtDepleted : boolean = false;
            var creditDepleted : boolean = false;

            //more debt than credit, need to spill
            if (debtors[i].net! > creditors[j].net!) {
                paymentAmt = creditors[j].net!
                creditors[j].net = 0;
                creditDepleted = true;
            } 
            //more credit than debt or credit = debt
            else {
                paymentAmt = debtors[i].net!;
                creditors[j].net = 0;
                debtDepleted = true;
            }

            var newPayment : PaymentRow = {
                from: debtors[i].player,
                to: creditors[j].player,
                amount: paymentAmt,
            };
            payments.push(newPayment);

            debtors[i].net! -= paymentAmt; 

            if (creditDepleted) {continue;}
            if (debtDepleted) break;
        }
        //sort afterwards to ensure algorithm still valid
        creditors.sort((p1,p2) => {return (p2.net!-p1.net!)})
    }

    //only return payments that hold people that are willing to cash out
    payments = payments.filter(payment => outPlayers.has(payment.from) || outPlayers.has(payment.to));

    return payments;
}