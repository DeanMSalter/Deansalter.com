const socket = io('/messages',{transports: ['websocket']});
let timeBar = document.getElementById("time")
let dateBar = document.getElementById("date")
setInterval(function(){
  let current = new Date();
  let time = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
  let date = current.getDate() + "/"+(current.getMonth()+1)+ "/" + current.getFullYear()
  timeBar.innerHTML = time;
  dateBar.innerHTML = date;

},1000*1);

socket.on("updateBuildingList",function(data){
  console.log("updating buildings")
  populateDatabaseList(data)
});

(function configSubmission(){
  let table = document.getElementById("submissionTable")
  let row = table.insertRow(table.rows.length);
  let cell1 = row.insertCell(0)

  cell1.innerHTML = "Submit"
  cell1.style.backgroundColor = "rgb(100,255,100)"
  cell1.onclick = Submission

})();
(function configCreation(){
  let table = document.getElementById("creationTable")
  let row = table.insertRow(table.rows.length);
  let cell1 = row.insertCell(0)

  cell1.innerHTML = "Create"
    cell1.style.backgroundColor = "rgb(237, 221, 52)"
  cell1.onclick = Create

})();

socket.on("duplicateBuilding",function(data){
  if(data){
    toggleSubmissionError("buildingName","This building has already been created!")
  }else{
    toggleSubmissionError("buildingName","")
  }
})
// function configMessagesTable(){
//   let table = document.getElementById("messagesTable")
//   let row = table.insertRow(table.rows.length);
//   let cell = row.insertCell(0);
//   cell.innerHTML = "Delete ALL"
//   cell.onclick = function(){
//     if (confirm("Delete all stored settings?")) {
//
//         socket.emit("purgeMessages")
//     }
//   }
//   cell.style.backgroundColor = "rgb(255,150,150)"
// }
//
function populateDatabaseList(data){

  let tableBody = document.getElementById("buildingsTableBody")
  tableBody.innerHTML = "";

   for(let i = 0;i<data.length;i++){
      let row = tableBody.insertRow(0);

      let cell1 = row.insertCell(0);
      let cell2 = row.insertCell(1);
      let cell3 = row.insertCell(2);



      cell1.innerHTML = data[i].uniqueID;
      cell2.innerHTML = data[i].building;
      cell3.innerHTML = "Something";



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
//
// function populateMessageList(data){
//
//   let tableBody = document.getElementById("messagesTableBody")
//   tableBody.innerHTML = "";
//
//    for(let i = 0;i<data.length;i++){
//       let row = tableBody.insertRow(0);
//
//       let cell0 = row.insertCell(0);
//       let cell1 = row.insertCell(1);
//       let cell2 = row.insertCell(2);
//       let cell3 = row.insertCell(3);
//       let cell4 = row.insertCell(4);
//       let cell5 = row.insertCell(5);
//
//       cell0.innerHTML = data[i].uniqueID;
//       cell1.innerHTML = data[i].id;
//       cell2.innerHTML = data[i].message;
//
//
//       cell3.innerHTML = "Edit"
//       cell3.style.backgroundColor = "rgb(200,255,200)"
//       cell3.onclick = function (){
//         document.getElementById("screenID").value = data[i].id
//         document.getElementById("messageArea").value = data[i].message
//         document.getElementById("databaseID").innerHTML = "ID = " + data[i].uniqueID
//       };
//
//       cell4.innerHTML = "Delete"
//       cell4.style.backgroundColor = "rgb(255,200,200)"
//       cell4.onclick = function (){
//          socket.emit("deleteMessage",data[i])
//       };
//
//       cell5.innerHTML = "View"
//       cell5.style.backgroundColor = "rgb(230,230,200)"
//       cell5.onclick = function (){
//         console.log()
//          window.open((window.location.href).split("submission/")[0]+"?id=" + data[i].id);
//       };
//
//
//   }
//   if(tableBody.innerHTML == ""){
//     let row = tableBody.insertRow(0);
//     let cell1 = row.insertCell(0);
//     cell1.innerHTML = "No messages saved.";
//     cell1.colSpan = "3"
//
//     let row2 = tableBody.insertRow(1);
//     let cell2 = row2.insertCell(0);
//     cell2.colSpan = "3"
//     cell2.innerHTML = "submit a message in the table above";
//   }else{
//     configMessagesTable()
//   }
//
// }


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
function Create(){

  let buildingName = document.getElementById("buildingName").value;
  console.log(buildingName)
  socket.emit("saveBuilding",buildingName)
}
