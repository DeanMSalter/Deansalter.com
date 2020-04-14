<?php
include ('../main.php');
$mysqli = mysqliConnect();

$stmt1 = $mysqli->prepare("UPDATE note set noteContent = ? where noteId = ?");
$stmt1->bind_param('ss', $noteContent, $noteId);
$noteContent = "$_POST[noteContent]";
$noteId = "$_POST[noteId]";
$stmt1->execute();
$stmt1->close();

$stmt2 = $mysqli->prepare("UPDATE note set noteTitle = ? where noteId = ?");
$stmt2->bind_param('ss', $noteTitle, $noteId);
$noteTitle = "$_POST[noteTitle]";
$stmt2->execute();
$stmt2->close();

$mysqli->close();
?>
