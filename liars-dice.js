import Settings from './settings.js'
import Player from './player.js'
import NPC from './npc.js'

export default class LiarsDice {
    constructor() {
        this.settings = new Settings();
        this.statements = "";
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
        this.totalDice = Player.totalDice;
        this.totalRolled = Player.totalRolled;
        this.userRolled = this.user.rolled;
        if (this.turn > 0) {
            this.npcMakeBid();
            }
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
        let bid;
        let prev_turn = (this.turn - 1) % this.numPlayers;
        let challenger = this.players[this.turn];
        let bidder = this.players[prev_turn];
        this.challengeBidStatement();

        if (this.totalRolled[this.lastBid['face']] >= this.lastBid['number']) {
            bid = true;
            challenger.loseDie();
            if (!challenger.active) {
                this.players.splice(this.turn, 1);
            }
        } else {
            bid = false;
            bidder.loseDie();
            if (!bidder.active) {
                this.players.splice(prev_turn, 1);
            } else {
                this.turn = prev_turn;
            }
        }
        this.outcomeBidStatement(loser, bid);
    }
    userMakeBid(number, face) {
        this.user.placeBid(number, face);
        this.lastBid['number'] = this.user.bidNum;
        this.lastBid['face'] = this.user.bidFace;
        this.makeBidStatement();
    }
    npcMakeBid() {
        let player = this.players[this.turn];
        player.makeBid(this.lastBid);
        this.lastBid['number'] = player.bidNum;
        this.lastBid['face'] = player.bidFace;
        this.makeBidStatement();
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
    
    // <!-- Statement Methods --!>
    makeBidStatement() {
        let text = "";
        if (this.lastBid['number'] > 1) {
            text = this.settings.statements['pluralBid'];
            if (this.lastBid['face'] < 6) {
                text += "s"; 
            } else {
                text += "es";
            }
        } else {
            text = this.settings.statements['singleBid'];
        }
        text = text.replace("PLAYER", this.players[this.turn].name);
        text = text.replace("NUM", this.lastBid['number']);
        text = text.replace(
            "FACE", 
            this.settings.faceNames[this.lastBid['face']]
            );
        this.statements += text + "<br>";
    }
    challengeBidStatement(challenger, bidder) {
        let text = this.settings.statements['challenge'];
        text = text.replace("CHALLENGER", challenger.name);
        text = text.replace("BIDDER", bidder.name);
        this.statements += text + "<br>";
    }
    outcomeBidStatement(loser, bid) {
        let text = bid ? this.settings.statements['trueBid'] : this.settings.statements['falseBid'];
        this.statements += text + "<br>";

        text = this.settings.statements['lostDie'];
        if (!loser.active) {
            text += this.settings.statements["leavesTable"];
        }
        this.statements += textreplace(/PLAYER/g, loser.name) + "<br>";
    }
} 