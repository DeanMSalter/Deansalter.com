<?php
include ('../main.php');
$mysqli = mysqliConnect();
$noteId = "$_POST[noteId]";
$idToken = "$_POST[idToken]";
$noteContent = "$_POST[noteContent]";

try{
    if(validUserForNote($mysqli, $noteId, $idToken)){
        $stmt1 = $mysqli->prepare("UPDATE note set noteContent = ? where noteId = ?");
        $stmt1->bind_param('ss', $noteContent, $noteId);
        $stmt1->execute();
        $stmt1->close();

        $stmt2 = $mysqli->prepare("UPDATE note set noteTitle = ? where noteId = ?");
        $stmt2->bind_param('ss', $noteTitle, $noteId);
        $noteTitle = "$_POST[noteTitle]";
        $stmt2->execute();
        $stmt2->close();
        $mysqli->close();
        echo json_encode(array(
            'successful' => array(
                'noteId' => $noteId,
                'noteContent' => $noteContent,
                'noteTitle' => $noteTitle,
            ),
        ));
    }else{
        $mysqli->close();
        throw new RuntimeException('Given UserId does not match the notes UserId', 401);
    }

}catch(Exception $e){
    echo json_encode(array(
        'error' => array(
            'msg' => $e->getMessage(),
            'code' => $e->getCode(),
        ),
    ));
}



?>
