$(function () {
    $("#headerContainer").load("../globalHtml/navBar.html", function () {
        $("#notesNavEntry").prepend($("#navActiveImgTemplate").html())
    });
});

let idToken = localStorage.getItem("idToken");
let resultsTable;
$(document).ready(function () {
    resultsTable = $("#noteListTable").DataTable({
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
    });
    CKEDITOR.replace('noteContentArea');

    $("#submitNote").on("click",submitNote);
    $("#newNoteToggle").on("click",toggleNewNote);
    loadNotes()
});

function loadNotes(){
    let currentUserId = localStorage.getItem("userId");
    idToken = localStorage.getItem("idToken");
    $.ajax({
        url:"getNote.php",
        data:{
            functionName: "loadNotes",
        },
        method:"POST",
        success:function(response) {
            resultsTable.clear();
            response = JSON.parse(response);
            for(let row = 0; row<response.length ; row++) {
                let noteId =  response[row].noteId;
                let userId = response[row].userId;
                let firstName = response[row].firstName;
                let lastName = response[row].lastName;

                let noteLink = "<a target=\'_blank\' href=\'./noteDisplay/noteDisplay.html?noteId=" + noteId + "\'>" + noteId + "</a>";

                let noteUserId = "<input type=\'hidden\' name=\'userId\' value=" +  userId +"\'>";
                let owner = (firstName ? firstName : "") + " " + (lastName ? lastName : "") + noteUserId;

                let removeNote = (currentUserId === userId || !userId) ? "<input type=\'button\' name=\'removeNote_" +  noteId + "\' onclick=\'removeNoteBtn(this)\' value=\'Remove Note\'>" : "";
                let editNote = (currentUserId === userId || !userId) ? "<input type=\'button\' name=\'editNote_" +  noteId + "\' onclick=\'editNoteBtn(this)\' value=\'Edit Note\'>" : "";

                let newRow =[
                    noteLink, owner , response[row].noteStatus,response[row].noteTitle,response[row].noteContent,response[row].noteDate, response[row].notePassword, removeNote, editNote
                ];
                resultsTable.row.add(newRow).node().id = noteId;
            }
            resultsTable.draw();
        },
    });
}

function removeNoteBtn(btn){
    let noteId = $(btn).closest("tr").attr("id");
    processNote(noteId, idToken, false, removeNote)
}

function removeNote(response, noteId) {
    if(response.error) {
        if (response.error["code"] === 1) {
            processNote(noteId, idToken, true, removeNote)
        } else {
            console.log(response);
            alert(response.error["message"]);
        }
    }
    else if(response.note){
        let givenPassword = response.note["givenPassword"];
        let data = {
            functionName: "changeNoteStatus",
            noteId: noteId,
            idToken: idToken,
            noteStatus: "NOTE_REMOVED",
            givenPassword: givenPassword
        };
        ajaxRequest("editNote.php" , "POST", data)
            .then(function(response){
                response = JSON.parse(response);
                let selectedRow = $("#" + noteId);
                resultsTable.row(selectedRow).remove().draw();
                if(noteId === $("#noteId").val()){
                    clearNoteEntry();
                }
            })
            .catch(function(response){
                response = JSON.parse(response);
                if(response){
                    alert("error in removing note");
                }
            })
    }
}

function editNoteBtn(btn){
    let noteId = $(btn).attr("name").split("_")[1];
    processNote(noteId, idToken, false, editNote);
}

function editNote(response, noteId){
    console.log(response);
    if(response.error){
        if(response.error["code"] === 1){
            processNote(noteId, idToken, true, editNote);
        }else{
            alert(response.error["message"]);
        }
    }else{
        let note = response.note;
        CKEDITOR.instances['noteContentArea'].setData(note["noteContent"]);
        $("#noteTitle").val(note["noteTitle"]);
        $("#noteId").val(note["noteId"]);
        $("#noteEntry").css("display","block");
        $("#newNoteToggle").attr("value","Hide");
    }
}

function submitNote(){
    let noteId = $("#noteId").val();
    let noteTitle = $("#noteTitle").val();
    let notePassword = $("#notePassword").val();
    let noteContent = CKEDITOR.instances['noteContentArea'].getData();
    let data = {
        functionName: "insertNote",
        noteTitle: noteTitle,
        noteContent: noteContent,
        idToken: idToken,
        noteId: noteId,
        notePassword: notePassword
    };

    ajaxRequest("editNote.php" , "POST", data)
        .then(function(response){
            console.log(response);
            // response = JSON.parse(response);
            // if(response.error){
            //     alert(response.error["msg"])
            // }else{
            //     if(!noteId){
            //         clearNoteEntry();
            //     }
            //     loadNotes();
            // }
        })
        .catch(function(response){
            console.log(response);
            // response = JSON.parse(response);
            // if(response){
            //     console.log(response);
            // }
        });
}



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
