const socket = io('/',{transports: ['websocket']});
let timeBar = document.getElementById("time")
let dateBar = document.getElementById("date")
setInterval(function(){
  let current = new Date();
  let time = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
  let date = current.getDate() + "/"+(current.getMonth()+1)+ "/" + current.getFullYear()
  timeBar.innerHTML = time;
  dateBar.innerHTML = date;

},1000*1);

let buildingList;
socket.on("updateBuildingList",function(data){
  console.log("updating buildings")
  populateBuildingList(data)
  buildingList = data;
  console.log(typeof buildingList)
});
socket.on("updateAllBuildingMessages",function(data){
  populateBuildingMessageList(data)
  console.log(data)
});
socket.on("updateAllMessagesList",function(data){
  console.log("we got new messages")
  populateMessageList(data)
});
socket.on("ScreenSaved",function(data){
  if(!data){
      toggleSubmissionError("screenID","Not a valid Screen. Please create a screen on the settings page!")
  }else{
      toggleSubmissionError("screenID","")
  }
});
(function configSubmission(){
  let table = document.getElementById("submissionTable")
  let row = table.insertRow(table.rows.length);
  let cell1 = row.insertCell(0)

  cell1.innerHTML = "Submit"
  cell1.onclick = Submission
  cell1.style.backgroundColor = "rgb(100,255,100)"
})();
(function configBuildingSubmission(){
  let table = document.getElementById("buildingSubmissionTable")
  let row = table.insertRow(table.rows.length);
  let cell1 = row.insertCell(0)

  cell1.innerHTML = "Submit"
  cell1.style.backgroundColor = "rgb(100,255,100)"
  cell1.onclick = BuildingSubmission

})();
function populateBuildingList(data){

  let tableBody = document.getElementById("buildingsTableBody")
  tableBody.innerHTML = "";

   for(let i = 0;i<data.length;i++){
      let row = tableBody.insertRow(0);

      let cell1 = row.insertCell(0);
      let cell2 = row.insertCell(1);


      cell1.innerHTML = data[i].uniqueID;
      cell2.innerHTML = data[i].building;

  }
  if(tableBody.innerHTML == ""){
    let row = tableBody.insertRow(0);
    let cell1 = row.insertCell(0);
    cell1.innerHTML = "No settings saved.";
    cell1.colSpan = "7"

    let row2 = tableBody.insertRow(1);
    let cell2 = row2.insertCell(0);
    cell2.colSpan = "7"
    cell2.innerHTML = "Use the settings page to create a editable page";

    let row3 = tableBody.insertRow(2);
    let cell3 = row3.insertCell(0);
    cell3.colSpan = "7"
    cell3.innerHTML = "Enter ?id=id to view the screen with the specified id";
  }

}
function configBuildingMessagesTable(){
  let table = document.getElementById("buildingMessagesTable")
  let row = table.insertRow(table.rows.length);
  let cell = row.insertCell(0);
  cell.innerHTML = "Delete ALL"
  cell.onclick = function(){
    if (confirm("Delete all stored settings?")) {

        socket.emit("purgeBuildingMessages")
    }
  }
  cell.style.backgroundColor = "rgb(255,150,150)"
}
function configMessagesTable(){
  let table = document.getElementById("messagesTable")
  let row = table.insertRow(table.rows.length);
  let cell = row.insertCell(0);
  cell.innerHTML = "Delete ALL"
  cell.onclick = function(){
    if (confirm("Delete all stored settings?")) {

        socket.emit("purgeMessages")
    }
  }
  cell.style.backgroundColor = "rgb(255,150,150)"
}


function populateBuildingMessageList(data){
  console.log(data)
  let tableBody = document.getElementById("buildingMessagesTableBody")
  tableBody.innerHTML = "";

   for(let i = 0;i<data.length;i++){
      let row = tableBody.insertRow(0);

      let cell0 = row.insertCell(0);
      let cell1 = row.insertCell(1);
      let cell2 = row.insertCell(2);
      let cell3 = row.insertCell(3);
      let cell4 = row.insertCell(4);
      let cell5 = row.insertCell(5);
      // let cell3 = row.insertCell(3);

      cell0.innerHTML = data[i].uniqueID;
      cell1.innerHTML = data[i].id;
      cell3.innerHTML = data[i].message;
      for(let o=0;o<buildingList.length;o++){
        if(buildingList[o].uniqueID == data[i].id){
          cell2.innerHTML = buildingList[o].building;
        }
      }



      cell4.innerHTML = "Edit"
      cell4.style.backgroundColor = "rgb(200,255,200)"
      cell4.onclick = function (){
        document.getElementById("buildingIDSub").value = data[i].id
        document.getElementById("BuildingmessageArea").value = data[i].message
        document.getElementById("databaseBuildingID").innerHTML = "Unique ID = " + data[i].uniqueID
      };

      cell5.innerHTML = "Delete"
      cell5.style.backgroundColor = "rgb(255,200,200)"
      cell5.onclick = function (){
         console.log(data[i])
         socket.emit("deleteBuildingMessage",data[i])
      };
  }
  if(tableBody.innerHTML == ""){
    let row = tableBody.insertRow(0);
    let cell1 = row.insertCell(0);
    cell1.innerHTML = "No messages saved.";
    cell1.colSpan = "3"

    let row2 = tableBody.insertRow(1);
    let cell2 = row2.insertCell(0);
    cell2.colSpan = "3"
    cell2.innerHTML = "submit a message in the table above";
  }else{
    configBuildingMessagesTable()
  }

}
function populateMessageList(data){

  let tableBody = document.getElementById("messagesTableBody")
  tableBody.innerHTML = "";

   for(let i = 0;i<data.length;i++){
      let row = tableBody.insertRow(0);

      let cell0 = row.insertCell(0);
      let cell1 = row.insertCell(1);
      let cell2 = row.insertCell(2);
      let cell3 = row.insertCell(3);
      let cell4 = row.insertCell(4);
      let cell5 = row.insertCell(5);

      cell0.innerHTML = data[i].uniqueID;
      cell1.innerHTML = data[i].id;
      cell2.innerHTML = data[i].message;


      cell3.innerHTML = "Edit"
      cell3.style.backgroundColor = "rgb(200,255,200)"
      cell3.onclick = function (){
        document.getElementById("screenID").value = data[i].id
        document.getElementById("messageArea").value = data[i].message
        document.getElementById("databaseID").innerHTML = "Unique ID = " + data[i].uniqueID
      };

      cell4.innerHTML = "Delete"
      cell4.style.backgroundColor = "rgb(255,200,200)"
      cell4.onclick = function (){
         socket.emit("deleteMessage",data[i])
      };

      cell5.innerHTML = "View"
      cell5.style.backgroundColor = "rgb(230,230,200)"
      cell5.onclick = function (){
        console.log()
         window.open((window.location.href).split("submission/")[0]+"?id=" + data[i].id);
      };


  }
  if(tableBody.innerHTML == ""){
    let row = tableBody.insertRow(0);
    let cell1 = row.insertCell(0);
    cell1.innerHTML = "No messages saved.";
    cell1.colSpan = "3"

    let row2 = tableBody.insertRow(1);
    let cell2 = row2.insertCell(0);
    cell2.colSpan = "3"
    cell2.innerHTML = "submit a message in the table above";
  }else{
    configMessagesTable()
  }

}


function convertToTinyInt(value){
  console.log(value)
  if(value){
    console.log("1")
    return 1;
  }else {
    return 0;
  }
}
function convertToBoolean(value){
  console.log(value)
  if(value == 1){
    return true;
  }else if(value == 0){
    return false;
  }
}
function toggleSubmissionError(elementName,text = ""){
  let element = document.getElementById(elementName);
  if(!text){
    element.style.backgroundColor = "white";
    element.title = "";
  }else{
    element.style.backgroundColor = "rgb(255,200,200)";
    element.title = text;
  }

}

function validateID(screenID){
  if(screenID % 1 === 0){
    toggleSubmissionError("screenID")
  }else{
    toggleSubmissionError("screenID","Invalid ID,Must be a full Integer")
    return false;
  }
  let screenIDInt = parseInt(screenID, 10);

  if(Number.isInteger(screenIDInt)){
    toggleSubmissionError("screenID")
  }else{
    toggleSubmissionError("screenID","Invalid ID, Must be Integer")
    return false;
  }
  if(screenIDInt >= 0){
    toggleSubmissionError("screenID")
  }else{
    toggleSubmissionError("screenID","Invalid ID, Must be a positive integer")
    return false;
  }

  if(screenID.length <= 9){
    toggleSubmissionError("screenID")
  }else{
    toggleSubmissionError("screenID","Invalid ID, cannot be more than 9 characters")
    return false ;
  }
  return true;
}

function Submission(){
  let screenID = document.getElementById("screenID").value;
  if(!validateID(screenID)){
    return;
  }
  socket.emit("checkScreen",screenID)
  let message = document.getElementById("messageArea").value;
  let uniqueID = document.getElementById("databaseID")
  let databaseID = (uniqueID.innerHTML).split("= ")[1]
  uniqueID.innerHTML = ""

  //uniqueID =

  console.log(uniqueID)
  let messageSubmission = {
    id:screenID,
    message:message,
    uniqueID:databaseID,
  }
  console.log(messageSubmission)
  socket.emit("saveMessage",messageSubmission)
}
function BuildingSubmission(){
  let message = document.getElementById("BuildingmessageArea").value;
  let buildingID = document.getElementById("buildingIDSub").value;
  let uniqueID = document.getElementById("databaseBuildingID")
  let databaseID = (uniqueID.innerHTML).split("= ")[1]
  uniqueID.innerHTML = ""

  let messageSubmission = {
    message:message,
    buildingID:buildingID,
    uniqueID:databaseID,
  }
  console.log(messageSubmission)
  socket.emit("saveBuildingMessage",messageSubmission)
}
