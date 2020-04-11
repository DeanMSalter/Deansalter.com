<?php
ini_set('display_errors', 1);
error_reporting(-1);

$mysqli = mysqli_connect("localhost","root","root","website");
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}
$noteId = "$_POST[noteId]";
$stmt = $mysqli->prepare("select * from note where noteId = ?");
$stmt->bind_param("s", $noteId);

$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
echo json_encode($row);

$stmt->close();
$mysqli->close();
?>
