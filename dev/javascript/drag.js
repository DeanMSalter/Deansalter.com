let mysql = require('mysql');
window.addEventListener('load', initialize);

let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root"
});

function initialize(){
  con.connect(function(err) {
    console.log("Connected!");
    con.query("CREATE DATABASE IF NOT EXISTS DRAG", function (err, result) {
      if (err) throw err;
      console.log("Database created");

    });
  });
}

//item to drag and its container
let dragItem = document.querySelector("#item");
let container = document.querySelector("#container");

//tracks wether item is currently being dragged
let active = false;
//positional variables
let currentX;
let currentY;
let initialX;
let initialY;
//offsets , initally 0 but this will change once movement commences
let xOffset = 0;
let yOffset = 0;

//touchscreen listners
container.addEventListener("touchstart", dragStart, false);
container.addEventListener("touchend", dragEnd, false);
container.addEventListener("touchmove", drag, false);

//mouse listners
container.addEventListener("mousedown", dragStart, false);
container.addEventListener("mouseup", dragEnd, false);
container.addEventListener("mousemove", drag, false);

function dragStart(e) {
  //checks if the user is using a touchscreen because javascript handles it diffrently, annoyingly.
  if (e.type === "touchstart") {
    initialX = e.touches[0].clientX - xOffset;
    initialY = e.touches[0].clientY - yOffset;
  } else {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
  }

  //check to make sure the target is the item we want to drag , then set that dragging is happening
  if (e.target === dragItem) {
    active = true;
  }
}

//when dragging is finished , stop moving and set dragging as false
function dragEnd(e) {
  initialX = currentX;
  initialY = currentY;

  active = false;
}

function drag(e) {
  //if dragging is happening then do stuff
  if (active) {

    e.preventDefault();

    //if using touchscreen
    if (e.type === "touchmove") {
      currentX = e.touches[0].clientX - initialX;
      currentY = e.touches[0].clientY - initialY;
    } else {
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
    }

    //seeting the offset as the new location to allow for the next "move" to start from the new position
    xOffset = currentX;
    yOffset = currentY;

    //move the item
    setTranslate(currentX, currentY, dragItem);
  }
}

//move the item using css
function setTranslate(xPos, yPos, el) {
  el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}
