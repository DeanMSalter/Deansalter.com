'use strict';
let socket = io();

let canvas = document.getElementById('ballCanvas')
let ctx = canvas.getContext("2d");
canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;


let pointerLocked = false;

window.onkeyup = function(e) {
   let key = e.keyCode ? e.keyCode : e.which;


   if (key == 76) {
     if(pointerLocked){
       document.exitPointerLock();
     }else{
       canvas.requestPointerLock();
     }

   }
}

// canvas.onclick = function() {
//   canvas.requestPointerLock();
// };

document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

document.addEventListener("touchmove", touchMove, false);
document.addEventListener("touchstart", touchStart, false);
document.addEventListener("touchend", touchEnd, false);

document.addEventListener("mousedown", click, false);

let rect = canvas.getBoundingClientRect();
let prevX = 0;
let prevY = 0;

let mouse = {};
let  addButton =  new Circle(50,50,30)




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
let scaleX = canvas.width / rect.width;    // relationship bitmap vs. element for X
let scaleY = canvas.height / rect.height;
function touchStart(e) {
      mouse = {
        x:(e.touches[0].pageX  - rect.left)*scaleX,
        y:(e.touches[0].pageY  - rect.top)*scaleY,
      }

  socket.emit('touchStart',mouse);
}

//when dragging is finished , stop moving and set dragging as false
function touchEnd(e) {
  socket.emit('touchEnd');
}
function click(e){
  mouse = {
    x: (e.pageX - rect.left)*scaleX,
    y: (e.pageY  - rect.top)*scaleY
  }
  socket.emit("click",mouse)
}
function touchMove(e) {
  mouse = {
    x:(e.touches[0].pageX  - rect.left)*scaleX,
    y:(e.touches[0].pageY  - rect.top)*scaleY,
  }

  socket.emit('touch',mouse);
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
    mouse = {
      x: e.movementX,
      y: e.movementY,
    }

  socket.emit('drag',mouse);
}

socket.on('state', function(players) {
  clearScreen()

  for (var id in players) {
    var player = players[id];
    ctx.fillStyle = player.colour;
    drawCircle(player.x,player.y,player.r)
    ctx.fillStyle = "black"
    ctx.font = "30px Arial";
    ctx.fillText(player.id, player.x, player.y);
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
  socket.emit('new player');
}

let clientData = {
  canvasWidth:ctx.canvas.width,
  canvasHeight:ctx.canvas.height,
  addButton: addButton,
}
socket.emit('client data',clientData);
//createCircle()
