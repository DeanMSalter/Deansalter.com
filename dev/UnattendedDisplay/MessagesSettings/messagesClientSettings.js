const socket = io('/',{transports: ['websocket']});


socket.on("updateSettingsList",function(data){
  populateSettingsList(data)
});
socket.on("updateBuildingList",function(data){
  populateBuildingList(data)
});

//Signals recieved from the server when the submitted city is not valid
socket.on("notValid",function(){
  document.getElementById("city").style.backgroundColor = "rgb(255,200,200)";
  document.getElementById("city").title = "Invalid City";
});
socket.on("valid",function(){
  document.getElementById("city").style.backgroundColor = "white";
  document.getElementById("city").title = "";
});

//Adds the submit button for settings
//(This function will run itself when the page is loaded)
(function addSettingSubmissionButt(){
  //Gets the settings table and adds a row with one cell at the bottom of it
  let table = document.getElementById("submissionTable")
  let row = table.insertRow(table.rows.length);
  let cell1 = row.insertCell(0)

  //style the cell and add a click event
  cell1.innerHTML = "Submit"
  cell1.onclick = Submission
  cell1.style.backgroundColor = "rgb(100,255,100)"
  cell1.style.fontWeight = "1000"
})();

//Same thing but for the building creating button
(function addBuildingCreateButt(){
  let table = document.getElementById("creationTable")
  let row = table.insertRow(table.rows.length);
  let cell1 = row.insertCell(0)

  cell1.innerHTML = "Create"
  cell1.style.backgroundColor = "rgb(100,255,100)"
  cell1.onclick = Create
  cell1.style.fontWeight = "1000"
})();

//Same thing but for the delete all button under the settings database table
//Called once we check if the table actually contains anything
function addDeleteAllButt(){
  let table = document.getElementById("databaseTable")
  let row = table.insertRow(table.rows.length);
  let cell = row.insertCell(0);
  cell.innerHTML = "Delete ALL"
  cell.onclick = function(){
    if (confirm("Delete all stored screen settings?")) {
        socket.emit("purgeSettings")
    }
  }
  cell.style.backgroundColor = "rgb(255,150,150)"
  cell.style.fontWeight = "1000"
}
function addDeleteAllBuildingButt(){
  let table = document.getElementById("buildingsTable")
  let row = table.insertRow(table.rows.length);
  let cell = row.insertCell(0);
  cell.innerHTML = "Delete ALL"
  cell.onclick = function(){
    if (confirm("Delete all stored buildings?")) {
        socket.emit("purgeBuildings")
    }
  }
  cell.style.backgroundColor = "rgb(255,150,150)"
  cell.style.fontWeight = "1000"
}
//Adds the buildings to the building table
function populateBuildingList(data){
  let tableBody = document.getElementById("buildingsTableBody")
  tableBody.innerHTML = "";

  //Runs through for every building stored
  for(let i = 0;i<data.length;i++){
      let row = tableBody.insertRow(0);

      let cell1 = row.insertCell(0);
      let cell2 = row.insertCell(1);
      let cell3 = row.insertCell(2);
      let cell4 = row.insertCell(3);

      cell1.innerHTML = data[i].uniqueID;
      cell2.innerHTML = data[i].building;

      cell3.innerHTML = "Edit"
      cell3.style.fontWeight = "1000"
      cell3.style.backgroundColor = "rgb(200,255,200)"
      cell3.onclick = function (){
        document.getElementById("buildingUniqueID").innerHTML = "ID = " + data[i].uniqueID
        document.getElementById("buildingName").value = data[i].building
      };

      cell4.innerHTML = "Delete"
      cell4.style.fontWeight = "1000"
      cell4.style.backgroundColor = "rgb(255,200,200)"
      cell4.onclick = function (){
         socket.emit("deleteBuilding",data[i])
      };
  }

  //If the table is empty, tell the user its empty
  if(tableBody.innerHTML == ""){
    let row = tableBody.insertRow(0);
    let cell1 = row.insertCell(0);
    cell1.innerHTML = "No buildings saved.";
    cell1.colSpan = "7"

    let row2 = tableBody.insertRow(1);
    let cell2 = row2.insertCell(0);
    cell2.colSpan = "7"
    cell2.innerHTML = "Use the create building table.";

  }else{
    addDeleteAllBuildingButt()
  }

}
//Adds the settings to the settings table
function populateSettingsList(data){

  let tableBody = document.getElementById("databaseTableBody")
  tableBody.innerHTML = "";
  //Runs through for every screen stored
  for(let i = 0;i<data.length;i++){
      let row = tableBody.insertRow(0);

      let cell1 = row.insertCell(0);
      let cell2 = row.insertCell(1);
      let cell3 = row.insertCell(2);
      let cell5 = row.insertCell(3);
      let cell6 = row.insertCell(4);

      let cell7 = row.insertCell(5);
      let cell8 = row.insertCell(6);
      let cell9 = row.insertCell(7);

      cell1.innerHTML = data[i].id;
      cell2.innerHTML = data[i].city;
      cell3.innerHTML = data[i].building;

      cell5.innerHTML = convertToBoolean(data[i].buildingInfo);
      cell6.innerHTML = convertToBoolean(data[i].mainInfo);


      cell7.innerHTML = "Edit"
      cell7.style.fontWeight = "1000"
      cell7.style.backgroundColor = "rgb(200,255,200)"
      cell7.onclick = function (){
        document.getElementById("screenID").value = data[i].id
        document.getElementById("city").value = data[i].city
        document.getElementById("building").value = data[i].building
      };

      cell8.innerHTML = "Delete"
      cell8.style.fontWeight = "1000"
      cell8.style.backgroundColor = "rgb(255,200,200)"
      cell8.onclick = function (){
         socket.emit("deleteSetting",data[i])
      };

      cell9.innerHTML = "View"
      cell9.style.fontWeight = "1000"
      cell9.style.backgroundColor = "rgb(230,230,200)"
      cell9.onclick = function (){
        console.log()
         window.open((window.location.href).split("settings/")[0]+"?id=" + data[i].id);
      };

  }
  //if the table is not empty then add the delete all button else {
  //tell the user its empty
  if(tableBody.innerHTML != ""){
    addDeleteAllButt()
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

//Utility function to show the user that there has been an error in submission
//and shows them whatever text is passed to it
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

//Ensures the id entered is a valid ID
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

//Converts boolean to tinyInt for storage in database
function convertToTinyInt(value){
  if(value){
    return 1;
  }else {
    return 0;
  }
}
//convert back to boolean for display in table
function convertToBoolean(value){
  if(value == 1){
    return true;
  }else if(value == 0){
    return false;
  }
}

//function used by the create button for submitting a new building
function Create(){
  let buildingName = document.getElementById("buildingName").value;
  let uniqueID = document.getElementById("buildingUniqueID")
  let databaseID = (uniqueID.innerHTML).split("= ")[1]
  uniqueID.innerHTML = ""
  let settings = {
    building: buildingName,
    uniqueID:databaseID
  }
  socket.emit("saveBuilding",settings)
}
//function used by the submit button for submitting a new screen
function Submission(){
  let screenID = document.getElementById("screenID").value;
  if(!validateID(screenID)){
    return;
  }

  let city = document.getElementById("city").value;
  let building = document.getElementById("building").value;
  let buildingInfo = document.getElementById("buildingInfo").checked;
  let mainInfo = document.getElementById("mainInfo").checked;

  buildingInfo = convertToTinyInt(buildingInfo);
  mainInfo = convertToTinyInt(mainInfo);

  let settings = {
    id:screenID,
    city:city,
    building:building,
    buildingInfo:buildingInfo,
    mainInfo:mainInfo
  }
  socket.emit("saveSettings",settings)
}

//Updates the time and date display
let timeBar = document.getElementById("time")
let dateBar = document.getElementById("date")

setInterval(function(){
  let current = new Date();
  let time = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
  let date = current.getDate() + "/"+(current.getMonth()+1)+ "/" + current.getFullYear()
  timeBar.innerHTML = time;
  dateBar.innerHTML = date;
},1000*1);
