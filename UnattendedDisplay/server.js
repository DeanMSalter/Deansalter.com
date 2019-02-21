//########## Dependencies
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const baller = require('./baller');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

const tagDefense = io.of("/TagDefense")
const tag = io.of("/Tag")
//########## Server set up
app.set('port', 5000);
app.use(express.static('.'))
app.get('/tagDefense', function(request, response) {
  app.use(express.static('TagDefense'))
  response.sendFile(path.join(__dirname, 'TagDefense/index.html'));
});
app.get('/tag', function(request, response) {
  app.use(express.static('Tag'))
  response.sendFile(path.join(__dirname, 'Tag/index.html'));
});
server.listen(5000, function() {
  console.log('Starting server on port 5000');
});

let tagDefenseGameData = {
  players:{},
  mouses:{},
  side1Points:0,
  side2Points:0,
  idTracker:0,
}
let tagGameData = {
  players:{},
  mouses:{},
  idTracker:0,
  taggedPlayer:null,
}

// //Socket listeners
tagDefense.on('connection', function(socket) {
  //########## game state variables



  let canvasWidth;
  let canvasHeight;
  let addButton1;
  let addButton2;
  let midPoint;

  //########## utility functions
  function newPlayer(data,x,colour){

    console.log("new player")
    tagDefenseGameData.players[data] = {
      x: x,
      y: 500,
      xDefault:x,
      yDefault:500,
      r: 45,
      colour: colour,
      active:false,
      id:tagDefenseGameData.idTracker,
      moving: true,
      points: 0,
      kills: 0,
      deaths: 0,
    }

    tagDefenseGameData.mouses[data] = {
      x:0,
      y:0,
    }
    tagDefenseGameData.idTracker += 1;

    let tagDefenseEmitData = {
      players: tagDefenseGameData.players,
      side1Points: tagDefenseGameData.side1Points,
      side2Points: tagDefenseGameData.side2Points,
    }
    tagDefense.emit('state', tagDefenseEmitData);
  }
  function respawnPlayer(player){
    console.log("respawn")
    player.x = player.xDefault;
    player.y = player.yDefault;

    player.moving = false;
    setTimeout(function() {
      player.moving = true;
    }, 1 * 1000);

    let tagDefenseEmitData = {
      players: tagDefenseGameData.players,
      side1Points: tagDefenseGameData.side1Points,
      side2Points: tagDefenseGameData.side2Points,
    }
    tagDefense.emit('state', tagDefenseEmitData);
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
        tagDefenseGameData.side1Points += 1
      }

    } if (player.y >= canvasHeight - player.r) { //Bottom player.y =
    canvasHeight - player.r; } if (player.x <= player.r + 60) { //Left
    if(player.xDefault < midPoint){ player.x = player.r + 60 }else{ player.x =
    canvasWidth - player.r -80; player.points += 1
    tagDefenseGameData.side2Points += 1 }

    }
    if (player.y <= player.r) { //Top
      player.y = player.r
    }
  }
  function collisionCheck(player){
    for(let i = 0;i<Object.keys(tagDefenseGameData.players).length;i++){
      if(baller.ballCollision(player,tagDefenseGameData.players[Object.keys(tagDefenseGameData.players)[i]])){

        if(player.xDefault == tagDefenseGameData.players[Object.keys(tagDefenseGameData.players)[i]].xDefault){
          continue;
        }

        else if((player.x + player.r >= midPoint) && (player.xDefault <= midPoint) ){
          respawnPlayer(player)
          tagDefenseGameData.players[Object.keys(tagDefenseGameData.players)[i]].kills += 1;
          player.deaths += 1
        }else if((player.x + player.r >= midPoint) && (player.xDefault >= midPoint)){
          respawnPlayer(tagDefenseGameData.players[Object.keys(tagDefenseGameData.players)[i]])
          player.kills += 1
          tagDefenseGameData.players[Object.keys(tagDefenseGameData.players)[i]].deaths += 1;
        }

        else if((player.x + player.r <= midPoint) && (player.xDefault <= midPoint)){
          respawnPlayer(tagDefenseGameData.players[Object.keys(tagDefenseGameData.players)[i]])
          player.kills += 1;
          tagDefenseGameData.players[Object.keys(tagDefenseGameData.players)[i]].deaths += 1;
        }else if((player.x + player.r <= midPoint) && (player.xDefault >= midPoint)){
          respawnPlayer(player)
          tagDefenseGameData.players[Object.keys(tagDefenseGameData.players)[i]].kills += 1;
          player.deaths += 1
        }
      }
    }
  }

  //########## movement functions
  function touchMovement(socket){
    let player = tagDefenseGameData.players[socket] || {};
    let mouse = tagDefenseGameData.mouses[socket] || {};

    if(!player.moving){return};
    baller.constantMovement(player,mouse,10)

    wallCheck(player)
    collisionCheck(player)
    let tagDefenseEmitData = {
      players: tagDefenseGameData.players,
      side1Points: tagDefenseGameData.side1Points,
      side2Points: tagDefenseGameData.side2Points,
    }
    tagDefense.emit('state', tagDefenseEmitData);
  }
  function mouseMovement(socket){
    let player = tagDefenseGameData.players[socket] || {};
    let mouse = tagDefenseGameData.mouses[socket] || {};
    let distanceSpeed =  0.05

     if(!player.moving){return};
     player.x += mouse.x* distanceSpeed
     player.y += mouse.y* distanceSpeed

     wallCheck(player)
     collisionCheck(player)
     let tagDefenseEmitData = {
       players: tagDefenseGameData.players,
       side1Points: tagDefenseGameData.side1Points,
       side2Points: tagDefenseGameData.side2Points,
     }
     tagDefense.emit('state', tagDefenseEmitData);
  }

  socket.on('client data',function(clientData){
    canvasWidth = clientData.canvasWidth;
    canvasHeight = clientData.canvasHeight;
    addButton1 = clientData.addButton1;
    addButton2 = clientData.addButton2;
    midPoint = clientData.midPoint;
    let tagDefenseEmitData = {
      players: tagDefenseGameData.players,
      side1Points: tagDefenseGameData.side1Points,
      side2Points: tagDefenseGameData.side2Points,
    }
    tagDefense.emit('state', tagDefenseEmitData);
  });

  socket.on('mouseMove',function(data){
    //if dragging is happening then do stuff
    let player = tagDefenseGameData.players[socket.id] || {};
    let mouse = tagDefenseGameData.mouses[socket.id] || {};

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
    console.log("touchstart")
    let player = tagDefenseGameData.players[socket.id] || {};
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
    console.log("touchend")
    let player = tagDefenseGameData.players[socket.id] || {};
    player.active = false;
  });
  socket.on("touch",function(data){
    console.log("touch")
    //if dragging is happening then do stuff
   let player = tagDefenseGameData.players[socket.id] || {};
   let mouse = tagDefenseGameData.mouses[socket.id] || {};

   if (player.active) {
     mouse.x = data.x
     mouse.y = data.y
     touchMovement(socket.id)
   }
  });
});



tag.on('connection', function(socket) {
  //########## game state variables
  console.log("connect")
  let canvasWidth;
  let canvasHeight;
  let midPoint;

  let addButton;

  //########## utility functions
  function newPlayer(data,x,colour){

    if(tagGameData.players[data]){
      console.log("duplicate");
      return;
    }

    console.log("new player")
    tagGameData.players[data] = {
      x: 200,
      y: 500,
      xDefault:x,
      yDefault:500,
      r: 45,
      colour: baller.getRandomColor(),
      active:false,
      id:tagGameData.idTracker,
      points:500,
      moving: true,
      tagged: false,
      delayed: false,
    }
    if(tagGameData.taggedPlayer == null){
      tagGameData.players[data].tagged = true;
      tagGameData.taggedPlayer = socket.id
    }
    tagGameData.mouses[data] = {
      x:0,
      y:0,
    }
    tagGameData.idTracker += 1;
    tag.emit('state', tagGameData.players);
  }
  //########## Check functions

  function wallCheck(player){
    if (player.x >= (canvasWidth - player.r)) { //Right
        player.x = canvasWidth - player.r;
    }
    if (player.y >= canvasHeight - player.r) { //Bottom
      player.y = canvasHeight - player.r;
    }
    if (player.x <= player.r ) { //Left
        player.x = player.r
    }
    if (player.y <= player.r) { //Top
      player.y = player.r
    }
  }
  function collisionCheck(player){
    for(let i = 0;i<Object.keys(tagGameData.players).length;i++){
      if(baller.ballCollision(player,tagGameData.players[Object.keys(tagGameData.players)[i]])){
        if(player.tagged && !player.delayed){
          tagGameData.players[Object.keys(tagGameData.players)[i]].tagged = true;
          player.tagged = false;
          tagGameData.taggedPlayer = Object.keys(tagGameData.players)[i]

          tagGameData.players[Object.keys(tagGameData.players)[i]].delayed = true
          setTimeout(function() {
            tagGameData.players[Object.keys(tagGameData.players)[i]].delayed = false
          }, 2 * 1000);
        }
        else if(tagGameData.players[Object.keys(tagGameData.players)[i]].tagged && !tagGameData.players[Object.keys(tagGameData.players)[i]].delayed){
          tagGameData.players[Object.keys(tagGameData.players)[i]].tagged = false;
          player.tagged = true;
          tagGameData.taggedPlayer = socket.id

          player.delayed = true
          setTimeout(function() {
            player.delayed = false
          }, 2 * 1000);


        }
      }
    }
  }

  //########## movement functions
  function touchMovement(socket){
    let player = tagGameData.players[socket] || {};
    let mouse = tagGameData.mouses[socket] || {};

    if(!player.moving){return};
    baller.constantMovement(player,mouse,10)

    wallCheck(player)
    collisionCheck(player)
    tag.emit('state', tagGameData.players);

  }
  function mouseMovement(socket){
    let player = tagGameData.players[socket] || {};
    let mouse = tagGameData.mouses[socket] || {};
    let distanceSpeed =  0.05

     if(!player.moving){return};
     player.x += mouse.x* distanceSpeed
     player.y += mouse.y* distanceSpeed

     wallCheck(player)
     collisionCheck(player)
     tag.emit('state', tagGameData.players);
  }

  socket.on('client data',function(clientData){
    canvasWidth = clientData.canvasWidth;
    canvasHeight = clientData.canvasHeight;
    midPoint = clientData.midPoint;
    addButton = clientData.addButton;
    tag.emit('state', tagGameData.players);
  });
  socket.on('new player',function(){
    newPlayer(socket.id)
  });
  socket.on('mouseMove',function(data){
    //if dragging is happening then do stuff
    let player = tagGameData.players[socket.id] || {};
    let mouse = tagGameData.mouses[socket.id] || {};

    mouse.x = data.x
    mouse.y = data.y
    mouseMovement(socket.id)
  });


  socket.on("touchStart",function(data){
    let player = tagGameData.players[socket.id] || {};
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

  });
  socket.on("touchEnd",function(){
    let player = tagGameData.players[socket.id] || {};
    player.active = false;
  });
  socket.on("touch",function(data){
    //if dragging is happening then do stuff
   let player = tagGameData.players[socket.id] || {};
   let mouse = tagGameData.mouses[socket.id] || {};

   if (player.active) {
     mouse.x = data.x
     mouse.y = data.y
     touchMovement(socket.id)
   }
  });


});

setInterval(function(){
  if(tagGameData.taggedPlayer != null){
    tagGameData.players[tagGameData.taggedPlayer].points -= 1;
  }

},1000*1);

//Send data every second just to ensure that the client stays somewhat up to date even if no real change occurs
setInterval(function(){
  tag.emit('state', tagGameData.players);
},1000*1);
// //update 60 times a second to update clients
//
// setInterval(function() {
//   let tagDefenseEmitData = {
//     players: tagDefenseGameData.players,
//     side1Points: tagDefenseGameData.side1Points,
//     side2Points: tagDefenseGameData.side2Points,
//   }
//   tagDefense.emit('state', tagDefenseEmitData);
// }, 2000 );
//
// setInterval(function() {
//    tag.emit('state', tagGameData.players);
// }, 2000 );
