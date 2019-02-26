'use strict';
//########## Constant variables / canvas stuff
const socket = io('/tagMobile',{transports: ['websocket']});
const canvas = document.getElementById('ballCanvas')
canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
const ctx = canvas.getContext("2d");
canvas.style.height =window.innerHeight +"px";
canvas.style.width =window.innerWidth +"px";


if(!isMobileDevice()){
  window.location.href = '/tagDesktop';
}

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
let allPlayers = {};
let oldPlayerLength = 0;

const clientData = {
  canvasWidth:ctx.canvas.width,
  canvasHeight:ctx.canvas.height,
  midPoint:midPoint,
}

//Socket interations
socket.emit('client data',clientData);
socket.on('state', function(gameData) {
  players = gameData ;
  let playerLength = Object.keys(players).length
  let allPlayersLength = Object.keys(allPlayers).length
  for(let id =0;id<playerLength;id++){
    allPlayers[Object.keys(players)[id]] = players[Object.keys(players)[id]]
  }

  oldPlayerLength = playerLength;
  //console.log(allPlayers)
});

//Start client
main();

//########## Listener functions


document.addEventListener("touchmove", touchMove, false);
document.addEventListener("touchstart", touchStart, false);
document.addEventListener("touchend", touchEnd, false);


//########## Utility functions
function isMobileDevice() {
  return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

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
  ctx.fillText("Stay tagged for as little time as you can", topLeft.x ,topLeft.y);
  ctx.fillText("A tagged player has a hollow circle", topLeft.x ,topLeft.y+paddingY);
  ctx.fillText("If the tagged player is small , it means they are currently safe",topLeft.x ,topLeft.y+paddingY*2);
  ctx.fillText("Your ball will have a large and green ID",topLeft.x ,topLeft.y+paddingY*3);
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
function drawJoinText(){
  ctx.fillStyle = "black"
  ctx.fillText("Double tap to join!", topRight.x-ctx.measureText("Double tap to join!").width ,topRight.y);
}
function drawControlText(){
  let text;

  if(players[socket.id].active){
    ctx.fillStyle = "red"
    text = "Move your finger to move your ball"
  }else{
    ctx.fillStyle = "black"
    text = "Hold onto your ball to start moving it"
  }

  ctx.fillText(text, bottomRight.x-ctx.measureText(text).width ,bottomRight.y-10);
}
function drawLeaderboard(){
  let leaderboardTop = topRight.y
  let leaderboardPadding = 0;
  if(!players[socket.id]){ //If player hasnt joined
    leaderboardTop = paddingY*4
  }
  ctx.fillText("Leaderboard", topRight.x-ctx.measureText("Leaderboard").width, leaderboardTop+leaderboardPadding);
  let playersIsEmpty = true;
  for(let id in allPlayers){
    playersIsEmpty = false;
    let player = allPlayers[id];
    if(id == socket.id){
      ctx.fillStyle = "green"
    }else if(players[id] == null){
      ctx.fillStyle = "orange"
    }else if (player.tagged){
      ctx.fillStyle = "red"
    }
    else{
      ctx.fillStyle = "black"
    }


    ctx.font = "bold 20px SanSerif"

    let displayName;
    if(player.name ){
      displayName = player.name
    }else{
      displayName = player.id
    }
    let playerScore = displayName + "- L: " + player.life + " P: " + player.points

    ctx.fillText(playerScore, topRight.x-ctx.measureText(playerScore).width, topRight.y+leaderboardPadding+leaderboardTop-10);

    leaderboardPadding += 20;
  }
  if(playersIsEmpty){
    ctx.fillStyle = "red"
    let playerScore = "~~Game is empty~~"
    ctx.fillText(playerScore, topRight.x-ctx.measureText(playerScore).width, topRight.y+leaderboardPadding+leaderboardTop-10);
  }



}
//########## Simple listener/response functions

//Monitors when the cursor lock status changes, acts accordingly


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
function enteredUsername(){
  socket.emit('usernameRecieved',document.getElementById('uNameInputField').value);
}
//Mouse status changes


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
  drawLeaderboard();

  if(!players[socket.id]){ //If player hasnt joined
    document.getElementById("uNameInput").style.display = "block";
    drawJoinText()
    //document.getElementById("ballCanvas").style.height = "85vh";
  }else{
    drawControlText()
  //  document.getElementById("ballCanvas").style.height = "90vh";
    document.getElementById("uNameInput").style.display = "none";
  }




  for (let id in players) {
    let player = players[id];
    if(player.tagged && player.delayed){
        drawHollowCircle(player.x,player.y,player.r/2,player.colour)
    }else if (player.tagged && !player.delayed){
        drawHollowCircle(player.x,player.y,player.r,player.colour)
    }else{
        drawCircle(player.x,player.y,player.r,player.colour)
    }



    //If the client is this specific player
    if(id == socket.id){
      ctx.fillStyle = "Green"
      ctx.font = "bold 45px SanSerif"
      ctx.fillText(player.id, player.x-10, player.y+12);
      if(player.tagged){
        ctx.fillStyle = "red"
        ctx.font = "bold 30px SanSerif";
        ctx.fillText("Your Tagged! ",bottomLeft.x, bottomLeft.y-paddingY*5);
      }else{
        ctx.fillStyle = "black"
      }

      ctx.font = "bold 20px SanSerif";
      ctx.fillText("Name/ID: " + player.name + "/" + player.id, bottomLeft.x , bottomLeft.y-paddingY*4);
      ctx.fillText("X: " + player.x, bottomLeft.x , bottomLeft.y-paddingY*3);
      ctx.fillText("Y: " + player.y, bottomLeft.x , bottomLeft.y-paddingY*2);
      ctx.fillText("life: " + player.life,bottomLeft.x, bottomLeft.y-paddingY);
      ctx.fillText("points: " + player.points,bottomLeft.x, bottomLeft.y);
    }else{
      ctx.fillStyle = "black"
      ctx.font = "bold 30px SanSerif";
      ctx.fillText(player.id, player.x-8, player.y+8);
    }
  }

};
