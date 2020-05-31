function onSignIn(googleUser) {
    let profile = googleUser.getBasicProfile();
    localStorage.setItem('idToken', googleUser.getAuthResponse().id_token);
    let signedInProfilePic = $("#signedInProfilePic");
    signedInProfilePic.attr("src",profile.getImageUrl());
    signedInProfilePic.css("height",$("#signInBtn").css("height"));
    signedInProfilePic.css("display","inline-block");
    $("#signInBtn").css("display","none");
    $("#signOutBtn").css("display","inline-block");

    let data = {
        idToken: googleUser.getAuthResponse().id_token,
    };
    ajaxRequest("../../proccessLogin.php ", "POST", data)
        .then(function(response) {
            localStorage.setItem('userId', response);
            if(typeof signedIn === "function"){
                signedIn();
            }
        })
        .catch(function(response) {
            response = JSON.parse(response);
            if(response){
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
                console.log(response);
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

function passwordPrompt(passwordRetry = false){
    return new Promise((resolve, reject) => {
        if (passwordRetry) {
            dialogInput("passwordPrompt", "Password:",
                function (givenInput) {
                    resolve(givenInput);
                },
                function (givenInput){
                    reject(givenInput);
                }, "Wrong password, please try again", "Password Prompt");
        } else {
            dialogInput("passwordPrompt", "Password:",
                function (givenInput) {
                    resolve(givenInput);
                },
                function (givenInput){
                    reject(givenInput);
                }, null, "Password Prompt");
        }
    });
}

function checkNoteRequiredPassword(noteId){
    return new Promise((resolve, reject) => {
        $.ajax({
            url:"../../notes/getNote.php ",
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

function loginToNote(noteId, idToken, passwordRetry = false){
    return new Promise((resolve, reject) => {
        checkNoteRequiredPassword(noteId)
            .then(requiresPassword => {
                if (requiresPassword) {
                    passwordPrompt(passwordRetry)
                        .then(function (givenPassword) {
                            loadNote(noteId, idToken, givenPassword)
                                .then(note => {
                                    resolve(note);
                                })
                                .catch(error => {
                                    reject(error)
                                })
                            })
                        .catch(function(response) {
                            reject(false)
                        })
                } else {
                    loadNote(noteId, idToken)
                        .then(note => {
                            resolve(note)
                            // successCallback(note);
                        })
                        .catch(error => {
                            reject(error);
                        });
                }
            })
            .catch(error => {
                reject(error);
            });
    });
}

function getParams(){
    let params = new URLSearchParams(window.location.search);
    noteId = null;
    idToken = localStorage.getItem('idToken');

    if(params.has("noteId")){
        noteId = params.get("noteId");
    }else{
        alert("No NoteId supplied!")
    }
    return {"noteId": noteId,
            "idToken": idToken};
}

function processNote(noteId, idToken, passwordRetry, processFunction){
    loginToNote(noteId, idToken, passwordRetry)
        .then(function(response){
            processFunction(response, noteId)
        })
        .catch(function(error){
            if(error){
                alert(error);
            }
        });
}

//Util Functions

function ajaxRequest(url , method, data){
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            method: method,
            data: data,
            success: function (response) {
                // console.log(response);
                // console.log(url);
                // console.log(data);
                resolve(response);
            },
            error: function (response) {
                // console.log(response);
                // console.log(url);
                // console.log(data);

                reject(response);
            }
        });
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

