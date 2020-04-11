<?php
ini_set('display_errors', 1);
error_reporting(-1);

$mysqli = mysqli_connect("localhost","root","root","website");
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

$stmt = $mysqli->prepare("INSERT INTO note (noteTitle, noteContent) VALUES (?,?)");
$stmt->bind_param('ss', $noteTitle, $noteContent);
$noteTitle = "$_POST[noteTitle]";
$noteContent = "$_POST[noteContent]";

$stmt->execute();
$stmt->close();
$mysqli->close();
?>
