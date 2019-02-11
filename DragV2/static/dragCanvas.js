'use strict';
let socket = io();

let canvas = document.getElementById('ballCanvas')
let ctx = canvas.getContext("2d");
canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;


let pointerLocked = false;

canvas.onclick = function() {
  canvas.requestPointerLock();
};

document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

document.addEventListener("touchmove", touchMove, false);
document.addEventListener("touchstart", touchStart, false);
document.addEventListener("touchend", touchEnd, false);

let rect = canvas.getBoundingClientRect();
let prevX = 0;
let prevY = 0;

let mouse = {};
let  addButton =  new Circle(50,50,15)




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

function touchStart(e) {


  //   initialX = e.touches[0].clientX  - rect.left;
  //   initialY = e.touches[0].clientY  - rect.top;
  //
  //
  // //check to make sure the target is the item we want to drag , then set that dragging is happening
  // //console.log("X: " + initialX + "Y: " + initialY + "P X: " + player1.x + "P Y: " + player1.y)
  // if (pointInCircle(initialX, initialY, player1.x, player1.y, player1.r)) {
    active = true;
//  }
}

//when dragging is finished , stop moving and set dragging as false
function touchEnd(e) {

  initialX = currentX;
  initialY = currentY;
//  console.log("X: " + initialX + "Y: " +initialY)
  active = false;
}

function touchMove(e) {
  //if dragging is happening then do stuff
  if (true) {

    e.preventDefault();

    currentX = e.touches[0].clientX  - rect.left ;
    currentY = e.touches[0].clientY  - rect.top;


    //seeting the offset as the new location to allow for the next "move" to start from the new position
    xOffset = currentX;
    yOffset = currentY;

    let touchData = {
      x:currentX,
      y:currentY
    }
    socket.emit('touch',touchData);
  }
}
















function lockChangeAlert() {
  if (document.pointerLockElement === canvas ||document.mozPointerLockElement === canvas) {
    console.log('The pointer lock status is now locked');
    pointerLocked = true;
    document.addEventListener("mousemove", drag, false);
  } else {
    console.log('The pointer lock status is now unlocked');
    pointerLocked = false;
    document.removeEventListener("mousemove", drag, false);
  }
}

function Circle(x, y, r) {
  this.xDefault = x
  this.yDefault = y
  this.x = (x === null) ? 0 : x;
  this.y = (y === null) ? 0 : y;
  this.r = (r === null) ? 0 : r;

  this.fill = function(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drag(e){
  if (e.type === "touchmove") {
    let movementX = (prevX ? e.touches[0].clientX  - rect.left - prevX : 0)
    let movementY = (prevY ? e.touches[0].clientY  - rect.top - prevY : 0)

    mouse = {
      x:movementX,
      y:movementY,
    }
    prevX = e.touches[0].clientX  - rect.left;
    prevY = e.touches[0].clientY  - rect.top;
    pointerLocked = true;
  }else {
    mouse = {
      x: e.movementX,
      y: e.movementY,
    }
  }
  socket.emit('drag',mouse);
}

socket.on('state', function(players) {
  clearScreen()
  ctx.fillStyle = 'green';
  for (var id in players) {
    var player = players[id];
    drawCircle(player.x,player.y,player.r)
  }
  ctx.fillStyle = "red"
  addButton.fill(ctx);

});

function pointInCircle(x, y, cx, cy, radius) {
  let distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
  return distancesquared <= radius * radius;
}

function clearScreen(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawCircle(x,y,r){
  ctx.beginPath();
  ctx.arc(x,y,r, 0, 2 * Math.PI);
  ctx.fill();
}

function createCircle(){
  socket.emit('new player',rect);
}

let clientData = {
  canvasWidth:ctx.canvas.width,
  canvasHeight:ctx.canvas.height
}
socket.emit('client data',clientData);
createCircle()
