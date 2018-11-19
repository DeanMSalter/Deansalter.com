"use strict";
//Creating canvas
const canvas = document.getElementById('ballCanvas')
const ctx = canvas.getContext("2d");
ctx.canvas.width = 900;
ctx.canvas.height = 350;
ctx.font = "20px Georgia";
const midPoint = ctx.canvas.width /2
let buttonHeightH = 30
let playableAreaH = ctx.canvas.height - buttonHeightH

//Game States
let requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);};})(); //Function to request a new frame of animation
let gameOver = false;
let paused = false;

//Game variables
let health = 5
let Score = 0
let turretSelected = false

//Timer variables
let fireNextRate = 24
let fireNextCounter = fireNextRate ;

let enemyRate = 25
let enemyCounter = enemyRate

document.addEventListener("visibilitychange", function() {
  //true if hidden
console.log( document.hidden );
  if(document.hidden){
    paused = true;
  }else{
    paused = false;
    createEnemies()
  }

}); //User active checker
canvas.oncontextmenu = function() {
    return false;
} //Disables right click menu within the game

let player = new Ball(20,ctx.canvas.height/2, 20, 1 , 0, 0,"blue","Player1");
let sprites = [player]; //Might add more players to the game at some point , hence the array
let turrets = [];
let bullets = [];

let buttons = [];//Create buttons
buttons[buttons.length] = new newButton(0,"Life-100",0,ctx.canvas.height-30,100,30,"purple","white")
buttons[buttons.length] = new newButton(1,"Health-200",100,ctx.canvas.height-30,100,30,"purple","white")
buttons[buttons.length] = new newButton(2,"Turret-250",200,ctx.canvas.height-30,100,30,"purple","white")
buttons[buttons.length] = new newButton(3,"Speed-300",300,ctx.canvas.height-30,100,30,"purple","white")

function ballCollision(ball1 , ball2){
  if (ball1 == ball2){ return false; }
  if(typeof ball1 === "undefined"){ return false;};
  if(typeof ball2 === "undefined"){ return false;};
  var dx = ball1.x - ball2.x; //Difference between x cords
  var dy = ball1.y - ball2.y; //Difference between y cords
  var distance = Math.sqrt((dx * dx) + (dy * dy));
  if(distance <= ball1.r +ball2.r){
    return true;
  }}//checks if ball1 and ball2 collide
function restart(){
  ctx.canvas.width = 900;
  ctx.canvas.height = 350;
  ctx.font = "20px Georgia";
  const midPoint = ctx.canvas.width /2
  let buttonHeightH = 30
  let playableAreaH = ctx.canvas.height - buttonHeightH

  buttons = [];
  buttons[buttons.length] = new newButton(0,"Life-100",0,ctx.canvas.height-30,100,30,"purple","white")
  buttons[buttons.length] = new newButton(1,"Health-200",100,ctx.canvas.height-30,100,30,"purple","white")
  buttons[buttons.length] = new newButton(2,"Turret-250",200,ctx.canvas.height-30,100,30,"purple","white")
  buttons[buttons.length] = new newButton(3,"Speed-300",300,ctx.canvas.height-30,100,30,"purple","white")
  player = new Ball(20,ctx.canvas.height/2, 20, 1 , 0, 0,"blue","Player1");
  sprites = [player]; //Might add more players to the game at some point , hence the array

  turrets = [];
  bullets = [];
  //Game variables
  health = 5
  Score = 0
  //Button variables
  turretSelected = false

  //Timer variables
  fireNextRate = 24
  fireNextCounter = fireNextRate ;
  enemyRate = 25
  enemyCounter = enemyRate

  player.Points = 0;
  player.Lives = 5;
  bullets.length = 0
  player.respawning = false;
  player.respawn(ctx)
  gameOver = false;
} //Starts/Resets everything

//Create functions
function Ball(x, y, r, side, dy ,dx, colour,type) {
  this.xDefault = x
  this.yDefault = y
  this.Side = side
  this.Points = 0
  this.Lives = 5;
  this.respawning = false;
  this.colour = colour;
  this.type = type;
  this.dy = (dy == null) ? 0 : dy;
  this.dx = (dx == null) ? 0 : dx;
  this.direction =0;
  this.speed = 4;
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
        this.Lives -= 1
        if(this.Lives <= -5){
          gameOver = true;
        }

        Timer(1, this);
      }
    }
    function Timer(time, circle) {

      let i = time;
      let timer = setInterval(function() {
        i--;
        if (i <= 0) {
          circle.respawning = false;

          clearInterval(timer);
        }
      }, 1000);
    }
  }
  this.wallCheck = function(ctx){
    if (this.x + this.r > canvas.width) { //Right
        this.x = canvas.width - this.r;
    }
    if (this.x - this.r < 0) { //Left
        this.x = 0 + this.r;
    }
    if (this.y + this.r > playableAreaH) { //Bottom
        this.y = playableAreaH - this.r;
    }
    if (this.y - this.r < 0) { //Top
        this.y = 0 + this.r;
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
  //  this.x =-10;
    //this.y =-10;
    this.dx = 0;
    this.dy = 0;
  }
  this.wallCheck = function(ctx){
    if (this.x + this.r > canvas.width+this.r*2) { //Right
      this.removeBullet()
    }
    if (this.x - this.r < 0 - this.r*2) { //Left
      health -= 1;
      if(health <= -5){
        gameOver = true;
      }
      this.removeBullet()
    }
    if (this.y + this.r > playableAreaH) { //Bottom
      this.dy = -1;
      //this.removeBullet()
    }
    if (this.y - this.r < this.r ) { //Top
      this.dy = 1;


  }}
  this.collisions = function(ctx){
    for(let i = 0;i<bullets.length;i++){
      if(ballCollision(this,bullets[i])){
        if(this.type !=  bullets[i].type){
          this.removeBullet()
          bullets[i].removeBullet()
          player.Points += 1
          Score +=1
        }
      }
    }
  }
}
function Turret(x,y,width,height,fireRate){
  this.x = x
  this.y = y
  this.width = width
  this.height = height
  this.fireRate = fireRate
  this.continueFiring = true
  this.fireCounter = fireRate
  this.fill = function(ctx){
    let oldStyle;
    if(this.colour){
      oldStyle = ctx.fillStyle
      ctx.fillStyle = this.colour
    }
    ctx.fillRect(this.x,this.y,this.width,this.height,this.fireRate);
    ctx.fillStyle = oldStyle

  }
  this.fire = function(ctx){
    if(!this.continueFiring || paused){ return}
      this.fireCounter -= 1
      if(this.fireCounter <= 0){
        this.fireCounter = this.fireRate
        console.log("test")
        bullets[bullets.length] = new Bullet(this.x+this.width, this.y+this.height/2, 5 , 3, 0 ,3, "green","bullet");
      }
    }
}
function newButton(id,name,x,y,width,height,colour,textColour){
      this.id = id;
      this.name=name
      this.x=x
      this.y=y
      this.width=width
      this.height=height
      this.colour=colour
      this.textColour = textColour
      this.fill = function(ctx) {
      let oldStyle;
      if(this.colour){
        oldStyle = ctx.fillStyle
        ctx.fillStyle = this.colour
      }
      ctx.fillRect(this.x,this.y,this.width,this.height);
      ctx.fillStyle = oldStyle

      }
      this.drawName = function(ctx){
        let oldStyle;
        if(this.textColour){
          oldStyle = ctx.fillStyle
          ctx.fillStyle = this.textColour
        }
        ctx.textAlign = "center"
        ctx.fillText(this.name,this.x+this.width/2,this.y+this.height/2 + this.height/5)

        ctx.fillStyle = oldStyle
        ctx.textAlign = "start"
      }


      this.contains = function(mouseX,mouseY){
        return this.x <=mouseX && mouseX <= this.x + this.width &&
              this.y <= mouseY && mouseY <= this.y + this.height;
      }
    //displayButton(newButton.x,newButton.y,newButton.width,newButton.height,newButton.colour)
              // Append <button> to <body>
  }
function createEnemies(){
  let newBullet = {
  	x: ctx.canvas.width+15,
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

  //If bullet has no direction , move it
  if(newBullet.dy == 0 && newBullet.dx == 0){
    newBullet.dx = 1;
  }

  if(paused){return}
  bullets[bullets.length] =
  new Bullet(newBullet.x, newBullet.y, newBullet.r , 3, newBullet.dy,newBullet.dx, "red","enemy");} //Calcualtions for new enemies

//INPUT
function userInput() {

  //Player shoots to the right but can move in any direction , including diagonal
  if (!player.respawning) {
    if(input.isDown('W') && input.isDown("D") || input.isDown('D') && input.isDown('W')){
      player.x += player.speed;
      player.y += -player.speed;
      player.direction = 5;
    }
    if(input.isDown('s') && input.isDown("D") || input.isDown('D') && input.isDown('s')){
      player.x += player.speed;
      player.y += player.speed;
      player.direction = 6;
    }
    if(input.isDown('S') && input.isDown("A") || input.isDown('A') && input.isDown('S')){
      player.x += -player.speed;
      player.y += player.speed;
      player.direction = 7;
    }
    if(input.isDown('W') && input.isDown("A") || input.isDown('A') && input.isDown('W')){
      player.x += -player.speed;
      player.y += -player.speed;
      player.direction =8;
    }

    if(input.isDown('SPACE')){
      fireNextCounter -= 1
      if(fireNextCounter<= 0){
        fireNextCounter = fireNextRate
        bullets[bullets.length] = new Bullet(player.x+player.r*3, player.y, 5 , 3, 0 ,3, "green","bullet");


      }
    }
}} //for when we need to detect when user is holding a key down.
window.onkeydown = function(e) {
   var key = e.keyCode ? e.keyCode : e.which;
   if(key == 80){ //User clicks P , testing purposes

   }
   if (key == 87) { //W
       player.direction = 1;
       player.y += -player.speed;
   }else if (key == 68) {//D
       player.direction = 2;
       player.x += player.speed;
   }else if (key == 83) {//S
       player.direction = 3
       player.y += player.speed;
   }else if (key == 65) {//A
       player.direction = 4;
       player.x += -player.speed;
   }
}//for key presses that are simple
canvas.onmousedown = function(event) {
    if (event.which == 3) {
        if(turretSelected){
          turretSelected = false
          buttons[2].colour = "purple"
        }
    }
}//Right click to unselect anything youve selected
canvas.addEventListener('click', event =>{
  let bound = canvas.getBoundingClientRect();
  let x = event.clientX - bound.left - canvas.clientLeft;
  let y = event.clientY - bound.top - canvas.clientTop;

  if(turretSelected){
    if(y >= playableAreaH){return}
    turretSelected = false
    player.Points -= 250
    turrets[turrets.length] = new Turret(x,y,25,25,60)
    console.log("turret created")
    buttons[2].colour = "purple"
  }
  calculateButton(x,y)}); //Click listener (mostly for buttons )
function calculateButton(x,y){
  for(let i = 0;i<buttons.length;i++){
      if(buttons[i].contains(x,y)){
        if(buttons[i].id == 0){
          button0()

        }
        if(buttons[i].id == 1){
          button1()
        }
        if(buttons[i].id == 2){
          button2()
        }
        if(buttons[i].id == 3){
          button3()
        }

      }
    }
  }
function button0(){
  if(player.Points >= 1){
    player.Lives += 1
    player.Points -= 100
  }
}
function button1(){
  if(player.Points >= 1){
    health += 1
    player.Points -= 200
  }
}
function button2(){
  if(player.Points >= 1){

    console.log("turret selected")
    buttons[2].colour = "green"
    turretSelected = true
  }
}
function button3(){
  if(player.Points >= 1){
    player.Speed += 1
    player.Points -= 300
  }
}

//Draws everything
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "purple"
  ctx.fillText("Score: " + Score, 0, 20);
  ctx.fillText("Points: " + player.Points, 0, 50);
  ctx.fillText("Lives: " + player.Lives, 0, 70);
  ctx.fillText("Health: " + health, 0, 90);
  for(let i = 0;i<sprites.length;i++){ //Draws all players
    sprites[i].fill(ctx);
  }
  for(let i = 0;i<bullets.length;i++){ // Draws all bullets (enemies included)
    bullets[i].fill(ctx);
  }
  for(let i = 0;i<buttons.length;i++){ //Draws the buttons
    buttons[i].fill(ctx)
    buttons[i].drawName(ctx)
  }
  for(let u = 0;u<turrets.length;u++){//Draws turrets
    turrets[u].fill(ctx)
  }
};
//Main game loop
function main() {
  if(paused){return};
  userInput();

  //Changes location of stuff and general calculations
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
    }
  }
  for(let u = 0;u<turrets.length;u++){
    turrets[u].fire()
  } //Fires turrets

  //Generates the next enemy
  enemyCounter -= 1;
  if(enemyCounter <= 0){
    enemyCounter = enemyRate
    createEnemies()
  }

  //Draws everything then updates the screen
  render();
  requestAnimFrame(main);

  //Resets game if game is over
  if (gameOver) {
    restart()
    return
  }
};

main() // -------Start --------------
