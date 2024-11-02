import Settings from './settings.js'
import Player from './player.js'
import NPC from './npc.js'

class LiarsDice {
    constructor() {
        this.settings = new Settings();
        this.players = new Array(
            new Player(this, "Victor"),
            new NPC(this, "Bruno"),
            new NPC(this, "Beanz"),
            new NPC(this, "Libby")
            );
        this.turn = Math.floor(Math.random() * this.players.length);
        this.gameOver = false;
    }
    mainLoop() {
        while (!this.gameOver) {
            this.startTurn();
            this.gameLoop();
            this.bidCheck();
            this.endTurn();
        }
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
        this.totalRolled = this.players[0].totalRolled
        this.userRolled = this.players[0].rolled;
    }
    gameLoop() {
        while (!this.turnOver) {
            // Player makes a bid
            if (this.turn > 0) {
                this.players[this.turn].makeBid(this.lastBid);
            }
            this.lastBid['number'] = this.players[this.turn].bidNum;
            this.lastBid['face'] = this.players[this.turn].bidFace;

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
    bidCheck() {
        if (this.totalRolled[this.lastBid['face']] >= this.lastBid['number']) {

        }
    }
}

/*


class Liars_Dice:
    """Represents the game."""

    def main_loop(self):
        """Main game loop"""
        while(not self.game_over):
            self.check_end_game()


    def bid_check(self):
        """Determine who wins when a bid is challenged; handles the outcome."""
        bid_face = self.last_bid[0]
        bid_num = self.last_bid[1]

        challenger = self.players[self.turn % self.n_players]
        bidder = self.players[(self.turn - 1) % self.n_players]

        if self.player.tot_rolled[bid_face] >= bid_num:
            # bidder wins
            challenger.lose_dice()
            if challenger.num_dice == 0:
                self.players.pop(self.turn % self.n_players)
        else:
            # challenger wins
            bidder.lose_dice()
            if bidder.num_dice == 0:
                self.players.pop((self.turn - 1) % self.n_players)
            else:
                self.turn -= 1

    
    
    def end_turn(self):
        """Sets up the start of the turn."""
        for i in range(len(self.players)):
            self.players[i].end_turn()
        Participant.tot_rolled = defaultdict(int)
    
    def check_end_game(self):
        """Checks if the game should be over."""
        if len(self.players) == 1:
            self.game_over = True
            print("You won!")
        elif self.player not in self.players:
            self.game_over = True
            print("You lost.")

if __name__ == '__main__':
    # Make a game instance, and run the game.
    liars_dice = Liars_Dice()
    liars_dice.main_loop() */