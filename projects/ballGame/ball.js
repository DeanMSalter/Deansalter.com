


"use strict";
window.addEventListener("keydown", function(e) { //Prevents the arrow keys scrolling the screen
    // space and arrow keys
    if([32,33,34,35, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

//Creating canvas
let canvas = document.getElementById('ballCanvas')
let ctx = canvas.getContext("2d");
ctx.canvas.width = 480;
ctx.canvas.height = 250;
ctx.font = "20px Georgia";

//Game States
let lastTime;
let requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})(); //Function to request a new frame of animation
let gameOver = false;
let midPoint = ctx.canvas.width / 2;

let playerRadius = 20;
let player1 = new Circle(0, 0, playerRadius, 1);
let player2 = new Circle(ctx.canvas.width, ctx.canvas.height, playerRadius, 2);

let wallDY = 0.1;
let wall1 = new Circle(midPoint, 5, 5, 3, wallDY);
let wall2 = new Circle(midPoint, ctx.canvas.height, 5, 3, -wallDY);

let sprites = [player1, player2, wall1, wall2];

//Define the circle
function Circle(x, y, r, side, dy) {
  this.xDefault = x
  this.yDefault = y
  this.Side = side
  this.Score = 0
  this.Games = 0
  this.respawning = false;
  this.dy = (dy == null) ? 0 : dy;
  this.x = (x === null) ? 0 : x;
  this.y = (y === null) ? 0 : y;
  this.r = (r === null) ? 0 : r;

  this.fill = function(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function userInput(dt) {

  if (!player1.respawning) {
    if (input.isDown('a')) {
      player1.x -= 5;
    }
    if (input.isDown('d')) {
      player1.x += 5;
    }
    if (input.isDown('w')) {
      player1.y -= 5;
    }
    if (input.isDown('s')) {
      player1.y += 5;
    }
  }
  if (!player2.respawning) {
    if (input.isDown("LEFT")) {
      player2.x -= 5;
    }
    if (input.isDown('RIGHT')) {
      player2.x += 5;
    }
    if (input.isDown('UP')) {
      player2.y -= 5;
    }
    if (input.isDown('DOWN')) {
      player2.y += 5;
    }
  }
}

function checkWall(dt) {
  for (Circle in sprites) {
    if (sprites[Circle].x + sprites[Circle].r > canvas.width) { //Right

      //Score Calculations
      if (sprites[Circle].Side == 1) {
        sprites[Circle].Score += 1;
        respawn(dt, sprites[Circle], false);
        if (sprites[Circle].Score >= 10) {
          gameOver = true;
          sprites[Circle].Games += 1;
        }
      //-----

      } else {
        sprites[Circle].x = canvas.width - sprites[Circle].r;
      }

    }
    if (sprites[Circle].x - sprites[Circle].r < 0) { //Left
      //Score Calculations
      if (sprites[Circle].Side == 2) {
        sprites[Circle].Score += 1;
        respawn(dt, sprites[Circle], false);
        if (sprites[Circle].Score >= 10) {
          gameOver = true;
          sprites[Circle].Games += 1;
        }
      //-----

      } else {
        sprites[Circle].x = 0 + sprites[Circle].r;
      }
    }
    if (sprites[Circle].y + sprites[Circle].r > canvas.height) { //Bottom
      if (sprites[Circle].Side == 3) {
        sprites[Circle].dy = -wallDY;
      } else {
        sprites[Circle].y = canvas.height - sprites[Circle].r;
      }

    }
    if (sprites[Circle].y - sprites[Circle].r < 0) { //Top
      if (sprites[Circle].Side == 3) {
        sprites[Circle].dy = wallDY;
      } else {
        sprites[Circle].y = 0 + sprites[Circle].r;
      }

    }
  }
}

function checkCollision(dt) {
  for (Circle in sprites) {
    for (let i = 0; i < sprites.length; i++) {
      if (Circle == i) {
        continue;
      }

      //Calculate distance between sprites
      var dx = sprites[Circle].x - sprites[i].x; //Difference between x cords
      var dy = sprites[Circle].y - sprites[i].y; //Difference between y cords
      var distance = Math.sqrt((dx * dx) + (dy * dy));

      //Check for player collisions
      if (distance <= sprites[Circle].r * 2) { //If distance is less than the diameter of the circle
        if (sprites[Circle].x + sprites[Circle].r <= midPoint) {
          respawn(dt, sprites[i], true);
        } else if (sprites[i].x - sprites[i].r >= midPoint) {
          respawn(dt, sprites[Circle], true);
        }
      }

      //Check for wall collisions
      if(distance <= sprites[i].r){
        respawn(dt, sprites[i], true);
      }
    }
  }
}

function respawn(dt, circle, killed) {
  if (circle.Side == 3) {
    return;
  }
  circle.x = circle.xDefault
  circle.y = circle.yDefault
  if (killed) {
    circle.respawning = true;
    respawnTimer(1, circle);
  } else {
    circle.respawning = false;
  }
  function respawnTimer(time, circle) {
    var i = time;
    var timer = setInterval(function() {
      i--;
      if (i <= 0) {
        circle.respawning = false;
        clearInterval(timer);
      }
    }, 1000);
  }
}

//Updates gametime.
function update(dt) {
  userInput(dt);
  checkWall(dt);
  checkCollision(dt);
}

//Main game loop
function main() {
  let now = Date.now();
  let dt = (now - lastTime) / 1000.0;

  update(dt);
  render();

  lastTime = now;
  requestAnimFrame(main);
  if (gameOver) {
    player1.Score = 0;
    player2.Score = 0;
    respawn(dt, player1, true);
    respawn(dt, player2, true);
    let lastTime;
    gameOver = false;
  }
};

//Draws all the stuff
function render() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.moveTo(midPoint, 0);
  ctx.lineTo(midPoint, ctx.canvas.height);
  ctx.stroke();

  ctx.fillStyle = "blue";
  player1.fill(ctx);

  ctx.fillStyle = "red";
  player2.fill(ctx);

  ctx.fillStyle = "white"
  ctx.fillText("Score: " + player1.Score, 0, 20);
  ctx.fillText("Score: " + player2.Score, midPoint * 2 - 85, 20);
  ctx.fillText("Games: " + player1.Games, 0, 40);
  ctx.fillText("Games: " + player2.Games, midPoint * 2 - 85, 40);

  wall1.y += wall1.dy;
  wall2.y += wall2.dy;
  wall1.fill(ctx);
  wall2.fill(ctx)

};

main() // -------Start --------------
