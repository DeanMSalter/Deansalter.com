<?php
ini_set('display_errors', 1);
error_reporting(-1);
require_once 'vendor/autoload.php';

function mysqliConnect(){
    $mysqli = mysqli_connect("localhost","root","root","website");
    if ($mysqli->connect_error) {
        die("Connection failed: " . $mysqli->connect_error);
    }
    return $mysqli;
}

function insertUser($mysqli, $userId, $firstName, $lastName, $email){
    $insertUserStmt = $mysqli->prepare("INSERT INTO user (userId, firstName, lastName, email) VALUES (?,?,?,?)");
    $insertUserStmt->bind_param('ssss', $userId, $firstName, $lastName, $email);
    $insertUserStmt->execute();
    printf("Error: %s.\n", $insertUserStmt->error);
    $insertUserStmt->close();
}

function findUser($mysqli, $userId){
    $validUserStmt = $mysqli->prepare("select * from user where userId = ?");
    $validUserStmt->bind_param("s", $userId);
    $validUserStmt->execute();
    $result = $validUserStmt->get_result();
    return $result->fetch_assoc();
}

function getUserFromTokenId($idToken){
    $CLIENT_ID = "178845838452-48f1cmbdoksqrgsi6djimbqceg2ppqsv.apps.googleusercontent.com";
    // Get $id_token via HTTPS POST.
    $client = new Google_Client(['client_id' => $CLIENT_ID]);  // Specify the CLIENT_ID of the app that accesses the backend
    return $client->verifyIdToken($idToken);
}

function getUserIdOfNote($mysqli, $noteId){
    $noteUserStmt = $mysqli->prepare("select userId from userNote where noteId = ?");
    $noteUserStmt->bind_param("s", $noteId);
    $noteUserStmt->execute();

    $result = $noteUserStmt->get_result();
    $user = $result->fetch_array(MYSQLI_ASSOC);
    $result->close();
    $noteUserStmt->close();
    return $user['userId'];
}

function validUserForNote($mysqli, $noteId, $idToken){
    $noteUserId = getUserIdOfNote($mysqli, $noteId);
    $currentUser = getUserFromTokenId($idToken);

    if ($noteUserId === $currentUser['sub']) {
        return true;
    }else{
        return false;
    }
}


?>
