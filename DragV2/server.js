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

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'drag.html'));
});

server.listen(5000, function() {
  console.log('Starting server on port 5000');
});

let  players = {};
let  mouses = {};
let rect ;
function pointInCircle(x, y, cx, cy, radius) {
  let distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
  return distancesquared <= radius * radius;
}
//Create a listner for when a player connects.
//socket contains all the information passed to the server from the client
io.on('connection', function(socket) {
  let active = false
  //create a listner of these data to look for when a new player is created
  socket.on('new player', function(data) {
    //assign each player based on their id , a position
    players[socket.id] = {
      x: 500,
      y: 500,
      active: false
    };

    mouses[socket.id] = {
      x: 500,
      y: 500
    };

    rect = data;
  });
  //when the client calls a movement, update that clients position based on their movement
  socket.on('movement', function(data) {
    let player = players[socket.id] || {};
    // console.log(mouses)
    // console.log(socket.id)

    let mouse = mouses[socket.id] || {};
    //console.log(mouse)
    if (typeof player.active !== 'undefined'){
    //  console.log("active? " + player.active + " " + socket.id)
    }

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
  });
  socket.on('dragStart',function(data){
      let player = players[socket.id] || {};
      if (pointInCircle(data.x, data.y, player.x, player.y, 10)) {
        player.active = true;
      }
  })
  socket.on('dragEnd',function(data){
      let player = players[socket.id] || {};
      player.active = data;

  })
  socket.on('drag',function(data){
    //if dragging is happening then do stuff
    let player = players[socket.id] || {};
    let mouse = mouses[socket.id] || {};
    if (player.active) {
      mouse.x = data.x
      mouse.y = data.y
      //console.log(mouse)
    }
  })






});

//update 60 times a second to update clients
setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);
