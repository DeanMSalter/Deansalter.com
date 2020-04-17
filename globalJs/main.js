function onSignIn(googleUser) {
    let profile = googleUser.getBasicProfile();
    localStorage.setItem('idToken', googleUser.getAuthResponse().id_token);
    console.log(googleUser.getAuthResponse().id_token);
    // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    // console.log('IDToken: ' + googleUser.getAuthResponse().id_token); // Do not send to your backend! Use an ID token instead.
    //
    // console.log('Name: ' + profile.getName());
    // console.log('Image URL: ' + profile.getImageUrl());
    // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    let signedInProfilePic = $("#signedInProfilePic");
    signedInProfilePic.attr("src",profile.getImageUrl());
    signedInProfilePic.css("height",$("#signInBtn").css("height"));
    signedInProfilePic.css("display","inline-block");
    $("#signInBtn").css("display","none");
    $("#signOutBtn").css("display","inline-block");
    $.ajax({
        url:"../proccessLogin.php ",
        method:"POST",
        data:{
            idToken: googleUser.getAuthResponse().id_token, // Second add quotes on the value.
        },
        success:function(response) {
            localStorage.setItem('userId', response);
            signedIn();
        },
        error:function(){
            //TODO: better error message
            alert("error");
        }

    });
}
function signOut() {
    let signedInProfilePic = $("#signedInProfilePic");
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
        localStorage.removeItem('idToken');
        localStorage.removeItem('userId');
        signedInProfilePic.css("display","none");
        $("#signInBtn").css("display","inline-block");
        $("#signOutBtn").css("display","none");
        signedOut();
    });
}