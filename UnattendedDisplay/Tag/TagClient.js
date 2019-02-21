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


const paddingX = 15;
const paddingY = 30;

const bottomLeft ={
  x:paddingX,
  y:canvas.height-paddingY
}
const bottomRight ={
  x:canvas.width-paddingX,
  y:canvas.height-paddingY
}
const topLeft ={
  x:paddingX,
  y:paddingY
}
const topRight ={
  x:canvas.width-paddingX,
  y:paddingY
}

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
  ctx.strokeStyle = "Green";
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.stroke();





}
function drawBackgroundText(){
  ctx.fillStyle = "black"
  ctx.font = "bold 22px SanSerif";
  let text = "Stay tagged for as little time as you can"
  ctx.fillText(text, topLeft.x ,topLeft.y);
  ctx.fillText("A tagged player has a hollow circle", topLeft.x ,topLeft.y+20);
  ctx.fillText("If the tagged player is small , it means they are currently safe",topLeft.x ,topLeft.y+40);
  ctx.fillText("Your ball with have a large and green ID",topLeft.x ,topLeft.y+60);

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
    let text = "Press N to join the game"
    ctx.fillText(text, topRight.x-ctx.measureText(text).width ,topRight.y);
    ctx.fillText("Double tap if on mobile", topRight.x-ctx.measureText(text).width ,topRight.y+20);
  }else{
    let text;
    let text2;
    if(!pointerLocked){
      ctx.fillStyle = "red"
      text = "Press L to start controlling your ball"
    }else{
      ctx.fillStyle = "black"
      text = "Move your mouse to move your ball"
    }
    if(players[socket.id].active){
      ctx.fillStyle = "red"
      text2 = "Move your finger to move your ball"
      text = ""
    }else{
      ctx.fillStyle = "black"
      text2 = "If on mobile hold onto your ball to start moving it"

    }

    if(pointerLocked){
      text2 = ""
    }
    ctx.fillText(text, bottomRight.x-ctx.measureText(text).width ,bottomRight.y-10);
    ctx.fillText(text2, bottomRight.x-ctx.measureText(text2).width ,bottomRight.y+10);

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






    //If the client is this specific player
    if(id == socket.id){
      ctx.fillStyle = "Green"
      ctx.font = "bold 45px SanSerif"
      ctx.fillText(player.id, player.x-10, player.y+10);
      if(player.tagged){
        ctx.fillStyle = "red"
        ctx.font = "bold 30px SanSerif";
        ctx.fillText("Your Tagged! ",bottomLeft.x, bottomLeft.y-55);
      }else{
        ctx.fillStyle = "black"
      }

      ctx.font = "bold 20px SanSerif";
      ctx.fillText("X: " + player.x, bottomLeft.x , bottomLeft.y-30);
      ctx.fillText("Y: " + player.y, bottomLeft.x , bottomLeft.y-10);
      ctx.fillText("Points: " + player.points,bottomLeft.x, bottomLeft.y+10);
    }else{
      ctx.fillStyle = "black"
      ctx.font = "bold 30px SanSerif";
      ctx.fillText(player.id, player.x-8, player.y+8);
    }
  }

};
