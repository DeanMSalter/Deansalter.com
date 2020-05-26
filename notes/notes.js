$(function () {
    $("#headerContainer").load("../globalHtml/navBar.html", function () {
        $("#notesNavEntry").prepend($("#navActiveImgTemplate").html())
    });

    $.getJSON('https://ipapi.co/json/', function(data) {
        console.log(data.ip);
    });
});

$(document).ready(function () {
    resultsTable = $("#noteListTable").DataTable({
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
    });

    CKEDITOR.replace('noteContentArea');
    $("#submitNote").on("click",submitNote);
    $("#newNoteToggle").on("click",toggleNewNote);
    loadNotes()
});

function submitNote(){
    let noteId = $("#noteId").val();
    let noteTitle = $("#noteTitle").val();
    let notePassword = $("#notePassword").val();
    let noteContent = CKEDITOR.instances['noteContentArea'].getData();
    let idToken = localStorage.getItem('idToken');

    $.ajax({
        url:"editNote.php ",
        method:"POST",
        data:{
            functionName: "insertNote",
            noteTitle: noteTitle,
            noteContent: noteContent,
            idToken: idToken,
            noteId: noteId,
            notePassword: notePassword
        },
        success:function(response) {
            console.log(response);
            response = JSON.parse(response);
            if(response.error){
                alert(response.error["msg"])
            }else{
                if(!noteId){
                    clearNoteEntry();
                }
                loadNotes();
            }
        }
    });
}


function removeNoteListeners(){
    $( "input[name^='removeNote_']" ).on("click",function () {
        let selectedRow = $(this).closest("tr");
        let noteId = $(this).attr("name").split("_")[1];

        $.ajax({
            url:"./getNote.php ",
            method:"POST",
            data:{
                functionName: "requiresPassword",
                noteId: noteId,
            },
            success:function(response) {
                console.log(response)
                response = JSON.parse(response);
                if(response.requiresPassword){
                    dialogInput("passwordPrompt", "Password:",
                        function(){
                            let givenPassword = $("#passwordPrompt_input").val();
                            if(givenPassword){
                                removeNote(noteId, selectedRow,givenPassword);
                            }
                        }
                        ,function(){}, "Password Prompt");
                }else{
                    removeNote(noteId, selectedRow);
                }
            },
            error:function(){
                //TODO: better error message
                alert("error");
            }
        });
    });
}

function removeNote(noteId, selectedRow, givenPassword = null){
    $.ajax({
        url:"editNote.php ",
        method:"POST",
        data:{
            functionName: "changeNoteStatus",
            noteId: noteId,
            idToken: localStorage.getItem("idToken"),
            noteStatus: "NOTE_REMOVED",
            givenPassword: givenPassword,
        },
        success:function(response) {
            response = JSON.parse(response);
            console.log(response);
            if(response.error){
                alert(response.error["msg"])
            }else{
                resultsTable.row(selectedRow).remove().draw();
                if(noteId === $("#noteId").val()){
                    clearNoteEntry();
                }
            }
        },
    });
}
function editNoteListeners(){
    $( "input[name^='editNote_']" ).on("click",function () {
        let noteId = $(this).attr("name").split("_")[1];
        let idToken = localStorage.getItem("idToken");
        editNoteCheck(noteId, idToken)
    });
}

function editNoteCheck(noteId, idToken){
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
                dialogInput("passwordPrompt", "Password:",
                    function(){
                        let givenPassword = $("#passwordPrompt_input").val();
                        if(givenPassword){
                            loadNote(noteId, idToken, givenPassword,  function(response){editNote(response, noteId, idToken)})
                        }else{
                            retryPassword(editNoteCheck, noteId, idToken);
                        }
                    }
                    ,function(){}, "Password Prompt");
            }else{
                loadNote(noteId, idToken, null, function(response){editNote(response, noteId, idToken)})
            }
        },
        error:function(){
            //TODO: better error message
            alert("error");
        }
    });
}

function editNote(response, noteId, idToken){
    console.log(response);
    if(response.error){
        retryPassword(editNoteCheck, noteId, idToken);
    }else{
        let note = response.note;
        CKEDITOR.instances['noteContentArea'].setData(note["noteContent"]);
        $("#noteTitle").val(note["noteTitle"]);
        $("#noteId").val(note["noteId"]);
        $("#noteEntry").css("display","block");
        $("#newNoteToggle").attr("value","Hide");
    }
}

function loadNotes(){
    let currentUserId = localStorage.getItem("userId");
    $.ajax({
        url:"getNote.php",
        data:{
            functionName: "loadNotes",
        },
        method:"POST",
        success:function(response) {
            resultsTable.clear();
            let responseParsed = JSON.parse(response);
            for(let row = 0; row<responseParsed.length ; row++) {
                let removeNote = "";
                let editNote = "";
                if(currentUserId === responseParsed[row].userId || !responseParsed[row].userId){
                    removeNote = "<input type=\'button\' name=\'removeNote_" +  responseParsed[row].noteId + "\' value=\'Remove Note\'>";
                    editNote = "<input type=\'button\' name=\'editNote_" +  responseParsed[row].noteId + "\' value=\'Edit Note\'>";
                }
                let noteLink = "<a target=\'_blank\' href=\'./noteDisplay/noteDisplay.html?noteId=" + responseParsed[row].noteId + "\'>" + responseParsed[row].noteId + "</a>";
                let userId = "<input type=\'hidden\' name=\'userId\' value=" +  responseParsed[row].userId +"\'>";
                let owner = (responseParsed[row].firstName ? responseParsed[row].firstName : "") + " " + (responseParsed[row].lastName ? responseParsed[row].lastName : "") + userId;
                let newRow =[
                    noteLink, owner , responseParsed[row].noteStatus,responseParsed[row].noteTitle,responseParsed[row].noteContent,responseParsed[row].noteDate, responseParsed[row].notePassword, removeNote, editNote
                ];
                resultsTable.row.add(newRow)
            }
            resultsTable.draw();
            removeNoteListeners();
            editNoteListeners();
        },
    });
}0

function toggleNewNote(){
    let noteEntry = $("#noteEntry");
    if(noteEntry.css("display") === "none"){
        noteEntry.css("display","block");
        $(this).attr("value","Hide");
    }else{
        $(this).attr("value","New Note");
        noteEntry.css("display","none");
    }
}

function signedOut(){
    loadNotes();
}

function signedIn(){
    loadNotes();
}

function clearNoteEntry(){
    CKEDITOR.instances['noteContentArea'].setData('');
    $("#noteTitle").val("");
    $("#noteId").val("");
}
