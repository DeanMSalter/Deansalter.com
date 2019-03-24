const socket = io('/messages',{transports: ['websocket']});

socket.on("updateSettingsList",function(data){
  populateDatabaseList(data)
});
socket.on("notValid",function(){
  document.getElementById("city").style.backgroundColor = "rgb(255,200,200)";
  document.getElementById("city").title = "Invalid City";
});
socket.on("valid",function(){
  document.getElementById("city").style.backgroundColor = "white";
  document.getElementById("city").title = "";
});

(function configSubmission(){
  let table = document.getElementById("submissionTable")
  let row = table.insertRow(table.rows.length);
  let cell1 = row.insertCell(0)

  cell1.innerHTML = "Submit"
  cell1.onclick = Submission
  cell1.style.backgroundColor = "rgb(200,200,255)"
})();

function configDatabaseTable(){
  let table = document.getElementById("databaseTable")
  let row = table.insertRow(table.rows.length);
  let cell = row.insertCell(0);
  cell.innerHTML = "Delete ALL"
  cell.onclick = function(){
    if (confirm("Delete all stored settings?")) {
        socket.emit("purgeSettings")
    }
  }
  cell.style.backgroundColor = "rgb(255,150,150)"
}

function populateDatabaseList(data){

  let tableBody = document.getElementById("databaseTableBody")
  tableBody.innerHTML = "";

   for(let i = 0;i<data.length;i++){
      let row = tableBody.insertRow(0);

      let cell1 = row.insertCell(0);
      let cell2 = row.insertCell(1);
      let cell3 = row.insertCell(2);
      let cell4 = row.insertCell(3);
      let cell5 = row.insertCell(4);
      let cell6 = row.insertCell(5);

      cell1.innerHTML = data[i].id;
      cell2.innerHTML = data[i].city;
      cell3.innerHTML = data[i].building;

      cell4.innerHTML = "Edit"
      cell4.style.backgroundColor = "rgb(200,255,200)"
      cell4.onclick = function (){
        document.getElementById("screenID").value = data[i].id
        document.getElementById("city").value = data[i].city
        document.getElementById("building").value = data[i].building
      };

      cell5.innerHTML = "Delete"
      cell5.style.backgroundColor = "rgb(255,200,200)"
      cell5.onclick = function (){
         socket.emit("deleteSetting",data[i])
      };

      cell6.innerHTML = "View"
      cell6.style.backgroundColor = "rgb(230,230,200)"
      cell6.onclick = function (){
        console.log()
         window.open((window.location.href).split("settings/")[0]+"?id=" + data[i].id);
      };

  }
  if(tableBody.innerHTML != ""){
    configDatabaseTable()
  }else{
    let row = tableBody.insertRow(0);
    let cell1 = row.insertCell(0);
    cell1.innerHTML = "No settings saved.";
    cell1.colSpan = "7"

    let row2 = tableBody.insertRow(1);
    let cell2 = row2.insertCell(0);
    cell2.colSpan = "7"
    cell2.innerHTML = "Use the table on the left to insert settings";

    let row3 = tableBody.insertRow(2);
    let cell3 = row3.insertCell(0);
    cell3.colSpan = "7"
    cell3.innerHTML = "Enter ?id=id to view the screen with the specified id";
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

  let city = document.getElementById("city").value;
  let building = document.getElementById("building").value;

  let settings = {
    id:screenID,
    city:city,
    building:building,
  }
  socket.emit("saveSettings",settings)
}
