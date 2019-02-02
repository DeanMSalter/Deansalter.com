'use strict';

let id = 1;
let x = 0;
let y = 0;
window.setInterval(function(){
  addMessage();
  loadMessages();
}, 1000);


window.addEventListener('load', initialize);
function initialize(){
  addMessage();
  loadMessages();
}


function keyDownHandler (e) {
  if (e.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }
  if (e.key === 'Enter') {
    console.log("enter")
    addMessage();
    e.preventDefault();
  }
}
console.log("running")

async function loadMessages (isUpdate = false) {
  console.log("test")
  const response = await fetch('http://www.deansalter.com:8080/position');
  if (!response.ok) {
    console.log("error")
    console.error('bad response');
    return;
  }
  const data = await response.json();
  console.log(data[0].x)
  x = data[0].x
  y = data[0].y
}
async function addMessage (e) {

  const response = await fetch('http://www.deansalter.com:8080/position', {
    method: 'POST',
    body: JSON.stringify({ id: id ,x:player1.x,y:player1.y}),
    headers: {
      'content-type': 'application/json'
    }
  });
}


let canvas = document.getElementById('ballCanvas')
let ctx = canvas.getContext("2d");
ctx.canvas.width = 1000;
ctx.canvas.height = 1000;

//item to drag and its container
let container = document.querySelector("#ballCanvas");
let lastTime;

let requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})(); //Function to request a new frame of animation


//tracks wether item is currently being dragged
let active = false;
//positional variables
let currentX = 100;
let currentY = 100;
let initialX;
let initialY;
let defaultSpeed = 5;
//offsets , initally 0 but this will change once movement commences
let xOffset = 0;
let yOffset = 0;

let player1 = new Circle(x, y, 50,5);
function Circle(x, y, r,speed) {
  this.xDefault = x
  this.yDefault = y
  this.x = (x === null) ? 0 : x;
  this.y = (y === null) ? 0 : y;
  this.r = (r === null) ? 0 : r;
  this.speed = (speed === null) ? defaultSpeed : speed;
  this.fill = function(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
  }
}




//touchscreen listners
container.addEventListener("touchstart", dragStart, false);
container.addEventListener("touchend", dragEnd, false);
container.addEventListener("touchmove", drag, false);

//mouse listners
container.addEventListener("mousedown", dragStart, false);
container.addEventListener("mouseup", dragEnd, false);
container.addEventListener("mousemove", drag, false);

function pointInCircle(x, y, cx, cy, radius) {
  let distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
  return distancesquared <= radius * radius;
}

function dragStart(e) {


  let rect = canvas.getBoundingClientRect();
  //checks if the user is using a touchscreen because javascript handles it diffrently, annoyingly.
  if (e.type === "touchstart") {
    initialX = e.touches[0].clientX  - rect.left;
    initialY = e.touches[0].clientY  - rect.top;
  } else {
    initialX = e.clientX - rect.left;
    initialY = e.clientY  - rect.top;
  }

  //check to make sure the target is the item we want to drag , then set that dragging is happening
  //console.log("X: " + initialX + "Y: " + initialY + "P X: " + player1.x + "P Y: " + player1.y)
  if (pointInCircle(initialX, initialY, player1.x, player1.y, player1.r)) {
    active = true;
  }
}

//when dragging is finished , stop moving and set dragging as false
function dragEnd(e) {

  initialX = currentX;
  initialY = currentY;
//  console.log("X: " + initialX + "Y: " +initialY)
  active = false;
}

function drag(e) {
  //if dragging is happening then do stuff
  if (active) {
    let rect = canvas.getBoundingClientRect();
    e.preventDefault();

    //if using touchscreen
    if (e.type === "touchmove") {
      currentX = e.touches[0].clientX  - rect.left ;
      currentY = e.touches[0].clientY  - rect.top;
    } else {
      currentX = e.clientX  - rect.left;
      currentY = e.clientY  - rect.top;
    }

    //seeting the offset as the new location to allow for the next "move" to start from the new position
    xOffset = currentX;
    yOffset = currentY;

    //move the item
    setTranslate(currentX, currentY);
  }
}

//move the item using css
function setTranslate(xPos, yPos) {

  //console.log(" MOVE x: " + player1.x + "y: " + player1.y)

//  player1.fill(ctx);

}





//Updates gametime.
function update(dt) {
  checkWall(dt)
  moveBall(currentX,currentY)
}
//Main game loop
function main() {
  let now = Date.now();
  let dt = (now - lastTime) / 1000.0;

  update(dt);

  render();

  lastTime = now;
  requestAnimFrame(main);

};
function moveBall(x,y){


  //calculates difference between the mouse and the ball and then multiplies it by a constant
  //this means that the ball moves faster the further away the mouse is based on distanceSpeed multiplier.
  let distanceSpeed =  0.1
  let dx = (x - player1.x) * distanceSpeed; //the differences between the x and y positions multiplied by distanceSpeed
  let dy = (y - player1.y) * distanceSpeed;
      //if the difference between mouse and cursor is less than 0.1 then make the ball be in the position of the mouse
      if(Math.abs(dx) + Math.abs(dy) < 0.1) {
           player1.x = x;
           player1.y = y;
      } else { // else add difference
           player1.x += dx;
           player1.y += dy;
      }

  // if(player1.x < x){
  //   player1.x += player1.speed
  // }
  // if(player1.x > x){
  //   player1.x -= player1.speed
  // }
  // if(player1.y < y){
  //   player1.y += player1.speed
  // }
  // if(player1.y > y){
  //   player1.y -= player1.speed
  // }
}
function render() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "blue";
  player1.fill(ctx);

};

function checkWall(dt) {

    if (player1.x + player1.r > canvas.width) { //Right
      console.log("right")
      player1.x = canvas.width - player1.r;
    }
    if (player1.x - player1.r < 0) { //Left
        console.log("left")
        player1.x = 0 + player1.r;
    }
    if (player1.y + player1.r > canvas.height) { //Bottom
        console.log("bottom")
        player1.y = canvas.height - player1.r;
    }
    if (player1.y - player1.r < 0) { //Top
        console.log("top")
        player1.y = 0 + player1.r;
    }

}


main() // -------Start --------------
