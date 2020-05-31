$(function () {
    $("#headerContainer").load("../../globalHtml/navBar.html", function () {
        $("#notesNavEntry").prepend($("#navActiveImgTemplate").html())
    });
});
window.onload = function () {
    let params = getParams();
    noteId = params.noteId;
    idToken = params.idToken;
    displayNoteOrClose();
};

function displayNote(response){
    if(response.error){
        if(response.error["code"] === 1){
           displayNoteOrClose(true);
        }else{
            alert(response.error["message"]);
        }
    }else if(response.note){
        $("#noteTitleArea").html(response.note["noteTitle"]);
        $("#noteContentArea").html(response.note["noteContent"])
    }else{
        alert(response);
    }
}

function displayNoteOrClose(passwordRetry = false){
    loginToNote(noteId, idToken,  passwordRetry)
        .then(function (note) {
            displayNote(note)
        })
        .catch(function (error){
            if(!error){
                window.close();
            }else{
                alert(error);
            }
        });
}