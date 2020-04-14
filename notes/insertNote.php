<?php
include ('../main.php');
$mysqli = mysqliConnect();

$stmt = $mysqli->prepare("INSERT INTO note (noteTitle, noteContent) VALUES (?,?)");
$stmt->bind_param('ss', $noteTitle, $noteContent);
$noteTitle = "$_POST[noteTitle]";
$noteContent = "$_POST[noteContent]";
$stmt->execute();
$stmt->close();
$noteId = $mysqli->insert_id;
$mysqli->close();

//$result = $stmt->get_result();
//$row = $result->fetch_assoc();
//
$idToken = "$_POST[idToken]";
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

    echo "inserting into userNote";
    $stmt2 = $mysqli2->prepare("INSERT INTO userNote (userId, noteId) VALUES (?,?)");
    $stmt2->bind_param('ss', $userId, $noteId);
    $stmt2->execute();
    printf("Error: %s.\n", $stmt2->error);

    $stmt2->close();
} else {
    echo "invalid token id";
}
$mysqli2->close();


?>
