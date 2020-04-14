<?php
include ('main.php');
require_once 'vendor/autoload.php';
$payload = getUserFromTokenId("$_POST[idToken]");
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
