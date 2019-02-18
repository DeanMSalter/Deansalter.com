function pointInCircle(x, y, cx, cy, radius) {
  let distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
  return distancesquared <= radius * radius;
}
function ballCollision(ball1 , ball2){
  //checks if ball1 and ball2 collide
  if (ball1 == ball2){ return false; }
  if(typeof ball1 === "undefined"){ return false;};
  if(typeof ball2 === "undefined"){ return false;};
  var dx = ball1.x - ball2.x; //Difference between x cords
  var dy = ball1.y - ball2.y; //Difference between y cords
  var distance = Math.sqrt((dx * dx) + (dy * dy));
  if(distance <= ball1.r +ball2.r){
    return true;
  }else{
    return false;
  }
}
function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
function constantMovement(player,mouse,speedReq){
  let speed = speedReq;
  let targetX = mouse.x;
  let targetY = mouse.y;

  let dx = targetX - player.x;
  let dy = targetY - player.y;

  let dist = Math.sqrt(dx * dx + dy * dy);

  let velX = (dx/dist) * speed;
  let velY = (dy/dist) * speed;

  if (dist > player.r/2) {
    player.x += velX;
    player.y += velY;
  }
}

module.exports = {
  pointInCircle,
  ballCollision,
  getRandomColor,
  constantMovement
};
