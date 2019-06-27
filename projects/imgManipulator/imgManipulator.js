'use strict'
let base_image = new Image();
base_image.src = 'billGates.png';
console.log(base_image)
let ctx;
let canvas  = document.getElementById("newCanvas");
let gridCtx;
let gridCanvas = document.getElementById("gridCanvas");

let clickX1;
let clickY1;
let clickX2;
let clickY2;

let clicked = false;
let gridOn = true
let fillMode = false;
let invertMode = true;
let colourMode = false;

let r;
let g;
let b;
let a;


let gridSizeX;
let gridSizeY;

let xScale;
let yScale;


window.onload = function(){
  resizeText(sideMenu,title,0.04)


  let download = document.getElementById("saveButton")
  download.style.width = (sideMenu.offsetWidth)*0.5;
  resizeText(sideMenu, download, 0.04)

  let opacity = document.getElementById("gridOpacity")
  let opacityLabel = document.getElementById("gridOpacityLabel")
  opacity.style.width = (sideMenu.offsetWidth)*0.5;
  resizeText(sideMenu, opacityLabel, 0.04)

  let upload = document.getElementById("uploadButton")
  let uploadLabel = document.getElementById("uploadLabel")
  upload.style.width = (sideMenu.offsetWidth)*0.5;
  deactivateInvert()
  activateColour()
//  resizeText(sideMenu, uploadLabel, 0.04)
}

function resizeText(parent, element, scale) {
  element.style.fontSize = ((parent.offsetWidth+parent.offsetHeight)/2)*scale
  return element
}

function nearestMultiple(x,target){
  let found = false
  let subtract = x
  let subtractSteps = 0
  let addition = x
  let additionSteps = 0
  let returnValue;
  while(!found){
    while(subtract % target != 0){
      subtract -= 1
      subtractSteps ++
    }
    while(addition % target != 0){
      addition ++
      additionSteps ++
    }
    if(additionSteps>subtractSteps){
      returnValue = subtract-1
      found = true
    }else{
      returnValue = addition-1
      found = true
    }
  }
  return returnValue
}

function identifySquare(x,y){
  console.log(x + " " + y)
  while(x%gridSizeX != 0){
    x-= 1;
  }
  while(y%gridSizeY != 0){
    y-= 1;
  }

  console.log(x+ " " + y)
  return [x,y]
  // console.log(x+ " " + y)
  //
  // createMark((x-1)*xScale,(y-1)*yScale)
  //   createMark((x2-1)*xScale,(y2-1)*yScale)
  //   removeMarkers()
  //   invertBox(x,y,gridSizeX,gridSizeY,true,false,false,false)
}
function drawGrid(lineWidth){

  gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
  if(typeof lineWidth === "undefined" ){
    gridCtx.lineWidth = 1;
  }else{
    gridCtx.lineWidth = lineWidth
  }

  gridCtx.strokeStyle = "rgb(215, 44, 44)";
  for(let o = 0;o<gridCanvas.width;o+=gridSizeX){
    gridCtx.beginPath();
    gridCtx.moveTo(o, 0);
    gridCtx.lineTo(o, gridCanvas.height);
    gridCtx.stroke();
  }
  for(let i=0;i<gridCanvas.height;i+=gridSizeY){
    gridCtx.beginPath();
    gridCtx.moveTo(0, i);
    gridCtx.lineTo(gridCanvas.width, i);
    gridCtx.stroke();
  }
}

function createMark(xPos,yPos){
  let clickMarker = document.createElement("div")
  clickMarker.id = "marker"
  clickMarker.style.left = xPos
  clickMarker.style.top =  yPos
  clickMarker.style.zIndex = "100";
  document.getElementById("imgManipulator-container").appendChild(clickMarker)
}

function removeMarkers(){
  while(document.getElementById("marker")){

    let element = document.getElementById("marker");
    element.parentNode.removeChild(element);
  }
}

function clickCanvas(e){
  //Get the difference between the ratio between pixels the canvas is using and the pixels that its displaying
  xScale = canvas.clientWidth/canvas.width
  yScale = canvas.clientHeight/canvas.height

  //Get the position of the click relative to this ratio
  let xClick = parseInt((e.clientX)/xScale)
  let yClick = parseInt((e.clientY)/yScale)

  if(fillMode){
    let square = identifySquare(xClick,yClick)
    let xFill = square[0]
    let yFill = square[1]
    console.log(xFill+ " " + yFill)
    console.log(gridSizeX)
    if(invertMode){
      invertBox(xFill,yFill,gridSizeX,gridSizeY,r,g,b,a)
    }else if(colourMode){
      colourBox(xFill,yFill,gridSizeX,gridSizeY,r,g,b,a)
    }

  //  document.getElementById("fillToggle").focus()
    return
  };


  //Find the nearest grid point , gets the position on the CANVAS
  xClick = nearestMultiple(xClick,gridSizeX)*xScale
  yClick = nearestMultiple(yClick,gridSizeY)*yScale

  createMark(xClick,yClick)

  if(!clicked){
    clicked = true;
    //Convert click back to relative to the IMAGE
    clickX1 = parseInt((xClick)/xScale)
    clickY1 = parseInt(( yClick)/yScale)
  }else{
    clickX2 = parseInt((xClick)/xScale)
    clickY2 = parseInt((yClick)/yScale)

    let clickWidth = Math.abs(clickX2-clickX1)
    let clickHeight = Math.abs(clickY2-clickY1)

    let xPos = clickX1
    let yPos = clickY1

    if(clickX2 < clickX1){
      xPos = clickX2
    }
    if(clickY2 < clickY1){
      yPos = clickY2
    }

    clickWidth = nearestMultiple(clickWidth,gridSizeX)
    clickHeight = nearestMultiple(clickHeight,gridSizeY)
    removeMarkers()
    if(clickWidth >=0 && clickHeight >=0){
      if(invertMode){
        console.log("invert")
        invertBox(xPos+1,yPos+1,clickWidth+1,clickHeight+1,r,g,b,a)
      }else if(colourMode){
        console.log("colour")
        colourBox(xPos+1,yPos+1,clickWidth+1,clickHeight+1,r,g,b,a)
      }
    }
    clicked = false;
 }
}

function download_img(el){
  let image = canvas.toDataURL("image/jpg");
  el.href = image;
}

function colourBox(xPos, yPos,width,height,r,g,b,a){
  let imgData = ctx.getImageData(xPos, yPos, width, height);
  let currentRow=0;

  let updateRowInterval = setInterval(updateRow, 1);
  let pixelsInRow = width*4;

  function updateRow() {
    for (let o = currentRow * pixelsInRow; o < (currentRow * pixelsInRow) + pixelsInRow; o += 4) {
      if(r){
        imgData.data[o] = r;
      }
      if(g){
        imgData.data[o+1] = g;
      }
      if(b){
        imgData.data[o+2] = b;
      }
      if(a){
        imgData.data[o+3] = a;
      }

    }
    ctx.putImageData(imgData, xPos, yPos);
    if (currentRow+1 < height) {
      currentRow++
    }else{
      clearInterval(updateRowInterval)
    }
  }
}

function invertBox(xPos, yPos,width,height,r,g,b,a){
  let imgData = ctx.getImageData(xPos, yPos, width, height);
  let currentRow=0;

  let updateRowInterval = setInterval(updateRow, 1);
  let pixelsInRow = width*4;

  function updateRow() {
    for (let o = currentRow * pixelsInRow; o < (currentRow * pixelsInRow) + pixelsInRow; o += 4) {
      if(r){
        imgData.data[o] = 255 - imgData.data[o];
      }
      if(g){
        imgData.data[o+1] = 255 - imgData.data[o+1];
      }
      if(b){
        imgData.data[o+2] = 255 - imgData.data[o+2];
      }
      if(a){
        imgData.data[o+3] = 255 - imgData.data[o+3];
      }

    }
    ctx.putImageData(imgData, xPos, yPos);
    if (currentRow+1 < height) {
      currentRow++
    }else{
      clearInterval(updateRowInterval)
    }
  }


}

function showGrid(){
  document.getElementById("gridCanvas").style.visibility = "visible";
  gridOn = true;
}
function hideGrid(){
  document.getElementById("gridCanvas").style.visibility = "hidden";
  gridOn = false;
}


function activateInvert(){
  invertMode = true;
  document.getElementById("RGBToggle").style.visibility = "visible"
  document.getElementById("invertToggle").style.background = "green";
  r= document.getElementById("redToggle").checked
  g= document.getElementById("greenToggle").checked
  b= document.getElementById("blueToggle").checked
  a= document.getElementById("alphaToggle").checked
}
function deactivateInvert(){
  invertMode = false;
  document.getElementById("RGBToggle").style.visibility = "hidden"
  document.getElementById("invertToggle").style.background = "rgb(221, 221, 221)";
}

function activateColour(){
  colourMode = true;
  document.getElementById("RGB").style.visibility = "visible"
  document.getElementById("colourToggle").style.background = "green";
  r= document.getElementById("red").value
  g= document.getElementById("green").value
  b= document.getElementById("blue").value
  a= document.getElementById("alpha").value
}
function deactivateColour(){
  colourMode = false;
  document.getElementById("RGB").style.visibility = "hidden"
  document.getElementById("colourToggle").style.background = "rgb(221, 221, 221)";
}

document.getElementById('uploadLink').onchange = function(){
  console.log("uploaded")
  var file    = document.getElementById('uploadLink').files[0];
  var reader  = new FileReader();

   reader.addEventListener("load", function () {
     base_image.src = reader.result;
   }, false);

   if (file) {
     reader.readAsDataURL(file);
   }
}
document.getElementById("gridOpacity").oninput = function(){
  let opacityValue = document.getElementById("gridOpacity").value
  console.log(typeof document.getElementById('uploadLink').files[0])
  document.getElementById("gridOpacityLabel").textContent = "Grid: " +  opacityValue
  console.log(opacityValue)
  if(opacityValue  > 0){
    showGrid()
    drawGrid(document.getElementById("gridOpacity").value)
  }else{
    hideGrid()
  }



}

canvas.addEventListener('contextmenu', function(ev) {
    ev.preventDefault();
    removeMarkers()
    clicked = false;
    return false;
}, false);
gridCanvas.addEventListener('contextmenu', function(ev) {
    ev.preventDefault();
    removeMarkers()
    clicked = false;
    return false;
}, false);
gridCanvas.addEventListener('click',function(e){
  clickCanvas(e)
});
document.getElementById("fillToggle").addEventListener('click',function(e){
  if(fillMode){
    fillMode = false;
    document.getElementById("fillToggle").style.background = "rgb(221, 221, 221)";
  }else{
    fillMode = true;
    document.getElementById("fillToggle").style.background = "green";
  }
  console.log("fill Toggle")
});

document.getElementById("invertToggle").addEventListener('click',function(e){
  if(invertMode){
    deactivateInvert()
    activateColour()
  }else{
    activateInvert()
    deactivateColour()
  }
});
document.getElementById("colourToggle").addEventListener('click',function(e){
  if(colourMode){
    activateInvert()
    deactivateColour()
  }else{
    deactivateInvert()
    activateColour()
  }

});

document.getElementById("red").addEventListener('input',function(e){
  console.log(document.getElementById("redToggle").value)
  r= document.getElementById("red").value
  g= document.getElementById("green").value
  b= document.getElementById("blue").value
  a= document.getElementById("alpha").value
});
document.getElementById("green").addEventListener('input',function(e){
  r= document.getElementById("red").value
  g= document.getElementById("green").value
  b= document.getElementById("blue").value
  a= document.getElementById("alpha").value
});
document.getElementById("blue").addEventListener('input',function(e){
  r= document.getElementById("red").value
  g= document.getElementById("green").value
  b= document.getElementById("blue").value
  a= document.getElementById("alpha").value
});
document.getElementById("alpha").addEventListener('input',function(e){
  r= document.getElementById("red").value
  g= document.getElementById("green").value
  b= document.getElementById("blue").value
  a= document.getElementById("alpha").value
});

document.getElementById("redToggle").addEventListener('input',function(e){
    r= document.getElementById("redToggle").checked
    g= document.getElementById("greenToggle").checked
    b= document.getElementById("blueToggle").checked
    a= document.getElementById("alphaToggle").checked
});
document.getElementById("greenToggle").addEventListener('input',function(e){
    r= document.getElementById("redToggle").checked
    g= document.getElementById("greenToggle").checked
    b= document.getElementById("blueToggle").checked
    a= document.getElementById("alphaToggle").checked
});
document.getElementById("blueToggle").addEventListener('input',function(e){
    r= document.getElementById("redToggle").checked
    g= document.getElementById("greenToggle").checked
    b= document.getElementById("blueToggle").checked
    a= document.getElementById("alphaToggle").checked
});
document.getElementById("alphaToggle").addEventListener('input',function(e){
    r= document.getElementById("redToggle").checked
    g= document.getElementById("greenToggle").checked
    b= document.getElementById("blueToggle").checked
    a= document.getElementById("alphaToggle").checked
});




canvas.addEventListener('click',function(e){
  clickCanvas(e)
});
ctx = canvas.getContext("2d");
gridCtx = gridCanvas.getContext("2d");
document.getElementById("imgManipulator-container").appendChild(canvas)
document.getElementById("imgManipulator-container").appendChild(gridCanvas)
base_image.onload = function(){
  canvas.width =  base_image.width;
  canvas.height = base_image.height;

  gridCanvas.width =  base_image.width;
  gridCanvas.height = base_image.height;

  gridSizeX = parseInt(canvas.width*0.025)
  gridSizeY = parseInt(canvas.height*0.025)
  drawGrid()
  ctx.drawImage(base_image,0,0);



}
