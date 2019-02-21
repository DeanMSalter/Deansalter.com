'use strict';
//########## Constant variables / canvas stuff
const socket = io('/Tag',{transports: ['websocket']});
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



//########## Game state variables

let lastTime;
let pointerLocked = false;
let lastTap;
let mouse = {};
let players = {};


const clientData = {
  canvasWidth:ctx.canvas.width,
  canvasHeight:ctx.canvas.height,
  midPoint:midPoint,
}

//Socket interations
socket.emit('client data',clientData);
socket.on('state', function(gameData) {
  players = gameData ;
});

//Start client
main();

//########## Listener functions
window.onkeyup = function(e) {
   let key = e.keyCode ? e.keyCode : e.which;

   if (key == 76) { //L Key
     if(pointerLocked){
       document.exitPointerLock();
     }else{
       canvas.requestPointerLock();
     }
   }
   if (key == 78) { //N key
     socket.emit('new player');
   }

}

document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

document.addEventListener("touchmove", touchMove, false);
document.addEventListener("touchstart", touchStart, false);
document.addEventListener("touchend", touchEnd, false);

document.addEventListener("mousedown", click, false);

//########## Utility functions
function doubleTap(){
  let now = new Date().getTime();
  let timesince = now - lastTap;
  if((timesince < 600) && (timesince > 0)){
    socket.emit('new player');
   // double tap

  }else{
           // too much time to be a doubletap
  }
  lastTap = new Date().getTime();
}
function clearScreen(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.lineWidth = "20";
  ctx.strokeStyle = "gold";
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.stroke();





}
function drawBackgroundText(){
  ctx.fillStyle = "black"
  ctx.font = "bold 22px SanSerif";
  ctx.fillText("Stay tagged for as little time as you can", 30 ,60);
  ctx.fillText("A tagged player has a hollow circle, with a red ID", 30 ,80);
  ctx.fillText("If the tagged player is small , it means they are currently safe", 30 ,100);


}
function drawCircle(x,y,r,colour){
  if(colour !== null){
    ctx.fillStyle = colour;
  }
  ctx.beginPath();
  ctx.arc(x,y,r, 0, 2 * Math.PI);
  ctx.fill();
}
function drawHollowCircle(x,y,r,colour){
  if(colour !== null){
    ctx.strokeStyle = colour;
  }
  ctx.beginPath();
  ctx.lineWidth = 5
  ctx.arc(x, y, r, 0, Math.PI * 2, true); // Outer circle
  ctx.stroke();


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
  doubleTap()
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


  let displaySize;

  if(!players[socket.id]){
    let text = "Press N to join the game!"
    ctx.fillText(text, midPoint-ctx.measureText(text).width/2 ,500);
    text = "Or double tap if on mobile"
    ctx.fillText(text, midPoint-ctx.measureText(text).width/2 ,520);
  }
  for (let id in players) {
    let player = players[id];
    if(player.tagged){
      if(player.delayed){
        displaySize = player.r/2
      }else{
        displaySize = player.r
      }
      drawHollowCircle(player.x,player.y,displaySize,player.colour)
    }else{
      drawCircle(player.x,player.y,player.r,player.colour)
    }


    ctx.fillStyle = "black"
    ctx.font = "bold 30px SanSerif";
    if(player.tagged){
      ctx.fillStyle = "red"
    }
    ctx.fillText(player.id, player.x-8, player.y+8);

    //If the client is this specific player
    if(id == socket.id){
      if(player.tagged){
        ctx.fillStyle = "red"
        ctx.font = "bold 50px SanSerif";
        ctx.fillText("Your Tagged! ",midPoint+100, 85);
      }
      ctx.font = "bold 25px SanSerif";
      ctx.fillText("Player Stats " , midPoint-55 , 20);

      ctx.font = "bold 20px SanSerif";

      ctx.fillText("X: " + player.x, midPoint-80 , 45);
      ctx.fillText("Y: " + player.y, midPoint-80 , 65);
      ctx.fillText("Points: " + player.points,midPoint-80, 85);

    }
  }

};
