export default class Player {
    static id = 0;
    static totalDice = 0;
    static totalRolled = {};
    constructor(game, name="Player") {
        // Initializes the player
        this.active = true;
        this.settings = game.settings;
        this.name = name;
        this.id = Player.id++;
        this.numDice = this.settings.numDice;
        Player.totalDice += this.numDice;
        this.endTurn();
    }
    rollDice() {
        // Rolls the player's dice
        for (let die = 1; die < this.numDice + 1; die++){
            let face = Math.floor(Math.random() * this.settings.faces) + 1;
            this.rolled[face]++;
            Player.totalRolled[face] ? Player.totalRolled[face]++ : Player.totalRolled[face] = 1;
        }
    }
    placeBid(number, face) {
        // Records player's bid
        this.bidNum = number;
        this.bidFace = face;
    }
    loseDie() {
        /* Removes one of the player's dice. If player runs out of dice, 
        flags the player as inactive */
        this.numDice--;
        Player.totalDice--;
        if (this.numDice == 0) {
            this.active = false;
        }
    }
    endTurn() {
        // Turn clean up
        this.rolled = {}
        for (let face = 1; face < this.settings.faces + 1; face++){
            this.rolled[face] = 0;
        }
        this.bidNum = 0;
        this.bidFace = 6;
    }
}