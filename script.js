import LiarsDice from './liars-dice.js'

const userNameForm = document.getElementById("nameEntryForm");
const userName = document.getElementById("userName");
const playButton = document.getElementById("startGame");
const portraits = document.querySelectorAll(".portrait");
const gameStatements = document.getElementById("gameStatements");
const continueButton = document.getElementById("continue");
const challengeBidButton = document.getElementById("challengeBid");
const bidNumDropdown = document.getElementById("selectAmount");
const bidFaceDropdown = document.getElementById("selectFace");
const makeBidButton = document.getElementById("makeBid");
const userRoll = document.getElementById("userRoll");

playButton.onclick = function() {
    playButton.style.display = "none";
    userNameForm.style.display = "none";
    showNPCPortrait();
    game.user.name = userName.value;
    startTurn();
    }

challengeBidButton.onclick = function() {
    toggleBidVisibility();
    endTurn();
}

continueButton.onclick = function() {
    continueButton.style.display = "none";
    gameStatements.innerText = "";
    startTurn();
}

bidNumDropdown.addEventListener("change", showFaceOptions);
makeBidButton.onclick = function() {userMakeBid();}
toggleBidVisibility();
continueButton.style.display = "none";
portraits.forEach(portrait => {portrait.style.display = 'none';});

const game = new LiarsDice();

function toggleBidVisibility(){
    if (bidNumDropdown.style.display == "none") {
        if (game.lastBid['number'] > 0) {
            challengeBidButton.style.display = "initial";
        }
        bidNumDropdown.style.display = "initial";
        bidFaceDropdown.style.display = "initial";
        makeBidButton.style.display = "initial";
    } else {
        challengeBidButton.style.display = "none";
        bidNumDropdown.style.display = "none";
        bidFaceDropdown.style.display = "none";
        makeBidButton.style.display = "none";
    }
}

function startTurn(){
    showDiceLeft();
    game.startTurn();
    showUserRoll();
    if (game.turn != 0) {
        npcTurn();
    } else {
        userTurn();
    }
    
}

function userMakeBid() {
    let number = Number(bidNumDropdown.value);
    let face = Number(bidFaceDropdown.value);
    game.userMakeBid(number, face);
    gameStatements.innerText = game.statements;
    toggleBidVisibility();
    npcTurn();
}

function userTurn(){
    showNumOptions();
    showFaceOptions();
    toggleBidVisibility();
}

function npcTurn() {
    game.npcTurn();
    if (game.turnOver) {
        endTurn();
    } else {
        userTurn();
    }
    gameStatements.innerHTML = game.statements;
}

function endTurn() {
    game.bidCheck();
    game.endTurn();
    game.checkEndGame();
    gameStatements.innerHTML = game.statements;
    if (!game.gameOver) {
        continueButton.style.display = "initial";
    }
}
function showUserRoll(){
    userRoll.innerHTML = "You rolled<br>";
    for (let face = 1; face < game.settings.faces + 1; face++) {
        if (game.userRolled[face] == 0) {
            continue;
        }
        for (let count = 1; count < game.userRolled[face] + 1; count++) {
            let path = game.settings.dieImages[face]
            let imageElement = document.createElement("img")
            imageElement.src = path;
            imageElement.alt = `${face}!`;
            imageElement.style.width = "50px";
            userRoll.appendChild(imageElement);
        }
    }
}

function showNumOptions(){
    let bidMinNumber = game.lastBid['number'];
    bidMinNumber += game.lastBid['face'] < game.settings.faces ? 0 : 1;
    bidNumDropdown.innerText = null;
    for (let n = bidMinNumber; n < game.totalDice + 1; n++) {
        bidNumDropdown[bidNumDropdown.length] = new Option(
            n.toString(), n.toString());
    }
}

function showFaceOptions() {
    let bidMinFace = 1;
    if (Number(bidNumDropdown.value) == game.lastBid['number']) {
        bidMinFace = game.lastBid['face'] + 1;
    }
    bidFaceDropdown.innerText = null;
    for (let n = bidMinFace; n < game.settings.faces + 1; n++) {
        bidFaceDropdown[bidFaceDropdown.length] = new Option(
            n.toString(), n.toString());
    }
}

function showNPCPortrait() {
    let roll;
    let path;
    for (let n = 1; n < game.numPlayers; n++) {
        roll = Math.floor(Math.random()*8 + 1);
        path = game.settings.portraits[roll].replace("NPC_X", `npc_${n}`);
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