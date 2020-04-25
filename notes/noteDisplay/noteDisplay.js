$(function () {
    $("#headerContainer").load("../../globalHtml/navBar.html", function () {
        $("#notesNavEntry").prepend($("#navActiveImgTemplate").html())
    });
});

$(document).ready(function () {
    let params = new URLSearchParams(window.location.search);
    let noteId = null;
    let idToken = localStorage.getItem('idToken');

    if(params.has("noteId")){
        noteId = params.get("noteId");
    }else{
        alert("No NoteId supplied!")
    }

    $.ajax({
        url:"../loadNote.php ",
        method:"POST",
        data:{
            noteId: noteId,
            idToken: idToken,
        },
        success:function(response) {
            response = JSON.parse(response);
            if(response.error){
                if(confirm(response.error["msg"])){
                    window.location.href = '../';
                }else{
                    window.location.href = '../';
                }
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
});


