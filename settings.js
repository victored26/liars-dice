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

    }
}