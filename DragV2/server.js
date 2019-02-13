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
let canvasWidth;
let canvasHeight;
let addButton;

let x =500;
let y = 500;
let idTracker = 0;
let active = false;

function pointInCircle(x, y, cx, cy, radius) {
  let distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
  return distancesquared <= radius * radius;
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
  if (pointInCircle(data.x, data.y, addButton.x, addButton.y, addButton.r)){
    newPlayer(data.socket)
  }
}
function newPlayer(data){
  console.log("new player")
  players[data] = {
    x: 500,
    y: 500,
    r: 50,
    colour: getRandomColor(),
    active:false,
    id:idTracker,
  };

  mouses[data] = {
    x: 500,
    y: 500
  };
  idTracker += 1;
}

function touchMovement(socket){
  let player = players[socket] || {};
  let mouse = mouses[socket] || {};

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
}
function mouseMovement(socket){
  let player = players[socket] || {};
  let mouse = mouses[socket] || {};

  player.x += mouse.x *0.1;
  player.y += mouse.y *0.1;

  if (player.x > canvasWidth + player.r) {
    player.x = -player.r;
  }
  if (player.y > canvasHeight + player.r) {
    player.y = -player.r;
  }
  if (player.x < -player.r) {
    player.x = canvasWidth + player.r;
  }
  if (player.y < -player.r) {
    player.y = canvasHeight + player.r;
  }
}
//Create a listner for when a player connects.
//socket contains all the information passed to the server from the client

io.on('connection', function(socket) {
  //create a listner of these data to look for when a new player is created
  socket.on('new player', function(){
    newPlayer()
  });
  socket.on('client data',function(clientData){
    canvasWidth = clientData.canvasWidth;
    canvasHeight = clientData.canvasHeight;
    addButton = clientData.addButton;
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
  io.sockets.emit('state', players);
}, 1000 / 60);
