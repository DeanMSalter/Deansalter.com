"use strict";
//Creating canvas
const canvas = document.getElementById('ballCanvas')
const ctx = canvas.getContext("2d");
ctx.canvas.width = 900;
ctx.canvas.height = 350;
ctx.font = "20px Georgia";
let midPoint = ctx.canvas.width /2
let playableAreaH = ctx.canvas.height
let playableAreaW = 145

let base_image = new Image();
base_image.src = 'bg.jpg';

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
let base = 5
let Score = 0
let turretSelected = false
let turretMax = 2
let level = 0
let levelup = false
//Timer variables
let fireNextRate = 24
let fireNextCounter = fireNextRate ;

let enemyRate = 25
let enemyCounter = enemyRate

document.addEventListener("visibilitychange", function() {
  //true if hidden
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

let player = new Ball(playableAreaW+25,ctx.canvas.height/2, 20, 1 , 0, 0,"blue","Player1");
let sprites = [player]; //Might add more players to the game at some point , hence the array
let turrets = [];
let bullets = [];

let buttons = [];//Create buttons
buttons[buttons.length] = new newButton(0,"Life-100",0,120,140,30,"purple","white")
buttons[buttons.length] = new newButton(1,"Health-200",0,150,140,30,"purple","white")
buttons[buttons.length] = new newButton(2,"Turret-250",0,180,140,30,"purple","white")
buttons[buttons.length] = new newButton(3,"Speed-300",0,210,140,30,"purple","white")
buttons[buttons.length] = new newButton(4,"Bullets-400",0,240,140,30,"purple","white")
buttons[buttons.length] = new newButton(5,"Clear-150",0,270,140,30,"blue","white")
buttons[buttons.length] = new newButton(6,"Next Level-500",0,300,140,30,"gold","white")
function ballCollision(ball1 , ball2){

  if (ball1 == ball2){ return false; }
  if(typeof ball1 === "undefined"){ return false;};
  if(typeof ball2 === "undefined"){ return false;};
  if(ball1.type == ball2.type){ return false;};
  var dx = ball1.x - ball2.x; //Difference between x cords
  var dy = ball1.y - ball2.y; //Difference between y cords
  var distance = Math.sqrt((dx * dx) + (dy * dy));
  if(distance <= ball1.r +ball2.r){
    return true;

  }else{
    return false;
  }
}//checks if ball1 and ball2 collide
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
function restart(){
  ctx.canvas.width = 900;
  ctx.canvas.height = 350;
  ctx.font = "20px Georgia";
  const midPoint = ctx.canvas.width /2
  let buttonHeightH = 30
  let playableAreaH = ctx.canvas.height - buttonHeightH

  buttons = [];
  buttons[buttons.length] = new newButton(0,"Life-100",0,120,140,30,"purple","white")
  buttons[buttons.length] = new newButton(1,"Health-200",0,150,140,30,"purple","white")
  buttons[buttons.length] = new newButton(2,"Turret-250",0,180,140,30,"purple","white")
  buttons[buttons.length] = new newButton(3,"Speed-300",0,210,140,30,"purple","white")
  buttons[buttons.length] = new newButton(4,"Bullets-400",0,240,140,30,"purple","white")
  buttons[buttons.length] = new newButton(5,"Clear-150",0,270,140,30,"blue","white")
  buttons[buttons.length] = new newButton(6,"Next Level-500",0,300,140,30,"gold","white")

  player = new Ball(20,ctx.canvas.height/2, 20, 1 , 0, 0,"blue","Player1");
  sprites = [player]; //Might add more players to the game at some point , hence the array

  turrets = [];
  turretMax = 2
  bullets = [];
  //Game variables
  base = 5
  Score = 0
  level = 0
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
  gameOver = false;} //Starts/Resets everything
function levelUp(){
  ctx.font = "20px Georgia";
  midPoint = ctx.canvas.width /2
  playableAreaW = 145
  playableAreaH = ctx.canvas.height
  turretMax +=2
  for(let i = 0; i<buttons.length;i++){
    buttons[i].y = 120+i*30
  }
  levelup = false
}

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
    if (this.x - this.r < playableAreaW+5) { //Left
        this.x = playableAreaW+this.r+5;
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
function Bullet (x,y,r,side,dy,dx,color,type,health){
  this.Side = side
  this.colour = (color == null) ? "red" : color;
  this.type = type;
  this.health = health
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
  this.hit = function(){
    this.health -= 1

    if(this.health <= 0){
      this.removeBullet()
    }else if(this.health = 1){
      this.colour = "red"
    }


  }
  this.removeBullet = function(){
    this.Side = 0;
    this.type = "dead"
  //  this.x =-10;
    //this.y =-10;
    this.dx = 0;
    this.dy = 0;
  }
  this.wallCheck = function(ctx){
    if (this.x + this.r > canvas.width+this.r*2) { //Right
      this.removeBullet()
    }
    if (this.x - this.r < playableAreaW+5) { //Left
      base -= 1;
      if(base <= -5){
        gameOver = true;
      }
      this.removeBullet()
    }
    if (this.y + this.r > playableAreaH-this.r) { //Bottom
      this.dy = -1;
      //this.removeBullet()
    }
    if (this.y - this.r < this.r ) { //Top
      this.dy = 1;


  }}
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
        bullets[bullets.length] = new Bullet(this.x+this.width, this.y+this.height/2, 5 , 3, 0 ,3, "lightgreen","bullet",1);
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
        ctx.fillText(this.name,this.x+this.width/2,this.y+this.height/2 + this.height/5,this.width)

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

  if(level == 2){
    if(getRandomInt(2) == 1){
      bullets[bullets.length] =
      new Bullet(newBullet.x, newBullet.y, newBullet.r , 3, newBullet.dy,newBullet.dx, "darkred","enemy",2)
    }else{
       bullets[bullets.length] =
       new Bullet(newBullet.x, newBullet.y, newBullet.r , 3, newBullet.dy,newBullet.dx, "red","enemy",1)
    }
  }else{
     bullets[bullets.length] =
     new Bullet(newBullet.x, newBullet.y, newBullet.r , 3, newBullet.dy,newBullet.dx, "red","enemy",1);
  }
} //Calcualtions for new enemies


function calculateCollisions(){
  let checked = []
  for(let o = 0;o<bullets.length;o++){
    for(let i = 0;i<bullets.length;i++){
      if(i==o){continue}
      if(ballCollision(bullets[o],bullets[i])){
        checked[checked.length] == [o,i];
        if(checked.includes([i,o])){ continue}
        if(bullets[o].type !=  bullets[i].type && bullets[o].type != "dead" && bullets[i].type != "dead"){
          bullets[o].hit()
          bullets[i].hit()
          player.Points += 1
          Score +=1
        }
      }
    }
  }
}
//INPUT
function userInput() {

  //Player shoots to the right but can move in any direction , including diagonal
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
      fireNextCounter -= 1
      if(fireNextCounter<= 0){
        fireNextCounter = fireNextRate
        bullets[bullets.length] = new Bullet(player.x+player.r*3, player.y, 5 , 3, 0 ,3, "lightgreen","bullet",1);


      }
    }
}} //for when we need to detect when user is holding a key down.
window.onkeydown = function(e) {
   var key = e.keyCode ? e.keyCode : e.which;
   if(key == 80){ //User clicks P , testing purposes

   }
   if (key == 87) { //W
       player.direction = 1;
       player.dx = 0;
       player.dy = -player.speed;
   }else if (key == 68) {//D
       player.direction = 2;
       player.dx = player.speed;
       player.dy = 0;
   }else if (key == 83) {//S
       player.direction = 3
       player.dx = 0;
       player.dy = player.speed;
   }else if (key == 65) {//A
       player.direction = 4;
       player.dx = -player.speed;
       player.dy = 0;
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
        if(buttons[i].id == 4){
          button4()
        }
        if(buttons[i].id == 5){
          button5()
        }
        if(buttons[i].id == 6){
          button6()
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
  if(player.Points >= 1 && turrets.length < turretMax){

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
function button4(){
  if(player.Points >= 1){
    fireNextRate -= 1
    player.Points -= 400
  }
}
function button5(){
  if(player.Points >= 0){
    bullets = [];
    player.Points -= 150
  }
}
function button6(){
  if(player.Points >= 0){
    level +=1
    levelup = true
    //player.Points -= 500
  }
}
//Draws everything
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(base_image, 0, 0,canvas.width,canvas.height);
  ctx.fillStyle = "white"

  ctx.fillText("Score: " + Score, 0, 40);
  ctx.fillText("Points: " + player.Points, 0, 70);
  ctx.fillText("Lives: " + player.Lives, 0, 90);
  ctx.fillText("Base: " + base, 0, 110);
  ctx.fillText("Level: " + level, 0, 20);


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
  ctx.beginPath();
  ctx.strokeStyle = "green"
  ctx.lineWidth = 10
  // Staring point (10,45)
   ctx.moveTo(145,0);
  // End point (180,47)
  ctx.lineTo(145,canvas.height);
  // Make the line visible
  ctx.stroke();
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
  calculateCollisions()

  for(let o = 0;o<bullets.length;o++){
    if(typeof bullets[o] === "undefined"){ continue }
    bullets[o].wallCheck(ctx);

    if(bullets[o].type != "dead"){
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
  if(level == 1 && levelup){
    ctx.canvas.width = 900;
    ctx.canvas.height = 500;
    levelUp()
  }else if(level == 2 && levelup){
    enemyRate -= 5
    levelUp()
  }
  if (gameOver) {
    restart()
    return
  }
};

main() // -------Start --------------
