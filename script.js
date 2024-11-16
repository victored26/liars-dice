import LiarsDice from './liars-dice.js'

const play = document.getElementById("startGame");
const portraits = document.querySelectorAll(".portrait");
const commentary = document.getElementById("commentary");
const userBid = document.getElementById("userBid"); 
const nextTurn = document.getElementById("continue");
const curPlayer = document.getElementById("curPlayer");
const curUpdate = document.getElementById("curUpdate");
const challengeBid = document.getElementById("challengeBid");
const bidNum = document.getElementById("bidNum");
const selectFace = document.getElementById("selectFace");
const makeBid = document.getElementById("makeBid");
const userRoll = document.getElementById("userRoll");

// Assign actions
play.onclick = function() {beginGame();}
challengeBid.onclick = function() {userChallengeBid();}
nextTurn.onclick = function() {continueToNextTurn();}
makeBid.onclick = function() {placeBid();}
bidNum.onchange = function() {showFaceOptions();}

// Hide the game page
document.getElementById("game").style.display = "none";

// Create a game instance
const game = new LiarsDice();

function beginGame() {
    /* Retrieves user input and sets up new game */

    // Retrieve user image and name
    let img = document.querySelector('input[name="userPortrait"]:checked');
    if (img != null) {
        const userImg = document.getElementById("userImg");
        userImg.src = game.settings.portraits[img.value].replace("npc_x", "user");
    }
    const userName = document.getElementById("userName");
    const userNameDisplay = document.getElementById("userNameDisplay");
    if (userName.value != "") {
        game.user.name = userName.value;
        userNameDisplay.innerText = userName.value;
    }

    // Hide the menu and display the game
    const menu = document.getElementById("menu");
    const gamePage = document.getElementById("game");
    menu.style.display = "none";
    gamePage.style.display = "initial";
    showNPCPortraits();

    // Start the game
    startTurn();
}

function userChallengeBid() {
    /* Challenges previous bid if user is not the first bidder of the round */
    if (challengeBid.className == "active") {
        challengeBid.className = "disabled";
        endTurn();
    }
}

function continueToNextTurn() {
    /* Advances to next turn ingame if the current turn is over */
    if (nextTurn.className == "active") {
        nextTurn.className = "disabled";
        startTurn();
    }
}

function placeBid() {
    /* Places bid if it is the user's turn and the bid is valid */
    if (makeBid.className == "active") {
        let face = document.querySelector('input[name="userFace"]:checked').value;
        let validNumber = (Number(bidNum.value) >= Number(bidNum.min));
        validNumber = validNumber && (Number(bidNum.value) <= Number(bidNum.max));
        if (face != null && validNumber){
            game.userMakeBid(Number(bidNum.value), Number(face));
            curUpdate.innerHTML = placeBidUpdate(Number(bidNum.value), Number(face));
            npcTurn();
        }
    }
}

function startTurn(){
    /* Sets up the new game turn*/

    // Display how many dice each player has left
    showDiceLeft();

    // Display what the user rolled
    game.startTurn();
    showUserRoll();

    // Assign whose turn to play it is
    if (game.turn != 0) {
        npcTurn();
    } else {
        userTurn();
    }
}

function userTurn(){
    /* Displays the bid options and allows for the user to place a bid */
    curPlayer.innerHTML = `<u>${game.user.name}:<u>`;
    curUpdate.innerHTML = null;
    userBid.style.display = "block";
    showNumOptions();
    showFaceOptions();
    makeBid.className = "active";
}

function showNumOptions(){
    /* Modifies the bid number range based on the last bid and the total
    number of dice on the board */
    let bidMinNum = game.lastBid['number'];
    bidMinNum += game.lastBid['face'] < game.settings.faces ? 0 : 1;
    bidNum.min = bidMinNum.toString();
    bidNum.value = bidNum.min;
    bidNum.max = game.totalDice.toString();
}

function showFaceOptions() {
    /* Displays the allowed face values given the bid number selected */
    let bidMinFace = 1;
    let newElement;
    if (Number(bidNum.value) == game.lastBid['number']) {
        bidMinFace = game.lastBid['face'] + 1;
    }
    selectFace.innerHTML = ``;
    for (let n = bidMinFace; n < game.settings.faces + 1; n++) {
        newElement = `<input type="radio" name="userFace" id="face${n}" value="${n}"></input>`;
        newElement += `<label for="face${n}">`;
        newElement += `<img src="${game.settings.dieImages[n]}" class="dice"></img>`;
        newElement += "</label>";
        selectFace.innerHTML += newElement;
    }
}

function npcTurn() {
    userBid.style.display = "none";
    game.npcTurn();
    if (game.turnOver) {
        endTurn();
    } else {
        challengeBid.className = "active";
        userTurn();
    }
    commentary.innerHTML = game.commentary;
}

function endTurn() {
    game.bidCheck();
    game.endTurn();
    game.checkEndGame();
    commentary.innerHTML = game.commentary;
    if (!game.gameOver) {
        nextTurn.className = "active";
    } 
}
function showUserRoll(){
    let path;
    userRoll.innerHTML = "";
    for (let face = 1; face < game.settings.faces + 1; face++) {
        if (game.userRolled[face] == 0) {
            continue;
        }
        for (let count = 1; count < game.userRolled[face] + 1; count++) {
            path = game.settings.dieImages[face];
            userRoll.innerHTML += `<img src=${path} class="diceLeft">`;
        }
    }
}

function showNPCPortraits() {
    let roll;
    let path;
    for (let n = 1; n < game.numPlayers; n++) {
        roll = Math.floor(Math.random()*8 + 1);
        path = game.settings.portraits[roll].replace("npc_x", `npc_${n}`);
        document.getElementById(`npc${n}Img`).src = path;
        document.getElementById(`npc${n}Name`).innerText = game.players[n].name;
    }
    portraits.forEach(portrait => {
        portrait.style.display = 'initial';
    });
}

function showDiceLeft() {
    let imgSrc;
    let container;
    for (let n = 1; n < game.numPlayers; n++) {
        container = document.getElementById(`npc${n}DiceLeft`);
        container.innerHTML = "";
        imgSrc = game.settings.diceLeft[n]
        for (let die = 1; die < game.players[n].numDice + 1; die++) {
            container.innerHTML += `<img src=${imgSrc} class="diceLeft">`
        }
    }
}

function npcLeftTheTable(id) {
    document.getElementById(`npc${id}Img`).style.opacity = 0.7;
}

function placeBidUpdate(num, face) {
    let text = "";
    if (num > 1) {
        text += game.settings.statements['pluralBid'].replace("NUM", num);
    } else {
        text += game.settings.statements['singleBid'].replace("NUM", num);
    }
    text += `<img src="game.settings.dieImages[${face}]"`;
    text += "style=vertical-align: middle;;width:20px;height:20px;";
    text += "></img>";
    return text
}

        