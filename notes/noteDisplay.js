$(function () {
    $("#headerContainer").load("../globalHtml/navBar.html", function () {
        $("#notesNavEntry").prepend($("#navActiveImgTemplate").html())
    });
});

$(document).ready(function () {
    let params = new URLSearchParams(window.location.search);
    let noteId = null;
    if(params.has("noteId")){
        noteId = params.get("noteId");
    }else{
        alert("No NoteId supplied!")
    }

    $.ajax({
        url:"loadNote.php ",
        method:"POST",
        data:{
            noteId: noteId,
        },
        success:function(response) {
            response = JSON.parse(response);
            $("#noteTitleArea").html(response.noteTitle);
            $("#noteContentArea").html(response.noteContent)
        },
        error:function(){
            //TODO: better error message
            alert("error");
        }
    });
});


