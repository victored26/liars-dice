import LiarsDice from './liars-dice.js'

const playButton = document.getElementById("startGame");
const portraits = document.querySelectorAll(".portrait");
const gameStatements = document.getElementById("gameStatements");
const continueButton = document.getElementById("continue");
const challengeBidButton = document.getElementById("challengeBid");
const bidQuantity = document.getElementById("bidQuantity");
const selectFace = document.getElementById("selectFace");
const makeBidButton = document.getElementById("makeBid");
const user = document.getElementById("user");
const userRoll = document.getElementById("userRoll");

playButton.onclick = function() {beginGame();}

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

document.getElementById("game").style.display = "none";
portraits.forEach(portrait => {portrait.style.display = 'none';});
bidQuantity.addEventListener("change", showFaceOptions);


const game = new LiarsDice();

function beginGame() {
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
    showNPCPortrait();

    // Start the game
    startTurn();
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
        let number = Number(bidQuantity.value);
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
}

function showFaceOptions() {
    let bidMinFace = 1;
    let newElement;
    if (Number(bidQuantity.value) == game.lastBid['number']) {
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