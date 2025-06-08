import { PayoutRow, PaymentRow } from "@/app/(pages)/payout";

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