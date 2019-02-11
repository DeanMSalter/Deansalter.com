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
// Routing
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
let x =500;
let y = 500;
function pointInCircle(x, y, cx, cy, radius) {
  let distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
  return distancesquared <= radius * radius;
}
//Create a listner for when a player connects.
//socket contains all the information passed to the server from the client
io.on('connection', function(socket) {
  //create a listner of these data to look for when a new player is created
  socket.on('new player', function(data) {
    console.log("new player")
    //assign each player based on their id , a position
    players[socket.id] = {
      x: 500,
      y: 500,
      r: 50,
    };

    mouses[socket.id] = {
      x: 500,
      y: 500
    };

  });
  socket.on('client data',function(data){
    canvasWidth = data.canvasWidth;
    canvasHeight = data.canvasHeight;
  });
  socket.on('drag',function(data){
    //if dragging is happening then do stuff
    let player = players[socket.id] || {};
    let mouse = mouses[socket.id] || {};

      mouse.x = data.x
      mouse.y = data.y
      movement(socket.id)
      if(!isNaN(mouse.x) && !isNaN(mouse.y)){
      //console.log(mouse.x + " " + mouse.y)
      }

  })
  socket.on("touch",function(data){
    let player = players[socket.id] || {};
    console.log("running")
    let distanceSpeed =  0.4
    let dx = (data.x - player.x) * distanceSpeed; //the differences between the x and y positions multiplied by distanceSpeed
    let dy = (data.y - player.y) * distanceSpeed;
        //if the difference between mouse and cursor is less than 0.1 then make the ball be in the position of the mouse
        if(Math.abs(dx) + Math.abs(dy) < 0.1) {
             player.x = data.x;
             player.y = data.y;
        } else { // else add difference
             player.x += dx;
             player.y += dy;
        }
  });






});

function movement(socket){
  let player = players[socket] || {};
  let mouse = mouses[socket] || {};
  player.x += mouse.x *0.1;
  player.y += mouse.y *0.1;
  if(!isNaN(x) && !isNaN(y)){
   //console.log("1: " + x + " " + y)
  }

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
  if(!isNaN(x) && !isNaN(y)){
  }
  // player.x = x;
  // player.y = y;
}
//update 60 times a second to update clients
setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);
