<?php
  $mysqli = connectDatabase("test");
  createTable($mysqli);
  insertIntoTable($mysqli);

  function connectDatabase($databaseName){
    $mysqli = mysqli_connect("localhost", "root", "root", "$databaseName");
    if($mysqli === false){
        die("ERROR: Could not connect. " . mysqli_connect_error());
    }else{
      return $mysqli;
    }
  }
  function createTable($mysqli){
    $sql = "CREATE TABLE IF NOT EXISTS MyGuests (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(30) NOT NULL,
    email VARCHAR(50)
    )";
    runQuery($mysqli,$sql);
  }
  function insertIntoTable($mysqli){
    $name = $_POST['name'];
    $email = $_POST['email'];
    $sql = "INSERT INTO MyGuests (firstname, email) VALUES ('$name','$email')";
    runQuery($mysqli,$sql);
  }
  function runQuery($mysqli,$sql){
    if ($mysqli->query($sql) === TRUE) {
        echo "Succesful";
    } else {
        echo "Error: " . $sql . "<br>" . $mysqli->error;
    }
  }


  $mysqli->close();
?>
