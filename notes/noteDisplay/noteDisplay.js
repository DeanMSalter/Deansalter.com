$(function () {
    $("#headerContainer").load("../../globalHtml/navBar.html", function () {
        $("#notesNavEntry").prepend($("#navActiveImgTemplate").html())
    });



});
window.onload = function () {
    let params = new URLSearchParams(window.location.search);
    noteId = null;
    idToken = localStorage.getItem('idToken');

    if(params.has("noteId")){
        noteId = params.get("noteId");
    }else{
        alert("No NoteId supplied!")
    }
    loginToNote()
};

function loadNote(noteId, idToken, givenPassword){
    $.ajax({
        url:"../loadNote.php ",
        method:"POST",
        data:{
            noteId: noteId,
            idToken: idToken,
            givenPassword: givenPassword
        },
        success:function(response) {
            response = JSON.parse(response);
            if(response.error){
                dialog("passwordIncorrect", response.error["msg"] ,loginToNote,
                    function(){
                            window.close();
                    }, "Password Incorrect", "Retry", "Cancel", )
                // if(confirm(response.error["msg"])){
                //     loginToNote()
                // }else{
                //     window.close();
                // }
            }else{
                $("#noteTitleArea").html(response.note["noteTitle"]);
                $("#noteContentArea").html(response.note["noteContent"])
            }
        },
        error:function(){
            //TODO: better error message
            alert("error");
        }
    });
}

function loginToNote(){
    $.ajax({
        url:"../requiresPassword.php ",
        method:"POST",
        data:{
            noteId: noteId,
        },
        success:function(response) {
            response = JSON.parse(response);
            if(response.requiresPassword){
                dialogInput("passwordPrompt", "Password:", function(){
                    let givenPassword = $("#passwordPrompt_input").val();
                    if(givenPassword){
                        loadNote(noteId, idToken, givenPassword)
                    }
                },
                function(){
                    window.close();
                }, "Password Prompt");
            }else{
                loadNote(noteId, idToken, null)
            }
        },
        error:function(){
            //TODO: better error message
            alert("error");
        }
    });
}

//
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
        width: 350,
        height: 160,
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
        $(dialog).dialog('close');
        yesCallback();
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