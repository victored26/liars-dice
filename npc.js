import Player from './player.js'
import { binCondCumProb } from './probability.js'

export default class NPC extends Player {
    constructor(game, name="Player") {
        super(game, name);
        this.p = 1 / this.settings.faces;
    }
    newTurn() {
        // Rolls NPC's dice and records results in NPC's guesses
        this.rollDice();
        this.guesses = {...this.rolled};
    }
    evaluateBid(lastBid) {
        /* Returns false if NPC thinks the bid should be challenged. 
        Otherwise, the NPC updates their guesses and returns true */
        let number = lastBid['number'], face = lastBid['face'];

        // Compare bid to player's board guesses
        let guess_number = this.guesses[face]
        if (number <= guess_number) {
            return true;
        }

        // Determine conditional probability given NPC assessment
        let condProb = binCondCumProb(Player.totalDice, number, guess_number, this.p);
        condProb += this.settings.bidEvalOffset;

        // Roll a number from 0 to 1 and compare to conditional probability
        if (Math.random() > condProb) {
            return false;
        }

        // Modify NPC guesses to reflect bid being considered plausible
        let addNumber = Math.round(condProb * (number - guess_number));
        this.guesses[face] += addNumber;
        return true;
    }
    makeBid(lastBid) {
        // Simulates the NPC bid determination process 
        let number = lastBid['number']
        let face = lastBid['face'];
        let bidMin = face < this.settings.faces ? number : number + 1;

        // Determine bid number
        let bidNum = this._detBidNum(bidMin);
        let bidFace = this._detBidFace(lastBid, bidNum);
        this.placeBid(bidNum, bidFace);
    }
    _detBidNum(bidMin) {
        // Simulates the NPC bid number determination process
        let bidNum = bidMin
        let multiplier = this.settings.bidNumMultiplier;
        let condProb = binCondCumProb(Player.totalDice, bidNum+1, bidMin, this.p);
        let roll = Math.random()
        while (roll < condProb * multiplier) {
            bidNum++;
            condProb = binCondCumProb(Player.totalDice, bidNum+1, bidMin, this.p);
        }
        //console.log(bidNum);
        return bidNum;
    }
    _detBidFace(lastBid, bidNum) {
        // Simulates the NPC bid face determination process
        let faceMin = bidNum > lastBid['number'] ? 1 : lastBid['face'] + 1;
        for (const [face, number] of Object.entries(this.guesses)) {
            if (Number(number) > bidNum - 1 && Number(face) > faceMin - 1) {
                //console.log(face);
                return Number(face);
            }
        }
        let condProb;
        let roll = Math.random(), maxProb = 0, maxFace = 0;
        for (let face = faceMin; face < this.settings.faces + 1; face++) {
            condProb = binCondCumProb(Player.totalDice, bidNum, this.guesses[face], this.p);
            if (condProb > roll) {
                return face;
            }
            if (condProb > maxProb) {
                maxProb = condProb;
                maxFace = face;
            }
        }
        //console.log(maxFace);
        return maxFace;
    }   
}