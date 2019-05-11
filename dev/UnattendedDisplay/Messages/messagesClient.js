let socket = io('/',{transports: ['websocket']});
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
//Tells the server there is a new client/screen active
socket.emit("newClient",id);

//Handles error message if the server goes down while a screen is active
socket.on('connect_error', function() {
    connected = false;
    document.getElementById("connection").innerHTML ="Disconnected from Server"
    let reconnectLoop = setInterval(function(){
      if(connected){
        clearInterval(reconnectLoop);
        return;
      }else{
        socket = io('/',{transports: ['websocket']});
      }
    },1000*1);
});
socket.on("connect",function(){
  connected = true;
  document.getElementById("connection").innerHTML =""
})

socket.on("updateMessagesList",function(data){
    let list = document.getElementById("messages")
    let items = list.getElementsByTagName('li');
    //clear the list
    while(!isEmpty(items)){
      items[0].remove()
    }
    //If no messages have been sent and there is no screen id
    if(isEmpty(data) && isEmpty(id)){
      let entry = document.createElement("li")
      entry.appendChild(document.createTextNode("Welcome to the default messages page, please enter the ID of the page you wish to display"))
      let entry2 = document.createElement("li")
      entry2.appendChild(document.createTextNode("For example: /messages/?id=1"))
      list.insertBefore(entry2,list.firstChild)
      list.insertBefore(entry,list.firstChild)
      return;

    //If no messages sent and there is a screen id
    }else if(isEmpty(data) && !isEmpty(id)){
      let entry3 = document.createElement("li")
      entry3.appendChild(document.createTextNode("Please submit a message you wish to be displayed here on the submission screen."))
      list.insertBefore(entry3,list.firstChild)
      return;
    }

    //Insert all messages into the list
    for(let o = 0;o<=data.length-1;o++){
      let entry = document.createElement("li")
      entry.appendChild(document.createTextNode(data[o].message))
      list.insertBefore(entry,list.firstChild)
    }

})
socket.on('weather', function(weatherData) {
  let weatherString = weatherData.name +  " " + weatherData.main.temp + "&#8451" + " " + weatherData.weather[0].description
  document.getElementById("weatherData").innerHTML = weatherString
});
socket.on("updateLocation",function(building){
  console.log("change building")
  document.getElementById("currentLocation").innerHTML = building;
});

socket.on("updateLocationMessages",function(data){
  //Same as messages but for the building messages
  let list = document.getElementById("buildingData")
  let items = list.getElementsByTagName('li');
  while(items.length > 0){
    items[0].remove()
  }

  if(isEmpty(data) && isEmpty(id)){
    let entry = document.createElement("li")
    entry.appendChild(document.createTextNode("Welcome to the default messages page, please enter the ID of the page you wish to display"))
    let entry2 = document.createElement("li")
    entry2.appendChild(document.createTextNode("For example: /messages/?id=1"))
    list.insertBefore(entry2,list.firstChild)
    list.insertBefore(entry,list.firstChild)
    return;
  }else if(isEmpty(data) && !isEmpty(id)){
    console.log("run line 100")
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
socket.on("updateSections",function(data){
  //Updates which sections display
  let mainInfo = document.getElementById("mainContent")
  let locationData = document.getElementById("locationData")
  let dateTime = document.getElementById("dateTime")

  let main;
  let location;

  if(data.mainInfo  == 0){
    main = false
    mainInfo.style.visibility = "hidden"
  }else{
    main = true;
    mainInfo.style.visibility = "visible"
  }
  if(data.buildingInfo  == 0){
    location = false
    locationData.style.visibility = "hidden"
  }else{
    location = true;
    locationData.style.visibility = "visible"
  }

  if(main && !location){
    mainInfo.style.height = "95%"
  }else if(main && location){
    mainInfo.style.height = "47.5%"
  }

  if(!main && location ){
    locationData.style.height = "95%"
    locationData.style.top = "6%"
  }else if(main && location){
    locationData.style.height = "47.5%"
    locationData.style.top = "52.5%"
  }

  if(!main && !location){
    dateTime.style.height = "100%"
    dateTime.style.fontSize = "500%";
    dateTime.style.top = "40%";
  }else if(main || location){
    dateTime.style.height = "10%"
    dateTime.style.fontSize = "150%";
    dateTime.style.top = "1%";
  }

});


//Cycles through the messages every 3 seconds and updates them
let deletedMessages = []
setInterval(function(){
  let list = document.getElementById("messages")
  let messages = document.getElementById("messages").getElementsByTagName("li");
  if(messages.length <= 1){
    list.firstChild.id="currentMessage"
    return
  }
  //get the last message in the list, remove it
  //and add it to the list of messages to be added back in
  let last = messages[messages.length - 1];
  last.parentNode.removeChild(last);
  deletedMessages.push(last)

  //Create a new entry from the top most element from the deletesmessages
  //remove the id from the current top message and add it to the new top message
  //remove the message from the array once complete
  let entry = document.createElement("li")
  entry.appendChild(document.createTextNode(deletedMessages[0].innerHTML))
  list.firstChild.id=""
  entry.id = "currentMessage"
  deletedMessages.shift()

  //Insert new message into the top of the list
  list.insertBefore(entry,list.firstChild)
},1000*3);

//Cycles through the building messages every 3 seconds and updates them
let deletedBuildingMessages = []
setInterval(function(){
  let list = document.getElementById("buildingData")
  let messages = document.getElementById("buildingData").getElementsByTagName("li");
  if(messages.length <= 1){
    list.firstChild.id="currentBuildingMessage"
    return
  }
  let last = messages[messages.length - 1];

  console.log(last)
  last.parentNode.removeChild(last);
  deletedBuildingMessages.push(last)
   let entry = document.createElement("li")

   entry.appendChild(document.createTextNode(deletedBuildingMessages[0].innerHTML))

   console.log(list)
   list.firstChild.id=""
   entry.id = "currentBuildingMessage"
   deletedBuildingMessages.shift()

  list.insertBefore(entry,list.firstChild)
},1000*3);


//Updates time/date display
let timeBar = document.getElementById("time")
let dateBar = document.getElementById("date")
setInterval(function(){
  let current = new Date();
  let time = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
  let date = current.getDate() + "/"+(current.getMonth()+1)+ "/" + current.getFullYear()
  timeBar.innerHTML = time;
  dateBar.innerHTML = date;

},1000*1);
