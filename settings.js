export default class Settings {
    constructor() {
        // Game Settings
        this.numDice = 5;
        this.faces = 6;

        // Game Images
        this.dieImages = {
            1: "./images/die/face_one.png",
            2: "./images/die/face_two.png",
            3: "./images/die/face_three.png",
            4: "./images/die/face_four.png",
            5: "./images/die/face_five.png",
            6: "./images/die/face_six.png"
        };
        this.portraits = {
            1: "./images/npc_x/one.PNG",
            2: "./images/npc_x/two.PNG",
            3: "./images/npc_x/three.PNG",
            4: "./images/npc_x/four.PNG",
            5: "./images/npc_x/five.PNG",
            6: "./images/npc_x/six.PNG",
            7: "./images/npc_x/seven.PNG",
            8: "./images/npc_x/eight.PNG",
        }
        this.diceLeft = {
            1: "./images/npc_1/die.png",
            2: "./images/npc_2/die.png",
            3: "./images/npc_3/die.png"
        }

        // NPC Behaviour Settings
        this.bidEvalOffset = 0.1;
        this.bidNumMultiplier = 1;

        // Game Statements
        this.faceNames = {
            1: "one",
            2: "two",
            3: "three",
            4: "four",
            5: "five",
            6: "six"
        }
        this.statements = {
            'singleBid': "PLAYER: There is NUM FACE",
            'pluralBid': "PLAYER: There are NUM FACE",
            'challenge': "CHALLENGER challenges BIDDER's bid",
            'trueBid': "The bid was not false",
            'falseBid': "The bid was false",
            'lostDie': "PLAYER loses a die",
            'leavesTable': "PLAYER has lost all their dice. They leave the table",
            'win': "You are the only player left on the table. You win!",
            'lost': "You have lost all your dice. You lose."
        }
    }
}