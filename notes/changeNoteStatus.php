<?php
include ('../main.php');

$noteStatus = "$_POST[noteStatus]";
$noteId = "$_POST[noteId]";
$idToken = "$_POST[idToken]";

try {
    $mysqli = mysqliConnect();
    if (validUserForNote($mysqli, $noteId, $idToken)){
        $stmt = $mysqli->prepare("UPDATE note  set noteStatus = ? where noteId = ?");
        $stmt->bind_param('ss', $noteStatus, $noteId);
        $stmt->execute();
        $stmt->close();
        $mysqli->close();
        echo json_encode(array(
            'successful' => array(
                'noteId' => $noteId,
                'noteStatus' => $noteStatus,
            ),
        ));
    }else{
        $mysqli->close();
        throw new RuntimeException('Given UserId does not match the notes UserId', 401);
    }
} catch (Exception $e) {
    echo json_encode(array(
        'error' => array(
            'msg' => $e->getMessage(),
            'code' => $e->getCode(),
        ),
    ));
}
?>
