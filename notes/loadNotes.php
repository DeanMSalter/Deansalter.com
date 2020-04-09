<?php
ini_set('display_errors', 1);
error_reporting(-1);

$mysqli = mysqli_connect("localhost","root","root","website");
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

$stmt = "select * from note";

$result = $mysqli->query($stmt);
$arr = array();
while ($row = mysqli_fetch_array($result, MYSQLI_NUM)) {
    $arr[] = $row;
}
echo json_encode($arr);

$mysqli->close();
?>
