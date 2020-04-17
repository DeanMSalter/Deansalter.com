<?php
include ('../main.php');
$mysqli = mysqliConnect();

$stmt = "select N.*, U.* from note N
left join userNote UN on N.noteId = UN.noteId
left join user U on UN.userId = U.userId
where noteStatus is null or noteStatus != 'NOTE_REMOVED'";
if (!$mysqli -> query($stmt)) {
    echo("Error description: " . $mysqli -> error);
}
$result = $mysqli->query($stmt);
$arr = array();
while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
    $arr[] = $row;
}
echo json_encode($arr);

$mysqli->close();
?>
