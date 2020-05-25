<?php
include ('../main.php');
$noteId = "$_POST[noteId]";

$mysqli = mysqliConnect();
$notePasswordRequiredStmt = $mysqli->prepare("select noteId from note where noteId = ? and notePassword IS NULL");
$notePasswordRequiredStmt->bind_param("s", $noteId);
$notePasswordRequiredStmt->execute();

$result = $notePasswordRequiredStmt->get_result();
$note = $result->fetch_array(MYSQLI_ASSOC);
$result->close();
$notePasswordRequiredStmt->close();
if(empty($note)){
    echo json_encode(array(
        'requiresPassword' => true,
    ));
}else{
    echo json_encode(array(
        'requiresPassword' => false,
    ));
}
?>