'use strict';
let socket = io();

let canvas = document.getElementById('ballCanvas')
let ctx = canvas.getContext("2d");
ctx.canvas.width = 2000;
ctx.canvas.height = 2000;

//item to drag and its container
let container = document.querySelector("#ballCanvas");


//touchscreen listners
container.addEventListener("touchstart", dragStart, false);
container.addEventListener("touchend", dragEnd, false);
container.addEventListener("touchmove", drag, false);

//mouse listners
container.addEventListener("mousedown", dragStart, false);
container.addEventListener("mouseup", dragEnd, false);
container.addEventListener("mousemove", drag, false);


let rect = canvas.getBoundingClientRect();
let active = false;
let currentX = 100;
let currentY = 100;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;
let currentPlayer;
let players;
let movement = {
  x:currentX,
  y:currentY,
}
let mouse = {};


function dragStart(e){
    if (e.type === "touchstart") {
      mouse = {
        x:e.touches[0].clientX  - rect.left,
        y:e.touches[0].clientY  - rect.top,

      }
    } else {
      mouse = {
        x: e.clientX - rect.left,
        y: e.clientY  - rect.top,
      }
    }

  socket.emit('dragStart',mouse);
}

function dragEnd(e){

  if (e.type === "touchend") {
    mouse = {
      x:e.touches[0].clientX  - rect.left,
      y:e.touches[0].clientY  - rect.top,

    }
  } else {
    mouse = {
      x: e.clientX - rect.left,
      y: e.clientY  - rect.top,
    }
  }
    socket.emit('dragEnd',false);
}
function drag(e){

  if (e.type === "touchmove") {
    mouse = {
      x:e.touches[0].clientX  - rect.left,
      y:e.touches[0].clientY  - rect.top,

    }
  } else {
    mouse = {
      x: e.clientX - rect.left,
      y: e.clientY  - rect.top,
    }
  }
  socket.emit('drag',mouse);

}

socket.emit('new player',rect);
//update server on player position
setInterval(function() {
  socket.emit('movement', movement);
}, 1000 / 60);


socket.on('state', function(players) {
  //console.log(players);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'green';
  for (var id in players) {
    var player = players[id];
    ctx.beginPath();
    ctx.arc(player.x, player.y, 75, 0, 2 * Math.PI);
    ctx.fill();
  }
});

function pointInCircle(x, y, cx, cy, radius) {
  let distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
  return distancesquared <= radius * radius;
}


// function drag(e) {
//   //if dragging is happening then do stuff
//   if (active) {
//     let rect = canvas.getBoundingClientRect();
//     e.preventDefault();
//     //if using touchscreen
//     if (e.type === "touchmove") {
//       currentX = e.touches[0].clientX  - rect.left ;
//       currentY = e.touches[0].clientY  - rect.top;
//     } else {
//       currentX = e.clientX  - rect.left;
//       currentY = e.clientY  - rect.top;
//     }
//
//     //seeting the offset as the new location to allow for the next "move" to start from the new position
//     xOffset = currentX;
//     yOffset = currentY;
//     movement.x = currentX;
//     movement.y = currentY;
//   }
// }





//Main game loop
// function main() {
//   let now = Date.now();
//   let dt = (now - lastTime) / 1000.0;
//
//   lastTime = now;
//
// };

// function render() {
//
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   ctx.fillStyle = "blue";
//   player1.fill(ctx);
//
// };

// function checkWall(dt) {
//
//     if (player1.x + player1.r > canvas.width) { //Right
//       console.log("right")
//       player1.x = canvas.width - player1.r;
//     }
//     if (player1.x - player1.r < 0) { //Left
//         console.log("left")
//         player1.x = 0 + player1.r;
//     }
//     if (player1.y + player1.r > canvas.height) { //Bottom
//         console.log("bottom")
//         player1.y = canvas.height - player1.r;
//     }
//     if (player1.y - player1.r < 0) { //Top
//         console.log("top")
//         player1.y = 0 + player1.r;
//     }
//
// }


//main() // -------Start --------------
