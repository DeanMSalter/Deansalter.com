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
                        loadNote(noteId, idToken, givenPassword , displayNote)
                    }
                },
                function(){
                    window.close();
                }, "Password Prompt");
            }else{
                loadNote(noteId, idToken, null, displayNote)
            }
        },
        error:function(){
            //TODO: better error message
            alert("error");
        }
    });
}

function displayNote(response){
    if(response.error){
        dialog("passwordIncorrect", response.error["msg"] ,loginToNote,
            function(){
                window.close();
            }, "Password Incorrect", "Retry", "Cancel", )
    }else{
        $("#noteTitleArea").html(response.note["noteTitle"]);
        $("#noteContentArea").html(response.note["noteContent"])
    }
}