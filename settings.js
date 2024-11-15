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
            1: "./images/NPC_X/one.png",
            2: "./images/NPC_X/two.png",
            3: "./images/NPC_X/three.png",
            4: "./images/NPC_X/four.png",
            5: "./images/NPC_X/five.png",
            6: "./images/NPC_X/six.png",
            7: "./images/NPC_X/seven.png",
            8: "./images/NPC_X/eight.png",
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