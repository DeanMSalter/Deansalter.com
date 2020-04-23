<?php
include ('../main.php');

$idToken = "$_POST[idToken]";
$noteId = "$_POST[noteId]";
try{
    $mysqli = mysqliConnect();
    if(validUserForNote($mysqli, $noteId, $idToken)){
        $stmt = $mysqli->prepare("select * from note where noteId = ?");
        $stmt->bind_param("s", $noteId);

        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        echo json_encode(array(
            'note' => array(
                'noteId' => $row["noteId"],
                'noteContent' => $row["noteContent"],
                'noteTitle' => $row["noteTitle"],
                'noteStatus' => $row["noteStatus"],
                'noteDate' => $row["noteDate"],
            ),
        ));
        $stmt->close();
        $mysqli->close();
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
