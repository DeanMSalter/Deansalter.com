<?php
// Initialize the session
session_start();


// Check if the user is logged in, if not then redirect him to login page

function loggedIn(){
  if(isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true){
    return true;
  }else{
    return false;
  }
}
function getUser(){
  if(isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true){
    return $_SESSION["username"];
  }else{
    return false;
  }
}
?>


<meta name="viewport" content="initial-scale=1.0">
<html>
<head>
<title> Deans testing website </title>
<link rel="stylesheet" href="../css/index.css">
</head>
<body>
<<<<<<< HEAD
<div id="database">
  <form action="insert.php" method="post" target="dummyframe" onsubmit="this.submit(); this.reset(); return false;">
  Name: <input type="text" name="name"><br>
  E-mail: <input type="text" name="email"><br>
  <input type="submit" value="Enter">
  </form>

  <form action="deleteValue.php" method="post" target="dummyframe" onsubmit="this.submit(); this.reset(); return false;">
  ID: <input type="text" name="id"><br>
  <input type="submit" value="Delete">
  </form>

  <button id="updateButton" class="buttonStyle">Update list</button>
  <button id="purgeButton" class="buttonStyle">Purge list</button>
  <h5> Database entries </h5>
  <table id="databaseTable">
    <tr>
      <th >ID</th>
      <th >Name</th>
      <th >Email</th>
    </tr>
    <tr>
      <th> example</th>
      <th> example2</th>
      <th> example3</th>
    </tr>
  </table>
  <ul id="databaseList">
  </ul>
  <h2 id="status"></h2>
</div>

<h3>Java Script asdasdas</h3>
=======

<h1> <?php if(loggedIn()){
  echo getUser();
}?></h1>
<h3 id="header1">Java Script testing</h3>
<?php
  if(!loggedIn()){
    echo "<button type='button' id='loginButton'><a href='login.php'>Sign in</a></button>";
    echo "<button type='button' id='registerButton'><a href='register.php'>Register</a></button>";
  }else{
      echo "<button type='button' id='logoutButton'><a href='logout.php'>Sign Out of Your Account</a></button>";
  }

 ?>
>>>>>>> 7d6721c7f36ccfe106f03c8f4f77fe9b52e07adf
<nav>
<a href="../html/palindrome.html"> Plaindrome </a>
<a href="../html/ball.html"> Ball </a>
<a href="../html/enemies.html"> Enemies </a>
</nav>
<iframe id="palindrome" src="../html/palindrome.html" height= 500px; width=350px scrolling="no"></iframe>
<iframe id="ball" src="../html/ball.html"  height= 500px; width=500px scrolling="no"></iframe>
<iframe src="../html/database.html"  height = 500px; width = 500px; scrolling="yes"></iframe>
<p>
<iframe src="../html/enemies.html"  height = 660px; width = 858px; scrolling="no"></iframe>


<h2>Useful Links</h2>
<a href="https://cloud.scaleway.com/#/">  Scaleway</a>
<a href="https://account.names.co.uk/dashboard#/">  Names.co.uk</a>
<a href="https://www.wix.com/dashboard/15440e53-a389-4c32-a0b1-5a651877a841/home">  Wix</a>
<a href="https://ap.www.namecheap.com/dashboard">  Namecheap</a>
<a href="https://www.ssls.com/user/certificates/activate/5048449">  ssl</a><p>---------------------</p>

</body>
</html>
