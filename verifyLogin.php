<?php
include ('main.php');
require_once 'vendor/autoload.php';

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

function validateToken($idToken){
    $CLIENT_ID = "178845838452-48f1cmbdoksqrgsi6djimbqceg2ppqsv.apps.googleusercontent.com";
    // Get $id_token via HTTPS POST.
    $client = new Google_Client(['client_id' => $CLIENT_ID]);  // Specify the CLIENT_ID of the app that accesses the backend
    return $client->verifyIdToken($idToken);
}

$payload = validateToken("$_POST[idToken]");
if ($payload) {
  $userId = $payload['sub'];
  $firstName = $payload['given_name'];
  $lastName = $payload['family_name'];
  $email = $payload['email'];

  $mysqli = mysqliConnect();
  $validUser = findUser($mysqli, $userId);

  if(empty($validUser)){
    insertUser($mysqli, $userId, $firstName, $lastName, $email);
  }
  $mysqli->close();
} else {
    echo "invalid token id";
}
?>
