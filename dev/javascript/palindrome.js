"use strict";
let input = "";


document.getElementById('submitButton').addEventListener('click', function(){
 console.log("Initial value= " + document.getElementById("inputBox").value)
 input = document.getElementById("inputBox").value;
 calculate(input);

});
document.getElementById("inputBox")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("submitButton").click();
    }
});

function calculate( input){
  let reversed = ""
  for(let i = input.length-1;i>=0;i--){
    reversed += input[i];
  }
  reversed = reversed.toLowerCase();
  input = input.toLowerCase();
  console.log("Reversed= " + reversed);
  if(reversed === input){
    console.log("Palindrome!");
    document.getElementById('result').innerHTML = input + " is a Palindrome!";
  }else{
    console.log("not a Palindrome!");
    document.getElementById('result').innerHTML = input + " is not a Palindrome!";
  }
  document.getElementById('reversed').innerHTML = "Reversed = " + reversed;
}
