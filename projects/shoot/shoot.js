"use strict";
//Creating canvas
let canvas = document.getElementById('ballCanvas')
let ctx = canvas.getContext("2d");
ctx.canvas.width = 275;
ctx.canvas.height = 130;
ctx.font = "20px Georgia";
let midPoint = ctx.canvas.width / 2;


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
let nextBullet = 0;
let fireNext = true;
//create Ball.

let player = new Ball(0, 0, 20, 1 , 0, 0,"blue","Player1");
let player2 = new Ball(ctx.canvas.width,ctx.canvas.height,20,2,0,0,"green","Player2")
let wallDY = 0.1;
let wall1 = new Ball(midPoint, 5, 5, 3, wallDY ,0,"red","wall");
let wall2 = new Ball(midPoint, ctx.canvas.height-5, 5, 3, -wallDY,0,"red");

let sprites = [player,player2, wall1, wall2];
let bullets = [];

//Define the Ball
function Ball(x, y, r, side, dy ,dx, colour,type) {
  this.xDefault = x
  this.yDefault = y
  this.Side = side
  this.Score = 0
  this.Games = 0
  this.respawning = false;
  this.colour = colour;
  this.type = type;
  this.fireNext = true;
  this.dy = (dy == null) ? 0 : dy;
  this.dx = (dx == null) ? 0 : dx;
  this.x = (x === null) ? 0 : x;
  this.y = (y === null) ? 0 : y;
  this.r = (r === null) ? 0 : r;

  this.fill = function(ctx) {
    let oldStyle;
    if(this.colour){
      oldStyle = ctx.fillStyle
      ctx.fillStyle = this.colour
    }
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);

    ctx.fill();
    ctx.fillStyle = oldStyle

  }
  this.respawn = function(ctx){
    if(this.Side != 3){
      this.x=this.xDefault
      this.y=this.yDefault
      if (this.respawning) {
        Timer(1, this);
      }
    }
  }
  this.wallCheck = function(ctx){
    if (this.x + this.r > canvas.width) { //Right
      if (this.Side == 1) {
        this.Score += 1;
        this.respawning = false
        this.respawn();
        if (this.Score >= 10) {
          gameOver = true;
          this.Games += 1;
        }
      } else {
        this.x = canvas.width - this.r;
      }

    }
    if (this.x - this.r < 0) { //Left
      if (this.Side == 2) {
        this.Score += 1;
        if (this.Score >= 10) {
          gameOver = true;
          this.Games += 1;
        }
        this.respawning = false
        this.respawn(ctx)
      } else {
        this.x = 0 + this.r;
      }
    }
    if (this.y + this.r > canvas.height) { //Bottom
      if (this.Side == 3) {
        this.dy = -wallDY;
      } else {
        this.y = canvas.height - this.r;
      }

    }
    if (this.y - this.r < 0) { //Top
      if (this.Side == 3) {
        this.dy = wallDY;
      } else {
        this.y = 0 + this.r;
      }
  }
  this.collisions = function(ctx){
    for(let z = 0;z<bullets.length;z++){
      if(typeof bullets[z] === "undefined"){ break};
      var dx = bullets[z].x - this.x; //Difference between x cords
      var dy = bullets[z].y - this.y; //Difference between y cords
      var distance = Math.sqrt((dx * dx) + (dy * dy));
      if(distance <= this.r){
        this.respawning = true;
        this.respawn(ctx);
        delete bullets[z]
        nextBullet = z;
      }
    }

    for (let i = 0; i < sprites.length; i++) {
      if (this == sprites[i]) {
        continue;
      }
      var dx = this.x - sprites[i].x; //Difference between x cords
      var dy = this.y - sprites[i].y; //Difference between y cords
      var distance = Math.sqrt((dx * dx) + (dy * dy));
      if (distance <= this.r * 2 && this.Side != 3) { //If distance is less than the diameter of the ball
        if (this.x + this.r <= midPoint && this.Side == 1) {
          sprites[i].respawning = true;
          sprites[i].respawn(ctx);

        } else if (sprites[i].x - sprites[i].r >= midPoint && sprites[i].Side == 2) {
          this.respawning = true;
          this.respawn(ctx);

        }
      }
      if (distance <= sprites[i].r && this.Side == 3) {
        sprites[i].respawning = true;
        sprites[i].respawn(ctx);

      } else if (distance <= this.r && sprites[i].Side == 3) {
        this.respawning = true;
        this.respawn(ctx);

      }

  }
}
  }

}
 //Creates balls
function userInput(dt) {

  if (!player.respawning) {
    if (input.isDown('a')) {
      player.x -= 5;
    }
    if (input.isDown('d')) {
      player.x += 5;
    }
    if (input.isDown('w')) {
      player.y -= 5;
    }
    if (input.isDown('s')) {
      player.y += 5;
    }
    if(input.isDown('SPACE')){
      if(player.fireNext){
        bullets[nextBullet] = new Ball(player.x+player.r+5, player.y, 5 , 3, 0 ,3, "red");
        nextBullet += 1;
        player.fireNext = false;

        setTimeout(function(){ //Timer will fire after 250ms
          player.fireNext = true;
        }, 250)
      }
    }
  }
  if(!player2.respawning){
    if (input.isDown('left')) {
      player2.x -= 5;
    }
    if (input.isDown('right')) {
      player2.x += 5;
    }
    if (input.isDown('up')) {
      player2.y -= 5;
    }
    if (input.isDown('down')) {
      player2.y += 5;
    }
    if(input.isDown('m')){
      if(player2.fireNext){
        bullets[nextBullet] = new Ball(player2.x-player2.r-5, player2.y, 5 , 3, 0 ,-3, "red");
        nextBullet += 1;
        player2.fireNext = false;

        setTimeout(function(){ //Timer will fire after 250ms
          player2.fireNext = true;
        }, 250)
      }
    }
  }
}
 //Calculates user input

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
function Delay(time) {

  var i = time;
  var timer = setInterval(function() {
    i -= 1;
    if (i <= 0) {
      fireNext = true;
      clearInterval(timer);
    }
  }, 1000);
}
//Updates gametime.
function update(dt) {
  gameTime += dt;
  userInput(dt);
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
    player.Score = 0;
    player2.Score = 0;
    respawn(dt, player, true);
    respawn(dt, player2, true);
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
  ctx.fillStyle = "purple"
  ctx.fillText("Score: " + player.Score, 0, 20);
  ctx.fillText("Games: " + player.Games, 0, 40);



  ctx.fillStyle = "black"
  for(let i = 0;i<sprites.length;i++){
    sprites[i].wallCheck(ctx)
    sprites[i].collisions(ctx)
    sprites[i].y += sprites[i].dy;
    sprites[i].x += sprites[i].dx;
    sprites[i].fill(ctx);
  }
  for(let i = 0;i<bullets.length;i++){
    if(typeof bullets[i] !== "undefined"){
      bullets[i].y += bullets[i].dy;
      bullets[i].x += bullets[i].dx;
      bullets[i].fill(ctx);
    }

  }

};

main() // -------Start --------------
