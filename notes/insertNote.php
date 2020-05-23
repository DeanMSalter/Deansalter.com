<?php
include ('../main.php');

$noteTitle = "$_POST[noteTitle]";
$noteContent = "$_POST[noteContent]";
$idToken = isset($_POST['idToken']) ? $_POST['idToken'] : null;
$noteId = isset($_POST['noteId']) ? $_POST['noteId'] : null;
$notePassword = isset($_POST['notePassword']) ? $_POST['notePassword'] : null;

if($notePassword){
    $notePassword = password_hash($notePassword, PASSWORD_DEFAULT);
}

try{
    $mysqli = mysqliConnect();
    if($noteId){
        if(validUserForNote($mysqli, $noteId, $idToken)){
            $editNoteContentStmt = $mysqli->prepare("UPDATE note set noteContent = ? where noteId = ?");
            $editNoteContentStmt->bind_param('ss', $noteContent, $noteId);
            $editNoteContentStmt->execute();
            $editNoteContentStmt->close();

            $editNoteTitleStmt = $mysqli->prepare("UPDATE note set noteTitle = ? where noteId = ?");
            $editNoteTitleStmt->bind_param('ss', $noteTitle, $noteId);
            $editNoteTitleStmt->execute();
            $editNoteTitleStmt->close();

            $editNotePasswordStmt = $mysqli->prepare("UPDATE note set notePassword = ? where noteId = ?");
            $editNotePasswordStmt->bind_param('ss', $notePassword, $noteId);
            $editNotePasswordStmt->execute();
            $editNotePasswordStmt->close();

            $mysqli->close();
            echo json_encode(array(
                'successful' => array(
                    'noteId' => $noteId,
                    'noteContent' => $noteContent,
                    'noteTitle' => $noteTitle,
                    'notePassword' => $notePassword
                ),
            ));
        }else{
            $mysqli->close();
            throw new RuntimeException('Given UserId does not match the notes UserId', 401);
        }
    }else{
        $insertNoteStmt = $mysqli->prepare("INSERT INTO note (noteTitle, noteContent) VALUES (?,?)");
        $insertNoteStmt->bind_param('ss', $noteTitle, $noteContent);
        $insertNoteStmt->execute();
        $insertNoteStmt->close();
        $noteId = $mysqli->insert_id;

        $editNotePasswordStmt = $mysqli->prepare("UPDATE note set notePassword = ? where noteId = ?");
        $editNotePasswordStmt->bind_param('ss', $notePassword, $noteId);
        $editNotePasswordStmt->execute();
        $editNotePasswordStmt->close();

        $mysqli->close();


        if($idToken){
            $user = getUserFromTokenId($idToken);
            $mysqli2 = mysqliConnect();

            if ($user) {
                $userId = $user['sub'];
                $firstName = $user['given_name'];
                $lastName = $user['family_name'];
                $email = $user['email'];
                $validUser = findUser($mysqli2, $userId);
                if(empty($validUser)){
                    insertUser($mysqli2, $userId, $firstName, $lastName, $email);
                }

                $insertUserNoteStmt = $mysqli2->prepare("INSERT INTO userNote (userId, noteId) VALUES (?,?)");
                $insertUserNoteStmt->bind_param('ss', $userId, $noteId);
                $insertUserNoteStmt->execute();
                $insertUserNoteStmt->close();
                $mysqli2->close();
                echo json_encode(array(
                    'successful' => array(
                        'noteId' => $noteId,
                        'noteContent' => $noteContent,
                        'noteTitle' => $noteTitle,
                    ),
                ));
            } else {
                $mysqli2->close();
                throw new RuntimeException('Invalid TokenId Given', 404);
            }
        }else{
            echo json_encode(array(
                'successful' => array(
                    'noteId' => $noteId,
                    'noteContent' => $noteContent,
                    'noteTitle' => $noteTitle,
                ),
            ));
        }

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
