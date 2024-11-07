import LiarsDice from './liars-dice.js'

const game = new LiarsDice();

const paragraph = document.getElementById("gameStatements");
paragraph.innerHTML = game.turn + "<br>";


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
}

function npcTurn() {
    game.npcTurn();
    paragraph.innerHTML += game.statements;
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

// 
var myArray = new Array("1", "2", "3", "4", "5");


// Get dropdown element from DOM
var dropdown = document.getElementById("selectNumber");

// Loop through the array
for (var i = 0; i < myArray.length; ++i) {
    // Append the element to the end of Array list
    dropdown[dropdown.length] = new Option(myArray[i], myArray[i]);
}

function myFunction() {
    document.getElementById("demo").style.fontSize = "25px"; 
    document.getElementById("demo").style.color = "red";
    document.getElementById("demo").style.backgroundColor = "yellow";        
  }