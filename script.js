import LiarsDice from './liars-dice.js'

const portraitRadioForm = document.getElementById("portraitRadioForm");
const userNameForm = document.getElementById("nameEntryForm");
const userName = document.getElementById("userName");
const playButton = document.getElementById("startGame");
const portraits = document.querySelectorAll(".portrait");
const gameStatements = document.getElementById("gameStatements");
const continueButton = document.getElementById("continue");
const challengeBidButton = document.getElementById("challengeBid");
const bidNumDropdown = document.getElementById("selectAmount");
const bidQuantity = document.getElementById("bidQuantity");
const selectFace = document.getElementById("selectFace");
const makeBidButton = document.getElementById("makeBid");
const user = document.getElementById("user");
const userImg = document.getElementById("userImg");
const userNameDisplay = document.getElementById("userNameDisplay");
const userRoll = document.getElementById("userRoll");

playButton.onclick = function() {
    playButton.style.display = "none";
    portraitRadioForm.style.display = "none";
    userNameForm.style.display = "none";
    showNPCPortrait();
    let userPortrait = document.querySelector('input[name="userPortrait"]:checked');
    if (userPortrait != null) {
        userImg.src = game.settings.portraits[userPortrait.value].replace("NPC_X", "user");
    }
    if (userName.value != "") {
        game.user.name = userName.value;
        userNameDisplay.innerText = userName.value;
    }
    gameStatements.style.display = "block";
    user.style.display = "initial";
    startTurn();
    toggleBidVisibility();
}

challengeBidButton.onclick = function() {
    if (challengeBidButton.className == "buttonActive") {
        challengeBidButton.className = "buttonDisabled";
        endTurn();
    }
}

continueButton.onclick = function() {
    if (continueButton.className == "buttonActive") {
        continueButton.className = "buttonDisabled";
        gameStatements.innerText = "";
        startTurn();
    }
}

makeBidButton.onclick = function() {
    if (makeBidButton.className == "buttonActive") {
        userMakeBid();
    }
}

portraits.forEach(portrait => {portrait.style.display = 'none';});
gameStatements.style.display = "none";
bidNumDropdown.addEventListener("change", showFaceOptions);
toggleBidVisibility();
continueButton.style.display = "none";
user.style.display = "none";


const game = new LiarsDice();

function toggleBidVisibility(){
    if (bidNumDropdown.style.display == "none") {
        if (game.lastBid['number'] > 0) {
            challengeBidButton.style.display = "initial";
        }
        bidNumDropdown.style.display = "initial";
        selectFace.style.display = "initial";
        makeBidButton.style.display = "initial";
        continueButton.style.display = "initial";
    } else {
        challengeBidButton.style.display = "none";
        bidNumDropdown.style.display = "none";
        selectFace.style.display = "none";
        makeBidButton.style.display = "none";
        continueButton.style.display = "none";
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
    let face = document.querySelector('input[name="userFace"]:checked').value;
    let validNumber = (Number(bidQuantity.value) >= Number(bidQuantity.min));
    validNumber = validNumber && (Number(bidQuantity.value) <= Number(bidQuantity.max));
    if (face != null && validNumber){
        let number = Number(bidNumDropdown.value);
        game.userMakeBid(number, Number(face));
        gameStatements.innerText = game.statements;
        npcTurn();
    }
}

function userTurn(){
    makeBidButton.className = "buttonActive";
    showNumOptions();
    showFaceOptions();
}

function npcTurn() {
    game.npcTurn();
    if (game.turnOver) {
        endTurn();
    } else {
        challengeBidButton.className = "buttonActive";
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
        continueButton.className = "buttonActive";
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

function showNumOptions(){
    let bidMinNumber = game.lastBid['number'];
    bidMinNumber += game.lastBid['face'] < game.settings.faces ? 0 : 1;
    bidQuantity.min = bidMinNumber.toString();
    bidQuantity.value = bidQuantity.min;
    bidQuantity.max = game.totalDice.toString();
    bidNumDropdown.innerText = null;
    for (let n = bidMinNumber; n < game.totalDice + 1; n++) {
        bidNumDropdown[bidNumDropdown.length] = new Option(
            n.toString(), n.toString());
    }
}

function showFaceOptions() {
    let bidMinFace = 1;
    let newElement;
    if (Number(bidNumDropdown.value) == game.lastBid['number']) {
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