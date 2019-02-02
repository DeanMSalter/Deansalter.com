
//Updates the list every 0.5 seconds , dirty as all hell but works for now.
//TODO: Better solution.

window.setInterval(function(){
  getData();
}, 500);


let purgeButton = document.getElementById("purgeButton");

purgeButton.addEventListener('click', purgeData, false)

function getData() {
    //Set the request handler
    var request = new XMLHttpRequest();
    var url = "../php/getData.php";

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
  var url = "../php/purgeData.php";

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
  getData();
}
function updateList(response) {
  let list = document.getElementById('databaseTable');
   while(list.rows.length > 3){
          list.deleteRow(list.rows.length-1);


   }
   if(response.length == 0){

    let row = document.createElement('tr');
    let value1 = document.createElement('td');
    value1.appendChild(document.createTextNode("Database is empty!"));
    value1.colSpan = "4";
    value1.className="Tableheader";
    row.appendChild(value1);
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
    email.appendChild(document.createTextNode(response[i].email));

    let delButton = document.createElement('form');
    delButton.method="post";
    delButton.action="../php/deleteValue.php";
    delButton.target="dummyframe";
    delButton.id="deleteForm";
    let input = document.createElement('input');
    input.className= "button";
    input.name="delete_Button";
    input.type = "submit";
    input.value = "Delete";
    input.id="deleteButton";
    delButton.appendChild(input);

    let inputHidden = document.createElement('input');
    inputHidden.type = "hidden";
    inputHidden.name="id";
    inputHidden.value = response[i].id;
    delButton.appendChild(inputHidden);

    actionButtons.appendChild(delButton);
    row.appendChild(id);
    row.appendChild(name);
    row.appendChild(email);
    row.appendChild(actionButtons);
    list.appendChild(row);

  }
}


function deleteRequest(){

  let xmlhttp;
  xmlhttp=new XMLHttpRequest();

  xmlhttp.onreadystatechange=function(){
    if (xmlhttp.readyState==4 && xmlhttp.status==200){
    // Do something with the results here
    }
  }
  xmlhttp.open("GET","../php/deleteValue.php",true);
  xmlhttp.send();
}
//getData();
