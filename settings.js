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
            1: "./images/NPC_X/one.PNG",
            2: "./images/NPC_X/two.PNG",
            3: "./images/NPC_X/three.PNG",
            4: "./images/NPC_X/four.PNG",
            5: "./images/NPC_X/five.PNG",
            6: "./images/NPC_X/six.PNG",
            7: "./images/NPC_X/seven.PNG",
            8: "./images/NPC_X/eight.PNG",
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