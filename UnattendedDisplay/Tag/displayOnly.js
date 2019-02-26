'use strict';
//########## Constant variables / canvas stuff
const socket = io('/tagMobile',{transports: ['websocket']});
const canvas = document.getElementById('ballCanvas')
const ctx = canvas.getContext("2d");
canvas.style.height =window.innerHeight;
canvas.style.width =window.innerWidth;


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





//########## Utility functions
function isMobileDevice() {
  return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};


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

      ctx.fillStyle = "black"
      ctx.font = "bold 30px SanSerif";
      ctx.fillText(player.id, player.x-8, player.y+8);

  }

};
