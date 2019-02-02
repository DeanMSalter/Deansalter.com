<?php
// Initialize the session
session_start();

// Check if the user is logged in, if not then redirect him to login page
if(!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true){
    header("location: login.php");
}else{
    header("location: projects.php");
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Welcome</title>
</head>
<body>
      <h1>Hi, <?php echo htmlspecialchars($_SESSION["username"]); ?>. Welcome to our site.</h1>
    <p>
        <a href="reset-password.php">Reset Your Password</a>
        <a href="logout.php">Sign Out of Your Account</a>
    </p>
</body>
</html>
