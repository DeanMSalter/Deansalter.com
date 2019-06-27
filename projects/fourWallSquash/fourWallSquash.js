'use strict'
let scoreFWS = 0;
let hitWallsFWS = {};
let leftWallFWS = false;
let topWallFWS = false;
let rightWallFWS = false;
let bottomWallFWS = false;
let activeWallFWS = 1;
let wallTimerFWS;
let containerFWS = document.getElementById("fourWallSquash-container")
let wrapperFWS = document.getElementById("fourWallSquash")
let canvasFWS = document.getElementById("canvasFWS")
let canvasWidthFWS = canvasFWS.getBoundingClientRect().width
let canvasHeightFWS = canvasFWS.getBoundingClientRect().height
let radiusFWS = ((canvasWidthFWS + canvasHeightFWS) / 2) * 0.05
let scoreStrFWS = document.getElementById("scoreFWS")

window.onload = function(){
    canvasFWS = document.getElementById("canvasFWS")
    canvasWidthFWS = canvasFWS.getBoundingClientRect().width
    canvasHeightFWS = canvasFWS.getBoundingClientRect().height
    let ballFWS = document.getElementById("ballFWS")
    radiusFWS = ((canvasWidthFWS + canvasHeightFWS) / 2) * 0.05


    document.getElementById("scoreFWS").style.fontSize =((canvasWidthFWS+canvasHeightFWS)/2)*0.1;
    ballFWS.setAttribute("r", radiusFWS)
    ballFWS.setAttribute("cx", canvasWidthFWS / 2)
    ballFWS.setAttribute("cy", canvasHeightFWS / 2)

    document.getElementById("canvasFWS").style.borderLeft = "green solid " +radiusFWS+ "px";
      document.getElementById("scoreFWS").textContent = "Score: " + scoreFWS
}
window.onresize = function (){
      window.location.reload()
}

let pressedKeysFWS = {}
containerFWS.addEventListener("keydown", function(e) {
  pressedKeysFWS[e.key] = true
});
containerFWS.addEventListener("keyup", function(e) {
  pressedKeysFWS[e.key] = false
});
containerFWS.addEventListener("blur", function(e) {
  pressedKeysFWS = {}
})

function inputFWS() {
  let ballFWS = document.getElementById("ballFWS")
  let currentXFWS = parseInt(ballFWS.getAttribute("cx"), 10)
  let currentYFWS = parseInt(ballFWS.getAttribute("cy"), 10)
  let maxWidthFWS = canvasFWS.getBoundingClientRect().width
  let maxHeightFWS = canvasFWS.getBoundingClientRect().height
  let averageSizeFWS = maxWidthFWS + maxHeightFWS / 2

  //// TODO: Make diagonal speed not be mega fast
  if (pressedKeysFWS["a"]) {
    ballFWS.setAttribute("cx", currentXFWS - averageSizeFWS * 0.01)
  }
  if (pressedKeysFWS["d"] ) {
    ballFWS.setAttribute("cx", currentXFWS + averageSizeFWS * 0.01)
  }
  if (pressedKeysFWS["w"] ) {
    ballFWS.setAttribute("cy", currentYFWS - averageSizeFWS * 0.01)
  }
  if (pressedKeysFWS["s"] ) {
    ballFWS.setAttribute("cy", currentYFWS + averageSizeFWS * 0.01)
  }
}

function wallCheckFWS() {
  let ballFWS = document.getElementById("ballFWS")
  let canvasFWS = document.getElementById("canvasFWS")
  let maxWidthFWS = canvasFWS.getBoundingClientRect().width
  let maxHeightFWS = canvasFWS.getBoundingClientRect().height
  let currentXFWS = parseInt(ballFWS.getAttribute("cx"), 10)
  let currentYFWS = parseInt(ballFWS.getAttribute("cy"), 10)
  let radiusFWS = parseInt(ballFWS.getAttribute("r"), 10)
  let outlineFWS = 0.3 * radiusFWS
  if (currentYFWS <= 0 + radiusFWS + outlineFWS) {
      ballFWS.setAttribute("cy", 0 + radiusFWS + outlineFWS)
      hitWallsFWS["2"] = true
  }else{
      hitWallsFWS["2"] = false
  }

  if (currentYFWS >= maxHeightFWS - radiusFWS - outlineFWS) {
    ballFWS.setAttribute("cy",  maxHeightFWS - radiusFWS - outlineFWS)
    hitWallsFWS["4"] = true
  }else{
    hitWallsFWS["4"] = false
  }

  if (currentXFWS <= 0 + radiusFWS + outlineFWS) {
    ballFWS.setAttribute("cx", 0 + radiusFWS + outlineFWS)
    hitWallsFWS["1"] = true
  }else{
    hitWallsFWS["1"] = false
  }

  if (currentXFWS >= maxWidthFWS - radiusFWS - outlineFWS) {
    ballFWS.setAttribute("cx",maxWidthFWS - radiusFWS - outlineFWS)
    hitWallsFWS["3"] = true
  }else{
    hitWallsFWS["3"] = false
  }
}

function updateFWS(progressFWS) {
  wallCheckFWS()
  inputFWS()

  wallChangeFWS()
  // Update the state of the world for the elapsed time since last render
}
function startWallTimerFWS(){
  //// TODO: Add levels of difficulty
  wallTimerFWS = setInterval(function() {
    activeWallFWS = generateActiveWallFWS()
    scoreFWS -= 1;
    scoreStrFWS.textContent = "Score: " + scoreFWS
  }, 3000);
}
function generateActiveWallFWS(){
  //// TODO: Stop same wall being selected in a row
  let newWallFWS = Math.floor(Math.random() * 4)+1;
  document.getElementById("canvasFWS").style.border = "none";
  if(newWallFWS == 1){
    document.getElementById("canvasFWS").style.borderLeft = "green solid " +radiusFWS+ "px";
  }else if(newWallFWS == 2){
    document.getElementById("canvasFWS").style.borderTop = "green solid " +radiusFWS+ "px";
  }else if(newWallFWS == 3){
    document.getElementById("canvasFWS").style.borderRight = "green solid " +radiusFWS+ "px";
  }else if(newWallFWS == 4){
    document.getElementById("canvasFWS").style.borderBottom ="green solid " +radiusFWS+ "px";
  }
  return newWallFWS
}
function stopWallTimerFWS(){
  clearInterval(wallTimerFWS)
}
function wallChangeFWS(){
  for(let i = 0; i<Object.keys(hitWallsFWS).length ;i++){
    if(hitWallsFWS[Object.keys(hitWallsFWS)[i]]){ //if hit wall

      if(activeWallFWS == Object.keys(hitWallsFWS)[i]){ //if hit wall = active wall
        activeWallFWS = generateActiveWallFWS()
        scoreFWS += 1;
        scoreStrFWS.textContent = "Score: " + scoreFWS
        stopWallTimerFWS()
        startWallTimerFWS()
        let canvasWidthFWS = canvasFWS.getBoundingClientRect().width
        let canvasHeightFWS = canvasFWS.getBoundingClientRect().height
        ballFWS.setAttribute("cx", canvasWidthFWS / 2)
        ballFWS.setAttribute("cy", canvasHeightFWS / 2)
      }else{
        scoreFWS -= 1;
        scoreStrFWS.textContent = "Score: " + scoreFWS
        let canvasWidthFWS = canvasFWS.getBoundingClientRect().width
        let canvasHeightFWS = canvasFWS.getBoundingClientRect().height
        ballFWS.setAttribute("cx", canvasWidthFWS / 2)
        ballFWS.setAttribute("cy", canvasHeightFWS / 2)
      }
    }

  }
}

function loopFWS(timestampFWS) {
  let progressFWS = timestampFWS - lastRenderFWS

  updateFWS(progressFWS)
  lastRenderFWS = timestampFWS
  window.requestAnimationFrame(loopFWS)
}
let lastRenderFWS = 0
window.requestAnimationFrame(loopFWS)
