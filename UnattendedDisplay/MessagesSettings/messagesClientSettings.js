const socket = io('/messages',{transports: ['websocket']});
let database;


socket.emit("getSettingsUpdate")
socket.on("updateSettingsList",function(data){
  console.log("updateding")
  populateDatabaseList(data)
});

function populateDatabaseList(data){
  let list = document.getElementById("databaseList")
  while( list.firstChild ){
    list.removeChild( list.firstChild );
  }
  for(let i = 0;i<data.length;i++){
    let entry = document.createElement('li');
    entry.appendChild(document.createTextNode(data[i].id + ","));
    entry.appendChild(document.createTextNode(data[i].city + ","));
    entry.appendChild(document.createTextNode(data[i].building));
    list.appendChild(entry);
  }

}
function Purge(){
  socket.emit("purgeSettings")
}
function Submission(){
  let screenID = document.getElementById("screenID").value;
  let city = document.getElementById("city").value;
  let building = document.getElementById("building").value;


  let settings = {
    id:screenID,
    city:city,
    building:building,
  }
  socket.emit("saveSettings",settings)
  return false;
}
socket.on("notValid",function(){
  document.getElementById("city").style.backgroundColor = "rgb(255,200,200)";
  document.getElementById("city").title = "Invalid City";
});
socket.on("valid",function(){
  document.getElementById("city").style.backgroundColor = "white";
  document.getElementById("city").title = "";
});
