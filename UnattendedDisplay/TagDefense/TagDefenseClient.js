'use strict';
//########## Constant variables / canvas stuff
const socket = io('/TagDefense');
const canvas = document.getElementById('ballCanvas')
canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
const ctx = canvas.getContext("2d");
const requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };})(); //Function to request a new frame of animation
const rect = canvas.getBoundingClientRect();
const midPoint = canvas.width/2
const scaleX = canvas.width / rect.width;
const scaleY = canvas.height / rect.height;

//########## Static drawn elements defined
const  addButton1 =  new Circle(120,50,50,"blue")
const  addButton2 =  new Circle(canvas.width-120,50,50,"red")

//########## Game state variables

let lastTime;
let pointerLocked = false;

let mouse = {};
let players = {};

let side1Points =0;
let side2Points= 0;

const clientData = {
  canvasWidth:ctx.canvas.width,
  canvasHeight:ctx.canvas.height,
  midPoint:midPoint,
  addButton1: addButton1,
  addButton2: addButton2,
  side1Points:side1Points,
  side2Points:side2Points
}

//Socket interations
socket.emit('client data',clientData);
socket.on('state', function(gameData) {
  console.log("refresh")
  players = gameData.players ;
  side1Points = gameData.side1Points;
  side2Points = gameData.side2Points;
});

//Start client
main();

//########## Listener functions
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

document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

document.addEventListener("touchmove", touchMove, false);
document.addEventListener("touchstart", touchStart, false);
document.addEventListener("touchend", touchEnd, false);

document.addEventListener("mousedown", click, false);

//########## Utility functions
function Circle(x, y, r,colour) {
  this.xDefault = x
  this.yDefault = y
  this.x = (x === null) ? 0 : x;
  this.y = (y === null) ? 0 : y;
  this.r = (r === null) ? 0 : r;

  this.fill = function(ctx) {
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);

    ctx.fill();
  }

};
function clearScreen(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "black"
  ctx.fillRect(midPoint, 0, 10, canvas.height);

  ctx.fillStyle = "blue"
  ctx.fillRect(0, 0, 60, canvas.height);

  ctx.fillStyle = "red"
  ctx.fillRect(canvas.width-60, 0, 100, canvas.height);


}
function drawBackgroundText(){
  ctx.fillStyle = "black"
  ctx.font = "bold 22px SanSerif";
  ctx.fillText("Click a coloured circle to join a team", midPoint+15 ,200);
  ctx.fillText("Reach the side of the opposite colour to score", midPoint+15 ,220);
  ctx.fillText("Press L to lock in and move your ball", midPoint+15 ,240);

  ctx.fillText("Click a coloured circle to join a team", 65 ,200);
  ctx.fillText("Reach the side of the opposite colour to score", 65 ,220);
  ctx.fillText("Press L to lock in and move your ball", 65 ,240);
}
function drawCircle(x,y,r,colour){
  if(colour !== null){
    ctx.fillStyle = colour;
  }
  ctx.beginPath();
  ctx.arc(x,y,r, 0, 2 * Math.PI);
  ctx.fill();
}

//########## Simple listener/response functions

//Monitors when the cursor lock status changes, acts accordingly
function lockChangeAlert() {
  if (document.pointerLockElement === canvas ||document.mozPointerLockElement === canvas) {
    console.log('The pointer lock status is now locked');
    pointerLocked = true;
    document.addEventListener("mousemove", mouseMove, false);
  } else {
    console.log('The pointer lock status is now unlocked');
    pointerLocked = false;
    document.removeEventListener("mousemove", mouseMove, false);
  }
}

//When touching statuses happen
function touchStart(e) {
  mouse = {
    x:(e.touches[0].pageX  - rect.left)*scaleX,
    y:(e.touches[0].pageY  - rect.top)*scaleY,
  }
  socket.emit('touchStart',mouse);
}
function touchEnd(e) {
  socket.emit('touchEnd');
}
function touchMove(e) {
  mouse = {
    x:(e.touches[0].pageX  - rect.left)*scaleX,
    y:(e.touches[0].pageY  - rect.top)*scaleY,
  }

  socket.emit('touch',mouse);
}

//Mouse status changes
function click(e){
  mouse = {
    x: (e.pageX - rect.left)*scaleX,
    y: (e.pageY  - rect.top)*scaleY
  }
  socket.emit("click",mouse)
}
function mouseMove(e){
    mouse = {
      x: e.movementX,
      y: e.movementY,
    }

  socket.emit('mouseMove',mouse);
}

//########## Core game functions
//Main game loop
function main() {
  let now = Date.now();
  let dt = (now - lastTime) / 1000.0;

  render();

  lastTime = now;
  requestAnimFrame(main);

};
function render() {
  clearScreen()
  drawBackgroundText()

  addButton1.fill(ctx);
  addButton2.fill(ctx);
  for (let id in players) {
    let player = players[id];
    drawCircle(player.x,player.y,player.r,player.colour)

    ctx.fillStyle = "black"
    ctx.font = "bold 30px SanSerif";
    ctx.fillText(player.id, player.x-8, player.y+8);

    //If the client is this specific player
    if(id == socket.id){
      ctx.font = "bold 25px SanSerif";
      ctx.fillText("Player Stats " , addButton1.x+55 , 20);

      ctx.font = "bold 20px SanSerif";
      ctx.fillText("X: " + player.x, addButton1.x+80 , 45);
      ctx.fillText("Y: " + player.y, addButton1.x+80 , 65);
      ctx.fillText("Points: " + player.points,addButton1.x+80, 85);
      ctx.fillText("Kills: " + player.kills, addButton1.x+80, 105);
      ctx.fillText("Deaths: " + player.deaths, addButton1.x+80, 125);
    }
    ctx.font = "bold 50px SanSerif";
    ctx.fillText(side1Points, addButton1.x-10 ,addButton1.y+10);
    ctx.fillText(side2Points, addButton2.x-10 ,addButton2.y+10);
  }
};
