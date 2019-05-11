const socket = io('/',{transports: ['websocket']});


let buildingList;
socket.on("updateBuildingList",function(data){
  console.log("running")
  populateBuildingList(data)
  buildingList = data;
});
socket.on("updateAllBuildingMessages",function(data){
  populateBuildingMessageList(data)
});
socket.on("updateAllMessagesList",function(data){
  populateMessageList(data)
});
//recives signal from server on wether the screen id being used has been created or not
socket.on("ScreenSaved",function(data){
  if(!data){
      toggleSubmissionError("screenID","Not a valid Screen. Please create a screen on the settings page!")
  }else{
      toggleSubmissionError("screenID","")
  }
});
socket.on("BuildingSaved",function(data){
  console.log("check save")
  if(!data){
      toggleSubmissionError("buildingIDSub","Not a valid Building ID. Please create a building on the settings page!")
  }else{
      toggleSubmissionError("buildingIDSub","")
  }
});

//Creates the submit buttons under the respective tables
//Both functions will call themselves once the page loads
(function createSubmitButt(){
  let table = document.getElementById("submissionTable")
  let row = table.insertRow(table.rows.length);
  let cell1 = row.insertCell(0)

  cell1.innerHTML = "Submit"
  cell1.onclick = Submission
  cell1.style.backgroundColor = "rgb(100,255,100)"
})();
(function createBuildingSubmitButt(){
  let table = document.getElementById("buildingSubmissionTable")
  let row = table.insertRow(table.rows.length);
  let cell1 = row.insertCell(0)

  cell1.innerHTML = "Submit"
  cell1.style.backgroundColor = "rgb(100,255,100)"
  cell1.onclick = BuildingSubmission

})();

//Add the content to all the tables
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
function populateBuildingMessageList(data){
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
    createDeleteAllBuildingButt()
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
    createDeleteAllMessagesButt()
  }

}

//add Delete All buttons under respective tables
//Only called if a table has something in it
function createDeleteAllBuildingButt(){
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
function createDeleteAllMessagesButt(){
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

//converts boolean to integer to be stored in database
function convertToTinyInt(value){
  if(value){
    return 1;
  }else {
    return 0;
  }
}
//converts tiny int to boolean to be displayed in table
function convertToBoolean(value){
  if(value == 1){
    return true;
  }else if(value == 0){
    return false;
  }
}
//Used to show an error and the given text in any input that is incorrect
function toggleSubmissionError(elementName,text = ""){
  //console.log(elementName)
  let element = document.getElementById(elementName);
  if(!text){
    element.style.backgroundColor = "white";
    element.title = "";
  }else{
    element.style.backgroundColor = "rgb(255,200,200)";
    element.title = text;
  }

}
//Ensures the screen ID is correct
function validateID(validate,component){
  console.log(component)
  if(validate % 1 === 0){
    toggleSubmissionError(component)
  }else{
    toggleSubmissionError(component,"Invalid ID,Must be a full Integer")
    return false;
  }
  let validateInt = parseInt(validate, 10);

  if(Number.isInteger(validateInt)){
    toggleSubmissionError(component)
  }else{
    toggleSubmissionError(component,"Invalid ID, Must be Integer")
    return false;
  }
  if(validateInt >= 0){
    toggleSubmissionError(component)
  }else{
    toggleSubmissionError(component,"Invalid ID, Must be a positive integer")
    return false;
  }

  if(validate.length <= 9){
    toggleSubmissionError(component)
  }else{
    toggleSubmissionError(component,"Invalid ID, cannot be more than 9 characters")
    return false ;
  }
  return true;
}

//Functions that the submit buttons call
function Submission(){
  let screenID = document.getElementById("screenID").value;
  let message = document.getElementById("messageArea").value;
  let uniqueID = document.getElementById("databaseID")
  let databaseID = (uniqueID.innerHTML).split("= ")[1]
  //When the user clicks submit , stop editing the screen they clicked edit on
  uniqueID.innerHTML = ""
  if(!validateID(screenID,"screenID")){
    return;
  }

  let messageSubmission = {
    id:screenID,
    message:message,
    uniqueID:databaseID,
  }
  socket.emit("saveMessage",messageSubmission)
}
function BuildingSubmission(){
  let message = document.getElementById("BuildingmessageArea").value;
  let buildingID = document.getElementById("buildingIDSub").value;
  let uniqueID = document.getElementById("databaseBuildingID")
  let databaseID = (uniqueID.innerHTML).split("= ")[1]
  uniqueID.innerHTML = ""
  if(!validateID(buildingID,"buildingIDSub")){
    return;
  }
  socket.emit("checkBuilding",buildingID)

  let messageSubmission = {
    message:message,
    buildingID:buildingID,
    uniqueID:databaseID,
  }
  socket.emit("saveBuildingMessage",messageSubmission)
}

//updates the date and time every second
let timeBar = document.getElementById("time")
let dateBar = document.getElementById("date")
setInterval(function(){
  let current = new Date();
  let time = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
  let date = current.getDate() + "/"+(current.getMonth()+1)+ "/" + current.getFullYear()
  timeBar.innerHTML = time;
  dateBar.innerHTML = date;

},1000*1);
