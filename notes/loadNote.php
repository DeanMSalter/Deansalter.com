<?php
include ('../main.php');
$mysqli = mysqliConnect();

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
