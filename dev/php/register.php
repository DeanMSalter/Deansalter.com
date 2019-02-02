<?php
// Include config file
require_once "config.php";

// Define variables and initialize with empty values
$username = $password = $confirm_password = "";
$username_err = $password_err = $confirm_password_err = "";

// Processing form data when form is submitted
//$_SERVER is the array of information provided by the web server,
//in this case we are checking what type of request is being made.
if($_SERVER["REQUEST_METHOD"] == "POST"){

    // Validate username
    //if username is blank
    if(empty(trim($_POST["username"]))){
        $username_err = "Please enter a username.";
    } else{
        // Prepare a select statement
        $sql = "SELECT id FROM users WHERE username = ?";

        if($stmt = mysqli_prepare($link, $sql)){
            // Bind variables to the prepared statement as parameters
            //specifes that the given value is the value to be used in the statement
            //the "s" specifies its a string.
            mysqli_stmt_bind_param($stmt, "s", $param_username);

            // Set parameters
            //trim removes any whitespaces from the beginning or end
            $param_username = trim($_POST["username"]);

            // Attempt to execute the prepared statement
            if(mysqli_stmt_execute($stmt)){
                /* store result */
                mysqli_stmt_store_result($stmt);

                //check to see if username is already taken
                if(mysqli_stmt_num_rows($stmt) >= 1){
                    $username_err = "This username is already taken.";
                } else{
                    $username = trim($_POST["username"]);
                }
            } else{
                echo "Oops! Something went wrong. Please try again later.";
            }
        }

        // Close statement
        mysqli_stmt_close($stmt);
    }

    // Validate password
    if(empty(trim($_POST["password"]))){
        $password_err = "Please enter a password.";
    } else{
        $password = trim($_POST["password"]);
    }

    // Validate confirm password
    if(empty(trim($_POST["confirm_password"]))){
        $confirm_password_err = "Please confirm password.";
    } else{
        $confirm_password = trim($_POST["confirm_password"]);
        if(empty($password_err) && ($password != $confirm_password)){
            $confirm_password_err = "Password did not match.";
        }
    }

    // Check input errors before inserting in database
    if(empty($username_err) && empty($password_err) && empty($confirm_password_err)){

        // Prepare an insert statement
        $sql = "INSERT INTO users (username, password) VALUES (?, ?)";

        if($stmt = mysqli_prepare($link, $sql)){
            // Bind variables to the prepared statement as parameters
            mysqli_stmt_bind_param($stmt, "ss", $param_username, $param_password);

            // Set parameters
            $param_username = $username;
            $param_password = password_hash($password, PASSWORD_DEFAULT); // Creates a password hash

            // Attempt to execute the prepared statement
            if(mysqli_stmt_execute($stmt)){
              // Password is correct, so start a new session
              session_start();

              // Store data in session variables
              $_SESSION["loggedin"] = true;
              $_SESSION["id"] = $id;
              $_SESSION["username"] = $username;

              // Redirect user to welcome page
              header("location: welcome.php");
            } else{
                echo "Something went wrong. Please try again later.";
            }
        }

        // Close statement
        mysqli_stmt_close($stmt);
    }

    // Close connection
    mysqli_close($link);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Sign Up</title>
</head>
<body>
        <h2>Sign Up</h2>
        <p>Please fill this form to create an account.</p>
        <!-- form posts all its information to current page as no action is specfied!-->
        <form action="" method="post">
            <!-- checks to see if the username is empty upon creation , if its not then theres an error-->

                <label>Username</label>
                <input type="text" name="username"  >
                <span><?php echo $username_err; ?></span>


                <label>Password</label>
                <input type="password" name="password" >
                <span ><?php echo $password_err; ?></span>


                <label>Confirm Password</label>
                <input type="password" name="confirm_password">
                <span ><?php echo $confirm_password_err; ?></span>

                <input type="submit"  value="Submit">
                <input type="reset"  value="Reset">

            <p>Already have an account? <a href="login.php">Login here</a>.</p>
        </form>
</body>
</html>
