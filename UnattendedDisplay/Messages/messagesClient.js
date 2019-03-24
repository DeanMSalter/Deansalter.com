const socket = io('/messages',{transports: ['websocket']});
let weather;

let id = (window.location.href).split("id=")[1]
socket.emit("newClient",id);

document.getElementById("pageID").innerHTML = "Screen ID: " + id;
socket.on("ping",function(id){
  if(typeof id === "undefined"){return};
})
socket.on('weather', function(weatherData) {
  console.log(weatherData)
  document.getElementById("weatherData").innerHTML = weatherData.name +  " " + weatherData.main.temp + "&#8451" + " " + weatherData.weather[0].description
});
socket.on("updateLocation",function(building){
  let currentLocationEle = document.getElementById("currentLocation")
  currentLocationEle.innerHTML = building;
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
