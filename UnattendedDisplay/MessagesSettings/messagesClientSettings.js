const socket = io('/messages',{transports: ['websocket']});






function Submission(){
  let screenID = document.getElementById("city").value;
  let city = document.getElementById("city").value;
  let building = document.getElementById("building").value;
  console.log(city)
  console.log(building)
  localStorage.setItem('city', city);
  localStorage.setItem('building', building);

  let location = {
    city:city,
    building:building,
  }
  socket.emit("updateLocation",location)
  return false;
}
socket.on("notValid",function(){
  document.getElementById("city").style.backgroundColor = "rgb(255,200,200)";
  document.getElementById("city").title = "Invalid City";
});
socket.on("weather",function(){
  document.getElementById("city").style.backgroundColor = "white";
  document.getElementById("city").title = "";
});
