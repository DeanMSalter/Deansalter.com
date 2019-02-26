exports = module.exports = function(io){
  const baller = require('./baller');


  let canvasWidth;
  let canvasHeight;
  let midPoint;

  let addButton;

  let tagGameData = {
    players:{},
    mouses:{},
    idTracker:0,
    taggedPlayer:null,
  }


  io.on('connection', function(socket) {
    //########## game state variables
    console.log("connect")
    let canvasWidth;
    let canvasHeight;
    let midPoint;

    let addButton;

    //########## utility functions
    function newPlayer(data){

      if(tagGameData.players[data]){
        return;
      }

      console.log("new player")
      tagGameData.players[data] = {
        x: 200,
        y: 500,
        r: 45,
        colour: baller.getRandomColor(),
        active:false,
        id:tagGameData.idTracker,
        name:null,
        life:60,
        points:0,
        tagged: false,
        delayed: false,
        dead:false,
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
      io.emit('state', tagGameData.players);
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

      baller.constantMovement(player,mouse,10)

      wallCheck(player)
      collisionCheck(player)
      io.emit('state', tagGameData.players);

    }
    function mouseMovement(socket){
      let player = tagGameData.players[socket] || {};
      let mouse = tagGameData.mouses[socket] || {};
      let distanceSpeed =  0.05


       player.x += mouse.x* distanceSpeed
       player.y += mouse.y* distanceSpeed

       wallCheck(player)
       collisionCheck(player)
       io.emit('state', tagGameData.players);
    }

    socket.on('client data',function(clientData){
      canvasWidth = clientData.canvasWidth;
      canvasHeight = clientData.canvasHeight;
      midPoint = clientData.midPoint;
      addButton = clientData.addButton;
      io.emit('state', tagGameData.players);
    });
    socket.on('new player',function(){
      newPlayer(socket.id)
    });
    socket.on('usernameRecieved',function(data){
      newPlayer(socket.id)
      let player = tagGameData.players[socket.id] || {};
      player.name = data;
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

  function killPlayer(playerID){
    console.log({playerID});
    delete tagGameData.players[playerID]

   tagGameData.taggedPlayer = null;
  console.log(tagGameData)
    // tagGameData.players[playerID].dead = true;
    // tagGameData.players[playerID].x = -500;
    // tagGameData.players[playerID].y = -500;
  }
  setInterval(function(){
    if(tagGameData.taggedPlayer != null){
      if(tagGameData.players[tagGameData.taggedPlayer]){
        if(tagGameData.players[tagGameData.taggedPlayer].life > 30){
          tagGameData.players[tagGameData.taggedPlayer].life -= 1;

        }else{
          killPlayer(tagGameData.taggedPlayer);
        }
    }

    }

    for (let id in   tagGameData.players) {
      if(tagGameData.players[id]){
        if(!tagGameData.players[id].dead){
          tagGameData.players[id].points +=1;
        }
      }


    }
    io.emit('state', tagGameData.players);
  },1000*1);
}
