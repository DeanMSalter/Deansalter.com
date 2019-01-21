
//Updates the list every 0.5 seconds , dirty as all hell but works for now.
//TODO: Better solution.
window.setInterval(function(){
  getData();
}, 500);

let updateButton = document.getElementById("updateButton");
let purgeButton = document.getElementById("purgeButton");

updateButton.addEventListener('click', getData, false)
purgeButton.addEventListener('click', purgeData, false)

function getData() {
    //Set the request handler
    var request = new XMLHttpRequest();
    var url = "getData.php";

    //opens a request to send/post data to the specifed url
    request.open("POST", url, true);
    //sets the type of data to send
    request.setRequestHeader("Content-Type", "text/html");

    //When request is accpeted/recieved
    request.onreadystatechange = function() {
      //Checks to see if the request is fine (4 means complete , 200 is okay)
      if(request.readyState == 4 && request.status == 200) {
          let parsedData = JSON.parse(request.responseText);
        updateList(parsedData);

      }
    }
    //Send the request with the above "settings"
    request.send();}
function purgeData(){
  //Set the request handler
  var request = new XMLHttpRequest();
  var url = "purgeData.php";

  //opens a request to send/post data to the specifed url
  request.open("POST", url, true);
  //sets the type of data to send
  request.setRequestHeader("Content-Type", "text/html");

  //When request is accpeted/recieved
  request.onreadystatechange = function() {
    //Checks to see if the request is fine (4 means complete , 200 is okay)
    if(request.readyState == 4 && request.status == 200) {
      console.log("complete");

    }
  }
  //Send the request with the above "settings"
  request.send();
  let status = document.getElementById('status');
  status.textContent = "Purged List!"
  getData();
}
function updateList(response) {
  let list = document.getElementById('databaseTable');
  while(list.rows.length > 0){
    list.deleteRow(0);
  }
  console.log(list.rows.length)

   if(response.length == 0){

    let row = document.createElement('tr');
    let value1 = document.createElement('th');
    value1.appendChild(document.createTextNode("Database is empty!"));
    row.appendChild(value1);
    list.appendChild(row);
  }else{
    let row = document.createElement('tr');
    let value1 = document.createElement('th');
    let value2 = document.createElement('th');
    let value3 = document.createElement('th');
    let value4 = document.createElement('th');
    value1.appendChild(document.createTextNode("ID"));
    value2.appendChild(document.createTextNode("Name"));
    value3.appendChild(document.createTextNode("Email"));
    value4.appendChild(document.createTextNode("Actions"));
    value1.id="Tableheader";
    value2.id="Tableheader";
    value3.id="Tableheader";
    value4.id="Tableheader";
    row.appendChild(value1);
    row.appendChild(value2);
    row.appendChild(value3);
    row.appendChild(value4);
    list.appendChild(row);
  }
  for(let i = 0;i<=response.length-1;i++){

    let row = document.createElement('tr');


    let id = document.createElement('th');
    let name = document.createElement('th');
    let email = document.createElement('th');
    let actionButtons = document.createElement('th');

    id.appendChild(document.createTextNode(response[i].id));
    name.appendChild(document.createTextNode(response[i].firstname));

    let delButton = document.createElement('input');
    delButton.type = "button";
    delButton.value = "Delete " + (response[i].id);
    delButton.addEventListener('click', function(){
        console.log(response[i].id)
        document.cookie="id=" + (response[i].id) ;
        deleteRequest();
    }, false)




    email.appendChild(document.createTextNode(response[i].email));
    actionButtons.appendChild(delButton);
    row.appendChild(id);
    row.appendChild(name);
    row.appendChild(email);
    row.appendChild(actionButtons);
    list.appendChild(row);

  }
  let status = document.getElementById('status');
}
function deleteRequest(){

  let xmlhttp;
  xmlhttp=new XMLHttpRequest();

  xmlhttp.onreadystatechange=function(){
    if (xmlhttp.readyState==4 && xmlhttp.status==200){
    // Do something with the results here
    }
  }
  xmlhttp.open("GET","deleteValue.php",true);
  xmlhttp.send();
}
