"use strict";
localStorage.setItem("store", "testthing");

//Creating canvas
let canvas = document.getElementById('ballCanvas')
let ctx = canvas.getContext("2d");
ctx.canvas.width = 275;
ctx.canvas.height = 130;
ctx.font = "20px Georgia";

//Game States
let lastTime;
let lastFire = Date.now();
let gameTime = 0;
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
//create Ball.
let midPoint = ctx.canvas.width / 2;
let circ = new Circle(0, 0, 20, 0, 0, 1);
let circ2 = new Circle(300, 300, 20, 300, 300, 2);
let wallDY = 0.1;
let wall1 = new Circle(midPoint, 5, 5, midPoint, 0, 3, wallDY);
let wall2 = new Circle(midPoint, ctx.canvas.height, 5, midPoint, ctx.canvas.height - 5, 3, -wallDY);
let sprites = [circ, circ2, wall1, wall2];
//Define the circle
function Circle(x, y, r, xDefault, yDefault, side, dy) {
  this.xDefault = xDefault
  this.yDefault = yDefault
  this.Side = side
  this.Score = 0
  this.Games = 0
  this.dy = (dy == null) ? 0 : dy;
  this.respawning = false;
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

  if (!circ.respawning) {
    if (input.isDown('a')) {
      circ.x -= 5;
    }
    if (input.isDown('d')) {
      circ.x += 5;
    }
    if (input.isDown('w')) {
      circ.y -= 5;
    }
    if (input.isDown('s')) {
      circ.y += 5;
    }
  }
  if (!circ2.respawning) {
    if (input.isDown("LEFT")) {
      circ2.x -= 5;
    }
    if (input.isDown('RIGHT')) {
      circ2.x += 5;
    }
    if (input.isDown('UP')) {
      circ2.y -= 5;
    }
    if (input.isDown('DOWN')) {
      circ2.y += 5;
    }
  }
}

function checkWall(dt) {
  for (Circle in sprites) {
    if (sprites[Circle].x + sprites[Circle].r > canvas.width) { //Right
      if (sprites[Circle].Side == 1) {
        sprites[Circle].Score += 1;
        respawn(dt, sprites[Circle], false);
        if (sprites[Circle].Score >= 10) {
          gameOver = true;
          sprites[Circle].Games += 1;
        }
      } else {
        sprites[Circle].x = canvas.width - sprites[Circle].r;
      }

    }
    if (sprites[Circle].x - sprites[Circle].r < 0) { //Left
      if (sprites[Circle].Side == 2) {
        sprites[Circle].Score += 1;
        if (sprites[Circle].Score >= 10) {
          gameOver = true;
          sprites[Circle].Games += 1;
        }
        respawn(dt, sprites[Circle], false);

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
      var dx = sprites[Circle].x - sprites[i].x; //Difference between x cords
      var dy = sprites[Circle].y - sprites[i].y; //Difference between y cords
      var distance = Math.sqrt((dx * dx) + (dy * dy));
      if (distance <= sprites[Circle].r * 2 && sprites[Circle].Side != 3) { //If distance is less than the diameter of the circle
        if (sprites[Circle].x + sprites[Circle].r <= midPoint && sprites[Circle].Side == 1) {
          respawn(dt, sprites[i], true);
        } else if (sprites[i].x - sprites[i].r >= midPoint && sprites[i].Side == 2) {
          respawn(dt, sprites[Circle], true);
        }
      }
      if (distance <= sprites[i].r && sprites[Circle].Side == 3) {
        respawn(dt, sprites[i], true);
      } else if (distance <= sprites[Circle].r && sprites[i].Side == 3) {
        respawn(dt, sprites[Circle], true);
      }
      // sprites[Circle].x = sprites[Circle].xDefault
      // sprites[Circle].y = sprites[Circle].yDefault
      //sprites[i].x = sprites[i].xDefault
      //sprites[i].y = sprites[i].yDefault

    }
  }
}

function Timer(time, circle) {
  var i = time;
  var timer = setInterval(function() {
    i--;
    if (i <= 0) {
      circle.respawning = false;
      clearInterval(timer);
    }
  }, 1000);
}

function respawn(dt, circle, killed) {
  if (circle.Side == 3) {
    return;

  }
  circle.x = circle.xDefault
  circle.y = circle.yDefault
  if (killed) {
    circle.respawning = true;
    Timer(1, circle);
  } else {
    circle.respawning = false;
  }

}

//Updates gametime.
function update(dt) {
  gameTime += dt;
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
    circ.Score = 0;
    circ2.Score = 0;
    respawn(dt, circ, true);
    respawn(dt, circ2, true);
    let lastTime;
    let lastFire = Date.now();
    let gameTime = 0;
    gameOver = false;
  }
};

function render() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(midPoint, 0);
  ctx.lineTo(midPoint, ctx.canvas.height);
  ctx.stroke();
  ctx.fillStyle = "blue";
  circ.fill(ctx);

  ctx.fillStyle = "red";
  circ2.fill(ctx);
  ctx.fillStyle = "purple"
  ctx.fillText("Score: " + circ.Score, 0, 20);
  ctx.fillText("Score: " + circ2.Score, midPoint * 2 - 85, 20);
  ctx.fillText("Games: " + circ.Games, 0, 40);
  ctx.fillText("Games: " + circ2.Games, midPoint * 2 - 85, 40);
  wall1.y += wall1.dy;
  wall2.y += wall2.dy;
  wall1.fill(ctx);
  wall2.fill(ctx)

};

main() // -------Start --------------