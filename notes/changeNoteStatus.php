<?php
ini_set('display_errors', 1);
error_reporting(-1);

$mysqli = mysqli_connect("localhost","root","root","website");
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

$stmt = $mysqli->prepare("UPDATE note  set noteStatus = ? where noteId = ?");
$stmt->bind_param('ss', $noteStatus, $noteId);
$noteStatus = "$_POST[noteStatus]";
$noteId = "$_POST[noteId]";

$stmt->execute();
$stmt->close();
$mysqli->close();
?>
