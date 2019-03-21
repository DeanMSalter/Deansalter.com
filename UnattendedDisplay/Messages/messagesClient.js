const socket = io('/messages',{transports: ['websocket']});
let weather;





function updateScreen(){
  console.log("update screen")
  let building = localStorage.getItem("building")

  let currentLocationEle = document.getElementById("currentLocation")
  currentLocationEle.innerHTML = building;

}
updateScreen()

socket.on('weather', function(weatherData) {
  document.getElementById("weatherData").innerHTML = weatherData.name +  " " + weatherData.main.temp + "&#8451" + " " + weatherData.weather[0].description
});
socket.on("updateLocation",updateScreen());
















let timeBar = document.getElementById("time")
let dateBar = document.getElementById("date")
setInterval(function(){
  let current = new Date();
  let time = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
  let date = current.getDate() + "/"+(current.getMonth()+1)+ "/" + current.getFullYear()
  timeBar.innerHTML = time;
  dateBar.innerHTML = date;

},1000*1);
