<?php
include ('../main.php');

$aResult = array();
if( !isset($_POST['functionName']) ) { $aResult['error'] = 'No function name!'; }

if( !isset($aResult['error']) ) {
    switch($_POST['functionName']) {
        case 'insertNote':
            insertNote();
            break;
        case 'changeNoteStatus':
            changeNoteStatus();
            break;
        default:
            $aResult['error'] = 'Not found function '.$_POST['functionname'].'!';
            break;
    }

}

function changeNoteStatus(){
    $noteStatus = (string) $_POST['noteStatus'];
    $noteId = (string) $_POST['noteId'];
    $idToken = (string) $_POST['idToken'];
    $givenPassword = isset($_POST['givenPassword']) ? $_POST['givenPassword'] : null;

    try {
        $mysqli = mysqliConnect();
        if (validUserForNote($mysqli, $noteId, $idToken)){
            if(validPassword($mysqli,$noteId, $givenPassword)) {
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
                throw new RuntimeException('Given password does not match the notes password', 1);
            }
        }else{
            $mysqli->close();
            throw new RuntimeException('Given UserId does not match the notes UserId', 2);
        }
    } catch (Exception $e) {
        echo json_encode(array(
            'error' => array(
                'msg' => $e->getMessage(),
                'code' => $e->getCode(),
            ),
        ));
    }
}

function insertNote(){
    $noteTitle = (string) $_POST['noteTitle'];
    $noteContent = (string) $_POST['noteContent'];
    $idToken = isset($_POST['idToken']) ? (string) $_POST['idToken'] : null;
    $noteId = isset($_POST['noteId']) ? (string) $_POST['noteId'] : null;
    $notePassword = isset($_POST['notePassword']) ? (string) $_POST['notePassword'] : null;
    $notePassword = !empty($notePassword) ? (string) $notePassword : null;
    $givenPassword = isset($_POST['givenPassword']) ? $_POST['givenPassword'] : null;


    if($notePassword){
        $notePassword = (string) password_hash($notePassword, PASSWORD_DEFAULT);
    }
    try{
        $mysqli = mysqliConnect();
        if(!empty($noteId)){
            if(validUserForNote($mysqli, $noteId, $idToken)){
                if(validPassword($mysqli,$noteId, $givenPassword)) {
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
                }else {
                    $mysqli->close();
                    throw new RuntimeException('Given password does not match the notes password', 1);
                }
            }else{
                $mysqli->close();
                throw new RuntimeException('Given UserId does not match the notes UserId', 2);
            }
        }
        else{
            $iv = null;
            if(!empty($notePassword)){
                //TODO : make this actually work.
                // This function encrypts the data passed into it and returns the cipher data with the IV embedded within it.
                // The initialization vector (IV) is appended to the cipher data with
                // the use of two colons serve to delimited between the two.
                $ClearTextData = "test tex 123t";
                $ENCRYPTION_KEY = 'password';
                $ENCRYPTION_ALGORITHM = 'AES-256-CBC';
                $EncryptionKey = base64_decode($ENCRYPTION_KEY);
                $InitializationVector  = openssl_random_pseudo_bytes(openssl_cipher_iv_length($ENCRYPTION_ALGORITHM));
                $EncryptedText = openssl_encrypt($ClearTextData, $ENCRYPTION_ALGORITHM, $EncryptionKey, 0, $InitializationVector);
                $CipherData = base64_encode($EncryptedText . '::' . $InitializationVector);
                echo $CipherData;
                echo "\n";

                // This function decrypts the cipher data (with the IV embedded within) passed into it
                // and returns the clear text (unencrypted) data.
                // The initialization vector (IV) is appended to the cipher data by the EncryptThis function (see above).
                // There are two colons that serve to delimited between the cipher data and the IV.
                $EncryptionKey = base64_decode($ENCRYPTION_KEY);
                list($Encrypted_Data, $InitializationVector ) = array_pad(explode('::', base64_decode($CipherData), 2), 2, null);
                echo openssl_decrypt($Encrypted_Data, $ENCRYPTION_ALGORITHM, $EncryptionKey, 0, $InitializationVector);
                return false;
            }

            $insertNoteStmt = $mysqli->prepare("INSERT INTO note (noteTitle, noteContent) VALUES (?,?)");
            $insertNoteStmt->bind_param('ss', $noteTitle, $noteContent);
            $insertNoteStmt->execute();
            $insertNoteStmt->close();
            $noteId = $mysqli->insert_id;

            if(!empty($notePassword)){
                $editNotePasswordStmt = $mysqli->prepare("UPDATE note set notePassword = ? where noteId = ?");
                $editNotePasswordStmt->bind_param('ss', $notePassword, $noteId);
                $editNotePasswordStmt->execute();
                $editNotePasswordStmt->close();

//                $editNoteIvStmt = $mysqli->prepare("UPDATE note set noteIv = ? where noteId = ?");
//                $editNoteIvStmt->bind_param('ss', $iv, $noteId);
//                $editNoteIvStmt->execute();
//                $editNoteIvStmt->close();
            }


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
                            'notePassword' => $notePassword,
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
                        'notePassword' => $notePassword,
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
}
?>
