let socket = io('/messages',{transports: ['websocket']});
let weather;
let connected;
let id = (window.location.href).split("id=")[1]
socket.on('connect_error', function() {
    connected = false;
    document.getElementById("connection").innerHTML ="Disconnected from Server"
    let reconnectLoop = setInterval(function(){
      if(connected){
        clearInterval(reconnectLoop);
        return;
      }else{
        socket = io('/messages',{transports: ['websocket']});
      }
    },1000*1);
});
socket.on("connect",function(){
  console.log("connected")
  connected = true;
  document.getElementById("connection").innerHTML =""
})

// if (div.offsetHeight < div.scrollHeight ||
//     div.offsetWidth < div.scrollWidth) {
//       console.log("overflow")
//     // your element have overflow
// } else {
//     // your element doesn't have overflow
// }



socket.emit("newClient",id);


socket.on("updateMessagesList",function(data){
    console.log("yay new message stuff")
    let list = document.getElementById("messages")
    let items = list.getElementsByTagName('li');//Get all list items in the list
    while(items.length > 0){
      items[0].remove()
    }
    if(typeof data == "undefined"){
      return;
    }
    for(let o = 0;o<=data.length-1;o++){
      let entry = document.createElement("li")
      entry.appendChild(document.createTextNode(data[o].message))
      list.insertBefore(entry,list.firstChild)
    }

})
let div = document.getElementById("mainContent")
let deletedMessages = []
setInterval(function(){
  // while(div.offsetHeight < div.scrollHeight){
  //   let list = document.getElementById("messages")
  //   let messages = document.getElementById("messages").getElementsByTagName("li");
  //   let last = messages[messages.length - 1];
  //   deletedMessages.push(last)
  //   last.parentNode.removeChild(last);
  // }

  let list = document.getElementById("messages")
  let messages = document.getElementById("messages").getElementsByTagName("li");
  let last = messages[messages.length - 1];


  last.parentNode.removeChild(last);
  deletedMessages.push(last)
   let entry = document.createElement("li")

   entry.appendChild(document.createTextNode(deletedMessages[0].innerHTML))

   list.firstChild.id=""
   entry.id = "currentMessage"
   deletedMessages.shift()

  list.insertBefore(entry,list.firstChild)
},1000*3);



socket.on('weather', function(weatherData) {
  console.log(weatherData)
  document.getElementById("weatherData").innerHTML = weatherData.name +  " " + weatherData.main.temp + "&#8451" + " " + weatherData.weather[0].description
});
socket.on("updateLocation",function(building){
  let currentLocationEle = document.getElementById("currentLocation")
  currentLocationEle.innerHTML = building;
});
socket.on("updateSections",function(data){
  let mainInfo = document.getElementById("mainContent")
  let locationData = document.getElementById("locationData")
  let gameData = document.getElementById("gameData")
  let dateTime = document.getElementById("dateTime")
  let main;
  let location;
  let game;

  if(data.mainInfo  == 0){
    main = false
  }else{
    main = true;
  }
  if(data.buildingInfo  == 0){
    location = false
  }else{
    location = true;
  }

  if(data.gameInfo  == 0){
    game = false
  }else{
    game = true;
  }

  if(!main){
    mainInfo.style.visibility = "hidden"
  }else{
    mainInfo.style.visibility = "visible"
  }
  if(!location){
    locationData.style.visibility = "hidden"
  }else{
    locationData.style.visibility = "visible"
  }
  if(!game){
    gameData.style.visibility = "hidden"
  }else{
    gameData.style.visibility = "visible"
  }

  if(main && !location && !game){
    mainInfo.style.height = "100%"
    mainInfo.style.width = "100%"
  }else if(main && !game  && location){
    mainInfo.style.height = "75%"
    mainInfo.style.width = "100%"
  }else if(main && game && !location){
    mainInfo.style.width = "75%"
    mainInfo.style.height = "100%"
  }else if(main && game && location){
    mainInfo.style.height = "75%"
    mainInfo.style.width = "75%"
  }

  if(!main && !location && game){
    gameData.style.width = "100%"
    gameData.style.left = "0%"
  }else if(!main && game  && location){
    gameData.style.width = "25%"
    gameData.style.left = "75%"
  }else if(main && game && !location){
    gameData.style.width = "25%"
    gameData.style.left = "75%"
  }else if(main && game && location){
    gameData.style.width = "25%"
    gameData.style.left = "75%"
  }

  if(!main && location && !game){
    locationData.style.height = "100%"
    locationData.style.width = "100%"
    locationData.style.top = "5%"
  }else if(!main && game  && location){
    locationData.style.height = "100%"
    locationData.style.width = "75%"
    locationData.style.top = "5%"
  }else if(main && !game && location){
    locationData.style.height = "25%"
    locationData.style.width = "100%"
    locationData.style.top = "75%"
  }else if(main && game && location){
    locationData.style.height = "25%"
    locationData.style.width = "75%"
    locationData.style.top = "75%"
  }


  if(!main && !location && !game){
    dateTime.style.height = "100%"
    dateTime.style.fontSize = "500%";
    dateTime.style.top = "40%";
  }else if(main || location || game){
    dateTime.style.height = "10%"
    dateTime.style.fontSize = "150%";
    dateTime.style.top = "1%";
  }
});
















let timeBar = document.getElementById("time")
let dateBar = document.getElementById("date")
setInterval(function(){
  let current = new Date();
  let time = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
  let date = current.getDate() + "/"+(current.getMonth()+1)+ "/" + current.getFullYear()
  timeBar.innerHTML = time;
  dateBar.innerHTML = date;

},1000*1);
