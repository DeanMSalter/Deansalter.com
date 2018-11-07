"use strict";
//Creating canvas
let canvas = document.getElementById('ballCanvas')
let ctx = canvas.getContext("2d");

ctx.canvas.width = 850;
ctx.canvas.height = 600;
ctx.font = "20px Georgia";
let midPoint = ctx.canvas.width / 2;


//Game States
let lastTime;
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

let player = new Ball(0, 0, 20, 1 , 1, 0,"blue","Player1");

let wallDY = 0.1;


let sprites = [player];
let bullets = [];
let bulletStart = 0;

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
  this.direction =0;
  this.speed = 3;
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
      if(this.Side ==3 ){
        this.Side == 0;

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
}
  this.collisions = function(ctx){

    for(let z = 0;z<bullets.length;z++){
      if( ballCollision(this,bullets[z])){
        this.respawning = true
        this.respawn(ctx)
        bullets[z].removeBullet()
      }
    }

    for (let i = 0; i < sprites.length; i++) {
      if( ballCollision(this,bullets[i])){
        if (this.x + this.r <= midPoint && this.Side == 1) {
          sprites[i].respawning = true;
          sprites[i].respawn(ctx);

        } else if (sprites[i].x - sprites[i].r >= midPoint && sprites[i].Side == 2) {
          this.respawning = true;
          this.respawn(ctx);

        }
      }
    }
  }
}
function Bullet (x,y,r,side,dy,dx,color,type){
  this.Side = side
  this.colour = (color == null) ? "red" : color;
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
  this.removeBullet = function(ctx){
    this.Side = 0;
    this.x =-10;
    this.y =-10;
    this.dx = 0;
    this.dy = 0;
  }
  this.wallCheck = function(ctx){
    if (this.x + this.r > canvas.width+this.r*2) { //Right

      this.removeBullet()
    }
    if (this.x - this.r < 0 - this.r*2) { //Left
      this.removeBullet()
    }
    if (this.y + this.r > canvas.height + this.r*2) { //Bottom
      this.removeBullet()
    }
    if (this.y - this.r < 0 - this.r*2) { //Top
      this.removeBullet()
  }
}
  this.collisions = function(ctx){
    for(let i = 0;i<bullets.length;i++){
      if(ballCollision(this,bullets[i])){
        if(this.type !=  bullets[i].type){
        console.log("Collide")
        this.removeBullet()
        bullets[i].removeBullet()
        }
      }
    }
    for(let o = 0;o<sprites.length;o++){
      if(ballCollision(this,sprites[o])){
        this.removeBullet();
        sprites[o].respawning = true;
        sprites[o].respawn(ctx)
      }
//      console.log(ballCollision(this,sprites[o]))
    }
  }
}
function createBullet(){
  let newBullet = {
  	x: Math.floor(Math.random() * 500) + 450,
  	y: Math.floor(Math.random() * 500) + 50,
    r:15,
    dx: 0,
    dy:0
  };
  let dx = player.x - newBullet.x; //Difference between x cords
  let dy = player.y - newBullet.y; //Difference between y cords

  //Calculate direction
  if(dx >= -player.r*3 && dx <= player.r*3){
    newBullet.dx = 0;
  }else if(dx > 0){
    newBullet.dx = 1
  }else if(dx <0){
    newBullet.dx = -1
  }

  if(dy >= -player.r*3 && dy <= player.r*3){
    newBullet.dy = 0;
  }else if(dy > 0){
    newBullet.dy = 1
  }else if(dy <0){
    newBullet.dy = -1
  }

  if(newBullet.dy == 0 && newBullet.dx == 0){
    newBullet.dx = 1;
  }


  bullets[nextBullet] = new Bullet(newBullet.x, newBullet.y, newBullet.r , 3, newBullet.dy,newBullet.dx, "red","enemy");
  nextBullet +=1;
  setTimeout(function(){ //Timer will fire after 250ms
    createBullet()
  }, 250)
}
function userInput(dt) {

  if (!player.respawning) {
    if(input.isDown('W') && input.isDown("D") || input.isDown('D') && input.isDown('W')){
      player.dx = player.speed;
      player.dy = -player.speed;
      player.direction = 5;
    }
    if(input.isDown('s') && input.isDown("D") || input.isDown('D') && input.isDown('s')){
      player.dx = player.speed;
      player.dy = player.speed;
      player.direction = 6;
    }
    if(input.isDown('S') && input.isDown("A") || input.isDown('A') && input.isDown('S')){
      player.dx = -player.speed;
      player.dy = player.speed;
      player.direction = 7;
    }
    if(input.isDown('W') && input.isDown("A") || input.isDown('A') && input.isDown('W')){
      player.dx = -player.speed;
      player.dy = -player.speed;
      player.direction =8;
    }

    if(input.isDown('SPACE')){
      if(player.fireNext){
        //  x, y, r, side, dy ,dx, colour,type
        // if(player.direction == 1){//W
        //   bullets[nextBullet] = new Bullet(player.x, player.y-player.r*2, 5 , 3, -3 ,0, "red");
        // }else if(player.direction == 2){//D
        //   bullets[nextBullet] = new Bullet(player.x+player.r*2, player.y, 5 , 3, 0 ,3, "red");
        // }else if(player.direction == 3){//S
        //   bullets[nextBullet] = new Bullet(player.x, player.y+player.r*2, 5 , 3, 3 ,0, "red");
        // }else if(player.direction == 4){//D
        //   bullets[nextBullet] = new Bullet(player.x-player.r*2, player.y, 5 ,3, 0 ,-3, "red");
        // }else if(player.direction == 5){//WD
        //   bullets[nextBullet] = new Bullet(player.x+player.r*2, player.y-player.r*2, 5 ,3, -3 ,3, "red");
        // }else if(player.direction == 6){//DS
        //   bullets[nextBullet] = new Bullet(player.x+player.r*2, player.y+player.r*2, 5 ,3, 3 ,3, "red");
        // }else if(player.direction == 7){//AS
        //   bullets[nextBullet] = new Bullet(player.x-player.r*2, player.y+player.r*2, 5 ,3, 3 ,-3, "red");
        // }else if(player.direction == 8){//AW
        //   bullets[nextBullet] = new Bullet(player.x-player.r*2, player.y-player.r*2, 5 ,3, -3 ,-3, "red");
        // }
        bullets[nextBullet] = new Bullet(player.x+player.r*2, player.y, 5 , 3, 0 ,3, "red","bullet");

        nextBullet += 1;
        player.fireNext = false;

        setTimeout(function(){ //Timer will fire after 250ms
          player.fireNext = true;
        }, 250)
      }
    }

}
}

window.onkeydown = function(e) {
   var key = e.keyCode ? e.keyCode : e.which;



   if(key == 80){
     createBullet()
   }
   if (key == 87) { //W
       player.direction = 1;
   }else if (key == 68) {//D
       player.direction = 2;
   }else if (key == 83) {//S
       player.direction = 3
   }else if (key == 65) {//A
       player.direction = 4;
   }
   if(player.direction == 1){ //W
     player.dx = 0;
     player.dy = -player.speed;
   }else if(player.direction == 2){ //D
     player.dx = player.speed;
     player.dy = 0;
   }else if(player.direction == 3){ //S
     player.dx = 0;
     player.dy = player.speed;
   }else if(player.direction == 4){//A
     player.dx = -player.speed;
     player.dy = 0;
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
  for(let i = 0;i<sprites.length;i++){
    sprites[i].wallCheck(ctx)
    sprites[i].collisions(ctx)
    sprites[i].y += sprites[i].dy;
    sprites[i].x += sprites[i].dx;
  }
  for(let o = 0;o<bullets.length;o++){
    if(typeof bullets[o] === "undefined"){ continue }
    bullets[o].wallCheck(ctx);
    bullets[o].collisions(ctx);
    if(bullets[o].Side != 0){
      bullets[o].y += bullets[o].dy;
      bullets[o].x += bullets[o].dx;
    }else{
        bullets.splice(o,1)
        nextBullet -=1
    }
  }
  render();
  lastTime = now;
  requestAnimFrame(main);
  if (gameOver) {
    player.Score = 0;
    player.respawn(ctx)
    let lastTime;
    let gameTime = 0;
    gameOver = false;
  }
};
function render() {
  ballCollision();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "purple"
  ctx.fillText("Score: " + player.Score, 0, 20);
  ctx.fillText("Games: " + player.Games, 0, 40);



  ctx.fillStyle = "black"
  for(let i = 0;i<sprites.length;i++){
      sprites[i].fill(ctx);
  }
  let bLength = bullets.length
  for(let i = 0;i<bLength;i++){
      bullets[i].fill(ctx);
  }

};

main() // -------Start --------------
