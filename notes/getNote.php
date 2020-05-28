<?php
    include ('../main.php');

    $aResult = array();
    if( !isset($_POST['functionName']) ) { $aResult['error'] = 'No function name!'; }

    if( !isset($aResult['error']) ) {
        switch($_POST['functionName']) {
            case 'loadNotes':
                loadNotes();
                break;
            case 'loadNote':
                loadNote();
                break;
            case 'requiresPassword':
                requiresPassword();
                break;
            default:
                $aResult['error'] = 'Not found function '.$_POST['functionname'].'!';
                break;
        }
    }


    function requiresPassword(){
        $noteId = (string) $_POST['noteId'];
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
    }
    function loadNote(){
        $idToken = isset($_POST['idToken']) ? $_POST['idToken'] : null;
        $idToken = $idToken !== "" ? $idToken : null;
        $noteId = (string) $_POST['noteId'];
        $givenPassword = isset($_POST['givenPassword']) ? $_POST['givenPassword'] : null;

        try{
            $mysqli = mysqliConnect();
            if(validUserForNote($mysqli, $noteId, $idToken)){
                if(validPassword($mysqli,$noteId,$givenPassword)){
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
                    throw new RuntimeException('Given password does not match the notes password', 1);
                }

            }else{
                $mysqli->close();
                throw new RuntimeException('Given UserId does not match the notes UserId', 2);
            }
        }catch(Exception $e){
            echo json_encode(array(
                'error' => array(
                    'msg' => $e->getMessage(),
                    'code' => $e->getCode(),
                ),
            ));
        }
    }

    function loadNotes(){
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
    }
?>
