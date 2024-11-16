import LiarsDice from './liars-dice.js'

const play = document.getElementById("startGame");
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
nextTurn.onclick = function() {proceed();}
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
        game.user.name = userName.value.toUpperCase();
    }
    userNameDisplay.innerText = game.user.name;

    // Hide the menu and display the game
    const menu = document.getElementById("menu");
    const gamePage = document.getElementById("game");
    menu.style.display = "none";
    gamePage.style.display = "initial";
    userBid.style.display = "none";
    showNPCs();

    // Start the game
    startTurn();
}

function assignTurn() {
    /* Assigns current turn to either the user or an npc */
    if (game.turn != 0) {
        npcTurn();
    } else {
        userTurn();
    }
}

function proceed() {
    /* Advances to next set of turns if the current set is over. 
    Otherwise, proceeds to next turn within the current set */
    if (nextTurn.className == "enabled") {
        nextTurn.className = "disabled";
        if (game.turnOver) {
            startTurn();
        } else {
            game.nextTurn();
            assignTurn();
        }
    }
}

function userChallengeBid() {
    /* Challenges previous bid if user is not the first bidder of the round */
    if (challengeBid.className == "enabled") {
        challengeBid.className = "disabled";
        userBid.style.display = "none";
        endTurn();
    }
}

function placeBid() {
    /* Places bid if it is the user's turn and the bid is valid */
    if (makeBid.className == "enabled") {
        makeBid.className = "disabled";
        challengeBid.className = "disabled";
        let face = document.querySelector('input[name="userFace"]:checked').value;
        let validNumber = (Number(bidNum.value) >= Number(bidNum.min));
        validNumber = validNumber && (Number(bidNum.value) <= Number(bidNum.max));
        if (face != null && validNumber){
            game.userMakeBid(Number(bidNum.value), Number(face));
            curUpdate.innerHTML = showBid();
            nextTurn.className = "enabled";
            curPlayer.innerHTML = `<u>${game.user.name}<u>`;
        }
        userBid.style.display = "none";
    }
}

function startTurn(){
    /* Sets up the new game turn*/
    game.startTurn();
    showUserRoll();
    assignTurn();
}

function userTurn(){
    /* Displays the bid options and allows for the user to place a bid */
    userBid.style.display = "block";
    curPlayer.innerHTML = `<u>PREVIOUS BID<u>`;
    showNumOptions();
    showFaceOptions();
    makeBid.className = "enabled";
    if (game.lastBid['number'] > 0) {
        game.npcsEvaluateBid();
        challengeBid.className = "enabled";
    }
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
    /* Simulates npc turn and displays their action */
    curPlayer.innerHTML = `<u>${game.players[game.turn].name}<u>`;
    game.npcTurn();
    if (!game.turnOver) {
        curUpdate.innerHTML = showBid();
        nextTurn.className = "enabled";
    } else {
        endTurn();
    }
    
}

function endTurn() {
    bidCheck();
    game.endTurn();
    game.checkGameOver();
    if (!game.gameOver) {
        nextTurn.className = "enabled";
    } 
}

function bidCheck() { 
    game.bidCheck();
    let bidBool = game.bid, loser = game.loser;
    curUpdate.innerHTML = game.settings.statements['challenge'];
    curUpdate.innerHTML += showBidAndRolled();
    curUpdate.innerHTML += `${game.settings.statements[bidBool.toString()]}`;
    losesDie(loser);
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

function showNPCs() {
    /* Displays NPCs' portraits and number of dice they start with.
    The NPC portraits are chosen at random from their image list. */
    let roll = 0, portSrc = "", diceContainer = "", diceSrc = "";
    for (let n = 1; n < game.settings.numPlayers; n++) {
        // Portrait
        roll = Math.floor(Math.random()*8 + 1);
        portSrc = game.settings.portraits[roll].replace("npc_x", `npc_${n}`);
        document.getElementById(`npc${n}Img`).src = portSrc;
        document.getElementById(`npc${n}Name`).innerText = game.players[n].name;

        // Dice
        diceContainer = document.getElementById(`npc${n}DiceLeft`);
        diceSrc = game.settings.diceLeft[n];
        for (let die = 1; die < game.players[n].numDice + 1; die++) {
            diceContainer.innerHTML += `<img id="npc_${n}:${die}"  src=${diceSrc} class="diceLeft">`;
        }
    }
}

function losesDie(loser) {
    /* Removes one die from the loser of a turn. If the player has
    no more dice left, that player becomes inactive */
    let die = document.getElementById(`npc_${loser.id}:${loser.numDice + 1}`);
    die.style.opacity = 0.25;
    if (loser.numDice == 0) {
        document.getElementById(`npc${loser.id}Img`).style.opacity = 0.5;
    }
}

function showBid() {
    /* Displays the current bid */
    let num = game.lastBid['number'], face = game.lastBid['face'];
    let htmlText = `<p style="text:align:center; color:black">${num}</p>`;
    htmlText += `<div id="bid">`;
    for (let n = 1; n < num + 1; n++) {
        htmlText += `<img src="${game.settings.dieImages[face]}"`;
        htmlText += `style="width:30px;height:30px;"></img>`;
    }
    return htmlText + "</div>"
}

function showBidAndRolled() {
    /* Displays the current bid next to the amount on the table */
    let htmlText = `<div id="bidAndReal">`;
    let bidNum = game.lastBid['number'], face = game.lastBid['face'];
    let realNum = game.totalRolled[face];

    // Bid Section
    htmlText += `<figure style="flex: 50%;">`;
    htmlText += `<figcaption>BID</figcaption>`
    htmlText += `<img src="${game.settings.dieImages[face]}"`;
    htmlText += `style="width:30px;height:30px;"></img>`;
    htmlText += `<figcaption>${bidNum}</figcaption>`
    htmlText += `</figure>`;

    // Correct Section
    htmlText += `<figure style="flex: 50%;">`;
    htmlText += `<figcaption>CORRECT</figcaption>`
    htmlText += `<img src="${game.settings.dieImages[face]}"`;
    htmlText += `style="width:30px;height:30px;"></img>`;
    htmlText += `<figcaption>${realNum}</figcaption>`
    htmlText += `</figure>`;

    return htmlText + `<div>`
}