'use strict';


let x;
let y;
window.setInterval(function(){
  loadMessages();
}, 1000);


window.addEventListener('load', initialize);
function initialize(){
  loadMessages();
}



console.log("running")

async function loadMessages (isUpdate = false) {
  console.log("test")
  const response = await fetch('http://www.deansalter.com:8080/position');
  if (!response.ok) {
    console.log("error")
    console.error('bad response');
    return;
  }
  const data = await response.json();
  console.log(data[0].x)
  x = data[0].x
  y = data[0].y
}



let canvas = document.getElementById('ballCanvas')
let ctx = canvas.getContext("2d");
ctx.canvas.width = 1000;
ctx.canvas.height = 1000;

//item to drag and its container
let container = document.querySelector("#ballCanvas");
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


let player1 = new Circle(x, y, 50,5);
function Circle(x, y, r,speed) {
  this.xDefault = x
  this.yDefault = y
  this.x = (x === null) ? 0 : x;
  this.y = (y === null) ? 0 : y;
  this.r = (r === null) ? 0 : r;
  this.speed = (speed === null) ? defaultSpeed : speed;
  this.fill = function(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

//Main game loop
function main() {
  let now = Date.now();
  let dt = (now - lastTime) / 1000.0;
  render();

  lastTime = now;
  requestAnimFrame(main);

};
function render() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "blue";
  player1.x = x
  player1.y = y
  player1.fill(ctx);

};


main() // -------Start --------------
