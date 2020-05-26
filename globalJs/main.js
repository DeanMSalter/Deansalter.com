function onSignIn(googleUser) {
    let profile = googleUser.getBasicProfile();
    localStorage.setItem('idToken', googleUser.getAuthResponse().id_token);
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


function dialog(dialogId, message, yesCallback, noCallback, title = "Confirm Dialog" , yesButtonTxt = "Yes", noButtonTxt = "No") {
    $("#" + dialogId).dialog('close');
    let dialog = document.createElement("div");
    $(dialog).css("display","none");
    $(dialog).css("align","center");
    $(dialog).attr("id", dialogId);
    $(dialog).text(message);
    document.body.appendChild(dialog);

    $(dialog).dialog({
        modal: true,
        title: title,
        buttons: [
            {
                id: "yesButton",
                text: yesButtonTxt,
                click: function () {
                    $(this).dialog('close');
                    yesCallback();
                }
            },
            {
                id: "noButton",
                text: noButtonTxt,
                click: function () {
                    $(this).dialog('close');
                    noCallback();
                }
            }
        ]
    });
}

function dialogInput(dialogId, message, yesCallback, noCallback, title = "Confirm Dialog" , yesButtonTxt = "Submit", noButtonTxt = "Cancel"){
    $("#" + dialogId).dialog('close');
    let dialog = document.createElement("div");
    $(dialog).css("display","none");
    $(dialog).css("align","center");
    $(dialog).attr("id", dialogId);

    let dialogForm = document.createElement("form");
    let dialogLabel = document.createElement("label");
    let dialogInput = document.createElement("input");

    $(dialogInput).attr("type", "text");
    $(dialogInput).attr("name", dialogId + "_input");
    $(dialogInput).attr("id", dialogId + "_input");

    $(dialogLabel).attr("for",dialogId + "_input");
    $(dialogLabel).text(message);

    $(dialogForm).submit(function(e){
        e.preventDefault();
        yesCallback();
        $(dialog).dialog('destroy').remove();
    });
    $(dialogForm).append(dialogLabel);
    $(dialogForm).append(dialogInput);
    $(dialog).append(dialogForm);

    document.body.appendChild(dialog);
    $(dialog).dialog({
        modal: true,
        title: title,
        // width: 350,
        // height: 160,
        buttons: [
            {
                id: "yesButton",
                text: yesButtonTxt,
                click: function () {
                    yesCallback();
                    $(this).dialog('destroy').remove();
                }
            },
            {
                id: "noButton",
                text: noButtonTxt,
                click: function () {
                    noCallback();
                    $(this).dialog('destroy').remove();
                }
            }
        ]
    });
}

function loadNote(noteId, idToken, givenPassword, successCallback, errorCallback) {
    $.ajax({
        url:"../../notes/getNote.php ",
        method:"POST",
        data:{
            functionName: "loadNote",
            noteId: noteId,
            idToken: idToken,
            givenPassword: givenPassword
        },
        success:function(response) {
            response = JSON.parse(response);
            successCallback(response);
        },
        error:function(){
            errorCallback();
        }
    });
}

function retryPassword(functionName, noteId, idToken){
    dialog("passwordIncorrect", "Wrong password, do you wish to retry?", function(){ functionName(noteId,idToken)},function(){} , "Password Incorrect", "Retry", "Cancel")

}