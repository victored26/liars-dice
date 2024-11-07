import Settings from './settings.js'
import Player from './player.js'
import NPC from './npc.js'

export default class LiarsDice {
    constructor() {
        this.settings = new Settings();
        this.user = new Player(this, "Victor");
        this.players = new Array(
            this.user,
            new NPC(this, "Bruno"),
            new NPC(this, "Beanz"),
            new NPC(this, "Libby")
            );
        this.turn = Math.floor(Math.random() * this.players.length);
        this.gameOver = false;
    }
    startTurn() {
        this.turnOver = false;
        this.lastBid = {'number': 0, 'face': this.settings.faces};
        this.numPlayers = this.players.length;
        for (let i = 0; i < this.numPlayers; i++) {
            if (i == 0) {
                this.players[i].rollDice();
            } else {
                this.players[i].newTurn();
                }
            }
        this.totalRolled = Player.totalRolled;
        this.userRolled = this.user.rolled;
        }
    npcTurn() {
        this.npcEvaluateBid();
        while(this.turn != 0 && !this.turnOver){
            this.npcMakeBid();
            this.npcEvaluateBid();
        }
    }
    endTurn() {
        for (let i = 0; i < this.numPlayers; i++) {
            this.players[i].endTurn();
        }
        Player.totalRolled = {};
    }
    checkEndGame() {
        this.gameOver = (this.numPlayers == 1 || this.user != this.players[0]);
    }
    bidCheck() {
        let prev_turn = (this.turn - 1) % this.numPlayers;
        let challenger = this.players[this.turn];
        let bidder = this.players[prev_turn];
        if (this.totalRolled[this.lastBid['face']] >= this.lastBid['number']) {
            challenger.loseDie();
            if (!challenger.active) {
                this.players.splice(this.turn, 1);
            }
        } else {
            bidder.loseDie();
            if (!bidder.active) {
                this.players.splice(prev_turn, 1);
            } else {
                this.turn = prev_turn;
            }
        }
    }
    npcMakeBid() {
        this.players[this.turn].makeBid(this.lastBid);
    }
    npcEvaluateBid() {
        // All NPC players (including the bidder) evaluate the bid
        let nextTurn = (this.turn + 1) % this.numPlayers;
        for (let i = 1; i < this.numPlayers; i++) {
            if (i == nextTurn) {
                this.turnOver = !this.players[i].evaluateBid(this.lastBid);
            } else {
                this.players[i].evaluateBid(this.lastBid);
                }
        }
        this.turn = nextTurn;
    }   
} 