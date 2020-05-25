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
        url:"../getNote.php ",
        method:"POST",
        data:{
            functionName: "loadNote",
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
        url:"../getNote.php ",
        method:"POST",
        data:{
            functionName: "requiresPassword",
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
