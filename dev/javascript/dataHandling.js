
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
  let list = document.getElementById('databaseList');
  while(list.firstChild){
    list.removeChild(list.firstChild);
  }

  for(let i = 0;i<=response.length-1;i++){
    let entry = document.createElement('li');
    let textContent = "ID: " + response[i].id + " Name: " +response[i].firstname + " Email: " + response[i].email
    entry.appendChild(document.createTextNode(textContent));
    list.appendChild(entry);

  }
  let status = document.getElementById('status');
}
