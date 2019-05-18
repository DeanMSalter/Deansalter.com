let socket = io('/', {transports: ['websocket']})
let weather;
let connected;
let id = (window.location.href).split("?id=")[1]
function isEmpty(object){
  if (object == null|| object.length == 0){
    return true;
  }else{
    return false;
  }
}

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

socket.emit("newClient",id);

socket.on("updateMessagesList",function(data){
    let list = document.getElementById("messages")
    let items = list.getElementsByTagName('li');//Get all list items in the list
    while(items.length > 0){
      items[0].remove()
    }
    if(isEmpty(data) && id == null){
      let entry = document.createElement("li")
      entry.appendChild(document.createTextNode("Welcome to the default messages page, please enter the ID of the page you wish to display"))
      let entry2 = document.createElement("li")
      entry2.appendChild(document.createTextNode("For example: /messages/?id=1"))
      list.insertBefore(entry2,list.firstChild)
      list.insertBefore(entry,list.firstChild)
      return;
    }else if(isEmpty(data) && id != null){
      let entry3 = document.createElement("li")
      entry3.appendChild(document.createTextNode("Please submit a message you wish to be displayed here on the submission screen."))
      list.insertBefore(entry3,list.firstChild)
      return;
    }
    for(let o = 0;o<=data.length-1;o++){
      let entry = document.createElement("li")
      entry.appendChild(document.createTextNode(data[o].message))
      list.insertBefore(entry,list.firstChild)
    }

})
let deletedMessages = []
setInterval(function(){
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
  document.getElementById("weatherData").innerHTML = weatherData.name +  " " + weatherData.main.temp + "&#8451" + " " + weatherData.weather[0].description
});
socket.on("updateLocation",function(building){

  let currentLocationEle = document.getElementById("currentLocation")
  currentLocationEle.innerHTML = building;
});
socket.on("updateLocationMessages",function(data){
  console.log(data)
  let list = document.getElementById("buildingData")
  let items = list.getElementsByTagName('li');//Get all list items in the list
  while(items.length > 0){
    items[0].remove()
  }

  if(isEmpty(data) && id == null){
    let entry = document.createElement("li")
    entry.appendChild(document.createTextNode("Welcome to the default messages page, please enter the ID of the page you wish to display"))
    let entry2 = document.createElement("li")
    entry2.appendChild(document.createTextNode("For example: /messages/?id=1"))
    list.insertBefore(entry2,list.firstChild)
    list.insertBefore(entry,list.firstChild)
    return;
  }else if(isEmpty(data) && id != null){
    console.log("run line 100")
    let entry3 = document.createElement("li")
    entry3.appendChild(document.createTextNode("Please submit a message you wish to be displayed here on the submission screen."))
    list.insertBefore(entry3,list.firstChild)
    return;
  }

  console.log(id)
  for(let o = 0;o<=data.length-1;o++){
    let entry = document.createElement("li")
    entry.appendChild(document.createTextNode(data[o].message))
    list.insertBefore(entry,list.firstChild)
  }

})
let deletedBuildingMessages = []
setInterval(function(){
  let list = document.getElementById("buildingData")
  let messages = document.getElementById("buildingData").getElementsByTagName("li");
  let last = messages[messages.length - 1];


  last.parentNode.removeChild(last);
  deletedBuildingMessages.push(last)
   let entry = document.createElement("li")

   entry.appendChild(document.createTextNode(deletedBuildingMessages[0].innerHTML))

   list.firstChild.id=""
   entry.id = "currentBuildingMessage"
   deletedBuildingMessages.shift()

  list.insertBefore(entry,list.firstChild)
},1000*3);

socket.on("updateSections",function(data){
  let mainInfo = document.getElementById("mainContent")
  let locationData = document.getElementById("locationData")

  let dateTime = document.getElementById("dateTime")
  let main;
  let location;
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

  if(main && !location){
    mainInfo.style.height = "90%"
  }else if(main && location){
    mainInfo.style.height = "47.5%"
  }


  if(!main && location ){
    locationData.style.height = "90%"
    locationData.style.top = "6%"
  }else if(main && location){
    locationData.style.height = "47.5%"
    locationData.style.top = "52.5%"
  }

  if(!main && !location){
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
