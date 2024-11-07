export default class Settings {
    constructor() {
        // Game Settings
        this.numDice = 5;
        this.faces = 6;

        // Game Images
        this.images = {
            1: "./images/face_one.png",
            2: "./images/face_two.png",
            3: "./images/face_three.png",
            4: "./images/face_four.png",
            5: "./images/face_five.png",
            6: "./images/face_six.png"
        };

        // NPC Behaviour Settings
        this.bidEvalOffset = 0.1;
        this.bidNumMultiplier = 1;

        // Game Statements
        this.faceNames = {
            1: "One",
            2: "Two",
            3: "Three",
            4: "Four",
            5: "Five",
            6: "Six"
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