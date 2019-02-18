//########## Dependencies
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const baller = require('../baller');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

//########## Server set up
app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));
app.use(express.static("."));
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'drag.html'));
});
server.listen(5000, function() {
  console.log('Starting server on port 5000');
});

//########## game state variables
let  players = {};
let  mouses = {};
let side1Points=0;
let side2Points=0;

let canvasWidth;
let canvasHeight;
let addButton1;
let addButton2;
let midPoint;
let idTracker = 0;

//########## utility functions
function newPlayer(data,x,colour){
  console.log("new player")
  players[data] = {
    x: x,
    y: 500,
    xDefault:x,
    yDefault:500,
    r: 45,
    colour: colour,
    active:false,
    id:idTracker,
    moving: true,
    points: 0,
    kills: 0,
    deaths: 0,
  }

  mouses[data] = {
    x:0,
    y:0,
  }
}
function respawnPlayer(player){
  console.log("respawn")
  player.x = player.xDefault;
  player.y = player.yDefault;

  player.moving = false;
  setTimeout(function() {
    player.moving = true;
  }, 1 * 1000);
}

//########## Check functions
function addButtonCheck(data){
  if(typeof addButton1 != "undefined"){
    if (baller.pointInCircle(data.x, data.y, addButton1.x, addButton1.y, addButton1.r)){
      newPlayer(data.socket,200,"blue")
    }
  }
  if(typeof addButton2 != "undefined"){
    if (baller.pointInCircle(data.x, data.y, addButton2.x, addButton2.y, addButton2.r)){
      newPlayer(data.socket,750,"red")
    }
  }

}
function wallCheck(player){
  if (player.x >= (canvasWidth - player.r)-60) { //Right
    if(player.xDefault > midPoint){
      player.x = canvasWidth - player.r -60;
    }else{
      player.x = player.r + 80
      player.points += 1
      side1Points += 1
    }

  }
  if (player.y >= canvasHeight - player.r) { //Bottom
    player.y = canvasHeight - player.r;
  }
  if (player.x <= player.r + 60) { //Left
    if(player.xDefault < midPoint){
      player.x = player.r + 60
    }else{
      player.x = canvasWidth - player.r -80;
      player.points += 1
      side2Points += 1
    }

  }
  if (player.y <= player.r) { //Top
    player.y = player.r
  }
}
function collisionCheck(player){
  for(let i = 0;i<Object.keys(players).length;i++){
    if(baller.ballCollision(player,players[Object.keys(players)[i]])){

      if(player.xDefault == players[Object.keys(players)[i]].xDefault){
        continue;
      }

      else if((player.x + player.r >= midPoint) && (player.xDefault <= midPoint) ){
        respawnPlayer(player)
        players[Object.keys(players)[i]].kills += 1;
        player.deaths += 1
      }else if((player.x + player.r >= midPoint) && (player.xDefault >= midPoint)){
        respawnPlayer(players[Object.keys(players)[i]])
        player.kills += 1
        players[Object.keys(players)[i]].deaths += 1;
      }

      else if((player.x + player.r <= midPoint) && (player.xDefault <= midPoint)){
        respawnPlayer(players[Object.keys(players)[i]])
        player.kills += 1;
        players[Object.keys(players)[i]].deaths += 1;
      }else if((player.x + player.r <= midPoint) && (player.xDefault >= midPoint)){
        respawnPlayer(player)
        players[Object.keys(players)[i]].kills += 1;
        player.deaths += 1
      }
    }
  }
}

//########## movement functions
function touchMovement(socket){
  let player = players[socket] || {};
  let mouse = mouses[socket] || {};

  if(!player.moving){return};
  baller.constantMovement(player,mouse,10)

  wallCheck(player)
  collisionCheck(player)

}
function mouseMovement(socket){
  let player = players[socket] || {};
  let mouse = mouses[socket] || {};
  let distanceSpeed =  0.05

   if(!player.moving){return};
   player.x += mouse.x* distanceSpeed
   player.y += mouse.y* distanceSpeed

   wallCheck(player)
   collisionCheck(player)
}

//Socket listeners
io.on('connection', function(socket) {
  socket.on('client data',function(clientData){
    canvasWidth = clientData.canvasWidth;
    canvasHeight = clientData.canvasHeight;
    addButton1 = clientData.addButton1;
    addButton2 = clientData.addButton2;
    midPoint = clientData.midPoint;
  });

  socket.on('mouseMove',function(data){
    //if dragging is happening then do stuff
    let player = players[socket.id] || {};
    let mouse = mouses[socket.id] || {};

    mouse.x = data.x
    mouse.y = data.y
    mouseMovement(socket.id)
  });
  socket.on("click",function(data){
    let click = {
      x:data.x,
      y:data.y,
      socket:socket.id
    }
    addButtonCheck(click)
  });

  socket.on("touchStart",function(data){
    let player = players[socket.id] || {};
    if (baller.pointInCircle(data.x, data.y, player.x, player.y, player.r)) {
      player.active = true;
    }else{
      player.active = false;
    }

    let click = {
      x:data.x,
      y:data.y,
      socket:socket.id
    }
    addButtonCheck(click)

  });
  socket.on("touchEnd",function(){
    let player = players[socket.id] || {};
    player.active = false;
  });
  socket.on("touch",function(data){
    //if dragging is happening then do stuff
   let player = players[socket.id] || {};
   let mouse = mouses[socket.id] || {};

   if (player.active) {
     mouse.x = data.x
     mouse.y = data.y
     touchMovement(socket.id)
   }
  });
});

//update 60 times a second to update clients
setInterval(function() {
  let gameData = {
    players: players,
    side1Points: side1Points,
    side2Points: side2Points,
  }
  io.sockets.emit('state', gameData);
}, 1000 / 60);
