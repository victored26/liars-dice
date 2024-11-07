import LiarsDice from './liars-dice.js'

const game = new LiarsDice()




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