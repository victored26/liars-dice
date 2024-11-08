import LiarsDice from './liars-dice.js'

const playButton = document.getElementById("startGame");
const gameStatements = document.getElementById("gameStatements");
const challengeBidButton = document.getElementById("challengeBid");
const bidNumDropdown = document.getElementById("selectAmount");
const bidFaceDropdown = document.getElementById("selectFace");
const makeBidButton = document.getElementById("makeBid");
const userRoll = document.getElementById("userRoll");

playButton.onclick = function() {
    playButton.style.display = "none";
    startTurn();
    }
challengeBidButton.onclick = function() {
    toggleBidVisibility();
    endTurn();
}
bidNumDropdown.addEventListener("change", showFaceOptions);
makeBidButton.onclick = function() {userMakeBid();}
toggleBidVisibility();

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
        startTurn();
    }
}
function showUserRoll(){
    userRoll.innerHTML = "You rolled<br>";
    for (let face = 1; face < game.settings.faces + 1; face++) {
        if (game.userRolled[face] == 0) {
            continue;
        }
        for (let count = 1; count < game.userRolled[face] + 1; count++) {
            let path = game.settings.images[face]
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