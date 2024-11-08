import LiarsDice from './liars-dice.js'

const playButton = document.getElementById("startGame");
const bidNumDropdown = document.getElementById("selectAmount");
const bidFaceDropdown = document.getElementById("selectFace");
const gameStatements = document.getElementById("gameStatements");

playButton.onclick = function() {startGame()};
bidNumDropdown.addEventListener("change", showFaceOptions);
toggleDropdownVisibility()

const game = new LiarsDice();

function startGame() {
    startTurn();
}

function toggleDropdownVisibility(){
    if (bidNumDropdown.style.display == "none") {
        bidNumDropdown.style.display = "initial";
        bidFaceDropdown.style.display = "initial";
    } else {
        bidNumDropdown.style.display = "none";
        bidFaceDropdown.style.display = "none";
    }
}


document.getElementById("clickMe").onclick = function() {startTurn()};

const imageDropdown = document.getElementById('imageDropdown');
const imageDropContainer = document.getElementById('selectedImage');

imageDropdown.addEventListener('change', () => {
    const selectedValue = imageDropdown.value;
    const imageDrop = document.createElement('img');
    imageDrop.src = selectedValue;
    imageDrop.alt = 'Selected Image';

    // Clear previous image
    imageDropContainer.innerHTML = ''; 
    imageDropContainer.appendChild(imageDrop);
});

function startTurn(){
    game.startTurn();
    showUserRoll();

    npcTurn();
    showNumOptions();
    showFaceOptions();
}

function npcTurn() {
    game.npcTurn();
    gameStatements.innerHTML = game.statements;
}
function showUserRoll(){
    const imageContainer = document.getElementById("userRoll");
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
            imageContainer.appendChild(imageElement);
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