<meta name="viewport" content="initial-scale=1.0">
<html>
<head>
<title> Deans testing website </title>
<link rel="stylesheet" href="index.css">

</head>



<body>
<form action="insert.php" method="post" target="dummyframe" onsubmit="this.submit(); this.reset(); return false;">
Name: <input type="text" name="name"><br>
E-mail: <input type="text" name="email"><br>
<input type="submit">
</form>



<button id="clickButton" class="buttonStyle">Update list</button>
<ul id="databaseList">

</ul>


<script>




  var myButton = document.getElementById("clickButton");


  myButton.addEventListener('click', getData, false)

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
    request.send();
}

//response comes from request.responseText
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

}



</script>


Welcome <?php echo $_POST["name"]; ?><br>
Your email address is: <?php echo $_POST["email"]; ?>
<h3>Java Script practising</h3>
<nav>
<a href="https://www.deansalter.com/palindrome.html"> Plaindrome </a>
<a href="https://www.deansalter.com/ball.html"> Ball </a>
<a href="https://www.deansalter.com/enemies.html"> Enemies </a>
</nav>
<iframe id="palindrome" src="https://www.deansalter.com/palindrome.html" height= 500px; width=350px scrolling="no"></iframe>
<iframe id="ball" src="https://www.deansalter.com/ball.html"  height= 500px; width=500px scrolling="no"></iframe>
<p>

<iframe src="https://www.deansalter.com/enemies.html"  height = 660px; width = 858px; scrolling="no"></iframe>
<h2>Useful Links</h2>
<a href="https://cloud.scaleway.com/#/">  Scaleway</a>
<a href="https://account.names.co.uk/dashboard#/">  Names.co.uk</a>
<a href="https://www.wix.com/dashboard/15440e53-a389-4c32-a0b1-5a651877a841/home">  Wix</a>
<a href="https://ap.www.namecheap.com/dashboard">  Namecheap</a>
<a href="https://www.ssls.com/user/certificates/activate/5048449">  ssl</a><p>---------------------</p>
<script src="index.js"></script>
<iframe width="0" height="0" border="0" name="dummyframe" id="dummyframe">

</iframe>
</body>
</html>
