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
        url:"../../proccessLogin.php ",
        method:"POST",
        data:{
            idToken: googleUser.getAuthResponse().id_token, // Second add quotes on the value.
        },
        success:function(response) {
            localStorage.setItem('userId', response);
            if(typeof signedIn === "function"){
                signedIn();
            }
        },
        error:function(){
            //TODO: better error message
            alert("error on sign in");
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

function dialogInput(dialogId, message, yesCallback, noCallback, warningMessage = "", title = "Input Dialog" , yesButtonTxt = "Submit", noButtonTxt = "Cancel"){
    $("#" + dialogId).dialog('destroy').remove();
    let validInput = false;

    let dialog = document.createElement("div");
    $(dialog).css("display","none");
    $(dialog).css("align","center");
    $(dialog).attr("id", dialogId);

    let dialogForm = document.createElement("form");
    let dialogLabel = document.createElement("label");
    let dialogInput = document.createElement("input");
    let dialogWarningLabel = document.createElement("label");

    $(dialogInput).attr("type", "text");
    $(dialogInput).attr("name", dialogId + "_input");
    $(dialogInput).attr("id", dialogId + "_input");

    $(dialogInput).keyup(function(){
        if(!$(dialogInput).val().trim()) {
            validInput = false;
            $("#" + dialogId + "_yesButton").button("disable");
        }else{
            validInput = true;
            $("#" + dialogId + "_yesButton").button("enable");
        }
    });

    $(dialogLabel).attr("for",dialogId + "_input");
    $(dialogLabel).text(message);

    if(warningMessage){
        $(dialogWarningLabel).attr("id", dialogId + "_wrongPasswordLabel");
        $(dialogWarningLabel).text(warningMessage);
    }

    $(dialogForm).submit(function(e){
        e.preventDefault();
        if(validInput){
            yesCallback($(dialogInput).val().trim());
            $(dialog).dialog('destroy').remove();
        }
    });
    $(dialogForm).append(dialogLabel);
    $(dialogForm).append(dialogInput);
    $(dialogForm).append(dialogWarningLabel);
    $(dialog).append(dialogForm);

    document.body.appendChild(dialog);
    $(dialog).dialog({
        modal: true,
        title: title,
        buttons: [
            {
                id: dialogId + "_yesButton",
                text: yesButtonTxt,
                disabled: true,
                click: function () {
                    yesCallback($(dialogInput).val().trim());
                    $(this).dialog('destroy').remove();
                }
            },
            {
                id: dialogId + "noButton",
                text: noButtonTxt,
                click: function () {
                    if(noCallback){
                        noCallback($(dialogInput).val().trim());
                    }
                    $(this).dialog('destroy').remove();
                }
            }
        ]
    });
}

function loadNote(noteId, idToken, givenPassword) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "../../notes/getNote.php ",
            method: "POST",
            data: {
                functionName: "loadNote",
                noteId: noteId,
                idToken: idToken,
                givenPassword: givenPassword
            },
            success: function (response) {
                response = JSON.parse(response);
                resolve(response);
            },
            error: function (response) {
                response = JSON.parse(response);
                reject(response);
            }
        });
    });
}

function passwordPrompt(successCallback , passwordRetry = false , noCallback = null){
    if(passwordRetry){
        dialogInput("passwordPrompt", "Password:",
            function(givenInput){
                successCallback(givenInput);
            }, noCallback, "Wrong password, please try again", "Password Prompt");
    }else{
        dialogInput("passwordPrompt", "Password:",
            function(givenInput){
                successCallback(givenInput);
            }, noCallback, null , "Password Prompt");
    }

}

function checkNoteRequiredPassword(noteId , callback){
    return new Promise((resolve, reject) => {
        $.ajax({
            url:"./getNote.php ",
            method:"POST",
            data:{
                functionName: "requiresPassword",
                noteId: noteId,
            },
            success:function(response) {
                response = JSON.parse(response);
                if(response.requiresPassword){
                    resolve(true);
                }else{
                    resolve(false);
                }
            },
            error:function(err){
                reject(err);
            }
        });
    })
}