<?php

  $hello =  $_COOKIE['id'];
  //echo $hello;

  $mysqli = connectDatabase("test");

  $id = $hello;
  $sql = "DELETE FROM MyGuests WHERE id = '$id'";
  runQuery($mysqli,$sql);



  $mysqli->close();

  function connectDatabase($databaseName){
    $mysqli = mysqli_connect("localhost", "root", "root", "$databaseName");
    if($mysqli === false){
        die("ERROR: Could not connect. " . mysqli_connect_error());
    }else{
      return $mysqli;
    }
  }

  function runQuery($mysqli,$sql){
    if ($mysqli->query($sql) === TRUE) {
        echo "Succesful";
    } else {
        echo "Error: " . $sql . "<br>" . $mysqli->error;
    }
  }


?>
