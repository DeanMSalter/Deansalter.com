
<?php
$mysqli = mysqli_connect("localhost", "root", "root", "test");
if($mysqli === false){
    die("ERROR: Could not connect. " . mysqli_connect_error());
}

$data = array();
$sql = "SELECT id, firstname, email FROM MyGuests";
$result = $mysqli->query($sql);

//Checks to see if the next row in the "results" is valid , then outputs whatever
while($row = mysqli_fetch_array($result)){
  $rowArray = array('id' => $row["id"] , 'firstname' => $row["firstname"], 'email' => $row["email"]);
  array_push($data,$rowArray);
}

echo json_encode($data);


  // Do what you want to $row, its now an array of the current row.



?>
