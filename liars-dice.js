import Settings from './settings.js'
import Player from './player.js'
import NPC from './npc.js'

export default class LiarsDice {

    constructor() {
        /* Initializes the game and its settings */
        this.settings = new Settings();
        this.gameOver = false;
        this.user = new Player(this, "BRUNO");
        this.players = new Array(
            this.user,
            new NPC(this, "LIBBY"),
            new NPC(this, "JUNE"),
            new NPC(this, "BEANZ")
            );
        this.numPlayers = this.players.length;
        this.turn = Math.floor(Math.random() * this.numPlayers);
    }

    startTurn() {
        /* Starts a new turn set */
        this.turnOver = false;
        this.bid = true;
        this.lastBid = {
            'number': 0, 
            'face': this.settings.faces
            };
        this.players[0].rollDice();
        for (let i = 1; i < this.numPlayers; i++) {
            this.players[i].newTurn();
            }
        this.totalDice = Player.totalDice;
        this.totalRolled = Player.totalRolled;
        this.userRolled = this.user.rolled;
        if (this.turn > 0) {
            this.npcMakeBid();
            }
        }

    nextTurn() {
        /* Advances turn within the current turn set */
        this.turn = (++this.turn) % this.numPlayers;
    }

    npcTurn() {
        /* Simulates an NPC turn */
        this.npcsEvaluateBid();
        if (!this.turnOver) {
            this.npcMakeBid();
        }
    }

    endTurn() {
        /* Ends the current turn set */
        for (let i = 0; i < this.numPlayers; i++) {
            this.players[i].endTurn();
        }
        Player.totalRolled = {};
    }

    checkGameOver() {
        /* Checks if the game is over */
        this.gameOver = (this.numPlayers == 1 || this.user != this.players[0]);
    }
    bidCheck() {
        let prev_turn = this.turn == 0 ? this.numPlayers - 1 : this.turn - 1;
        let challenger = this.players[this.turn];
        let bidder = this.players[prev_turn];

        if (this.totalRolled[this.lastBid['face']] >= this.lastBid['number']) {
            challenger.loseDie();
            if (!challenger.active) {
                this.players.splice(this.turn, 1);
            }
        } else {
            this.bid = false;
            bidder.loseDie();
            if (!bidder.active) {
                this.players.splice(prev_turn, 1);
            } else {
                this.turn = prev_turn;
            }
        }
        this.loser = this.bid ? challenger : bidder;
    }

    userMakeBid(number, face) {
        this.user.placeBid(number, face);
        this.lastBid['number'] = this.user.bidNum;
        this.lastBid['face'] = this.user.bidFace;
    }
    npcMakeBid() {
        this.players[this.turn].makeBid(this.lastBid);
        this.lastBid['number'] = this.players[this.turn].bidNum;
        this.lastBid['face'] = this.players[this.turn].bidFace;
    }
    npcsEvaluateBid() {
        // All NPC players (including the bidder) evaluate the bid
        let nextTurn = (this.turn + 1) % this.numPlayers;
        for (let i = 1; i < this.numPlayers; i++) {
            if (i == nextTurn) {
                this.turnOver = !this.players[i].evaluateBid(this.lastBid);
            } else {
                this.players[i].evaluateBid(this.lastBid);
                }
        }
    }  
} 