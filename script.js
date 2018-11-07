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



// document.getElementById('submitButton').onclick = function() {
//    //console.log("clicked!");
//    alert("button was clicked");
// }​;​
//alert( "This is Deans test website");
//let promptinput  = prompt("is that okay?","is it?");
//let confirminput = confirm("are you sure?");

setTimeout(() => document.body.style.background = "red", 1000);
setTimeout(() => document.body.style.background = "", 2000);
//
// var canvas = document.createElement('canvas');
// var ctx = canvas.getContext("2d");
// canvas.width = 300;
// canvas.height = 300;
// document.body.appendChild(canvas);
//
// ctx.strokeRect(0, 0, canvas.width, canvas.height);
//
// let submitWidth = 80;
// let submitHeight = 30;
// let submitX = canvas.width/2 - submitWidth/2;
// let submitY = 30;
//
// ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
// ctx.fillRect (submitX, submitY, submitWidth, submitHeight);
// ctx.strokeRect(submitX, submitY, submitWidth, submitHeight);
//
// ctx.fillStyle = "rgba(255, 255, 255, 1)";
// ctx.font = "18px Arial";
// ctx.fillText("Submit",submitX+10,submitY+20);
//
//
//
//
// function getMousePos(canvas, event) {
//     var rect = canvas.getBoundingClientRect();
//     return {
//         x: event.clientX - rect.left,
//         y: event.clientY - rect.top
//     };
// }
// canvas.addEventListener('click', function(evt) {
//   var mousePos = getMousePos(canvas, evt);
//   console.log(mousePos);


//
// }, false);
 console.log("Ran");
