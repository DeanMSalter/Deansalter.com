// Dependencies.
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));
app.use(express.static("."));
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'drag.html'));
});
server.listen(5000, function() {
  console.log('Starting server on port 5000');
});


let  players = {};
let  mouses = {};
let side1Points=0;
let side2Points=0;

let canvasWidth;
let canvasHeight;
let addButton1;
let addButton2;
let midPoint;

let x =500;
let y = 500;
let idTracker = 0;
let active = false;

function pointInCircle(x, y, cx, cy, radius) {
  let distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
  return distancesquared <= radius * radius;
}
function ballCollision(ball1 , ball2){
  //checks if ball1 and ball2 collide
  if (ball1 == ball2){ return false; }
  if(typeof ball1 === "undefined"){ return false;};
  if(typeof ball2 === "undefined"){ return false;};
  var dx = ball1.x - ball2.x; //Difference between x cords
  var dy = ball1.y - ball2.y; //Difference between y cords
  var distance = Math.sqrt((dx * dx) + (dy * dy));
  if(distance <= ball1.r +ball2.r){
    return true;
  }else{
    return false;
  }
}

function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function addButtonCheck(data){
  if(typeof addButton1 != "undefined"){
    if (pointInCircle(data.x, data.y, addButton1.x, addButton1.y, addButton1.r)){
      newPlayer(data.socket,200,"blue")
    }
  }
  if(typeof addButton2 != "undefined"){
    if (pointInCircle(data.x, data.y, addButton2.x, addButton2.y, addButton2.r)){
      newPlayer(data.socket,750,"red")
    }
  }

}
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
    x:x,
    y:y,
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
    if(ballCollision(player,players[Object.keys(players)[i]])){

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
      // if ((player.x + player.r <= midPoint) && (player.xDefault <midPoint)) {
      //   respawnPlayer(players[Object.keys(players)[i]]);
      // } else if ((players[Object.keys(players)[i]].x - players[Object.keys(players)[i]].r >= midPoint)) {
      //   respawnPlayer(player)
      // }

    }
  }
}

function touchMovement(socket){
  let player = players[socket] || {};
  let mouse = mouses[socket] || {};


  if(!player.moving){return};
  let distanceSpeed =  0.2

  let distanceSpeed =  0.1
  let dx = (mouse.x - player.x) * distanceSpeed; //the differences between the x and y positions multiplied by distanceSpeed
  let dy = (mouse.y - player.y) * distanceSpeed;
  //if the difference between mouse and cursor is less than 0.1 then make the ball be in the position of the mouse
  if(Math.abs(dx) + Math.abs(dy) < 0.1) {
    player.x = mouse.x;
    player.y = mouse.y;
  } else { // else add difference
    player.x += dx;
    player.y += dy;
  }

  wallCheck(player)
  collisionCheck(player)

}
function mouseMovement(socket){
  let player = players[socket] || {};
  let mouse = mouses[socket] || {};
  if(!player.moving){return};
  player.x += mouse.x *0.03;
  player.y += mouse.y *0.03;

  wallCheck(player)
  collisionCheck(player)
}


io.on('connection', function(socket) {
  //create a listner of these data to look for when a new player is created
  socket.on('client data',function(clientData){
    canvasWidth = clientData.canvasWidth;
    canvasHeight = clientData.canvasHeight;
    addButton1 = clientData.addButton1;
    addButton2 = clientData.addButton2;
    midPoint = clientData.midPoint;
  });
  socket.on('drag',function(data){
    //if dragging is happening then do stuff
    let player = players[socket.id] || {};
    let mouse = mouses[socket.id] || {};

    mouse.x = data.x
    mouse.y = data.y

    mouseMovement(socket.id)

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
  socket.on("touchStart",function(data){
    let player = players[socket.id] || {};
    if (pointInCircle(data.x, data.y, player.x, player.y, player.r)) {
      player.active = true;
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


    mouseMovement(socket.id)

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
  socket.on("touchStart",function(data){
    let player = players[socket.id] || {};
    if (pointInCircle(data.x, data.y, player.x, player.y, player.r)) {
      player.active = true;
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
  socket.on("click",function(data){
    let click = {
      x:data.x,
      y:data.y,
      socket:socket.id
    }
    addButtonCheck(click)
  })
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
