$(function () {
    $("#headerContainer").load("../globalHtml/navBar.html", function () {
        $("#notesNavEntry").prepend($("#navActiveImgTemplate").html())
    });
});

$(document).ready(function () {
    resultsTable = $('#noteListTable').DataTable({
             "lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, "All"] ]
        });

    CKEDITOR.replace( 'noteContentArea' );
    $("#submitNote").on("click",function () {
        let noteId = $("#noteId").val();
        if(noteId){
            $.ajax({
                url:"editNote.php ",
                method:"POST",
                data:{
                    noteTitle: $("#noteTitle").val(), // Second add quotes on the value.
                    noteContent: CKEDITOR.instances['noteContentArea'].getData(),
                    noteId: noteId,
                    idToken: localStorage.getItem("idToken"),

                },
                success:function(response) {
                    loadNotes();
                },
                error:function(){
                    //TODO: better error message
                    alert("error");
                }
            });
        }else{
            $.ajax({
                url:"insertNote.php ",
                method:"POST",
                data:{
                    noteTitle: $("#noteTitle").val(), // Second add quotes on the value.
                    noteContent: CKEDITOR.instances['noteContentArea'].getData(),
                    idToken: localStorage.getItem('idToken')
                },
                success:function(response) {
                    CKEDITOR.instances['noteContentArea'].setData('');
                    $("#noteTitle").val("");
                    loadNotes();
                },
                error:function(){
                    //TODO: better error message
                    alert("error");
                }

            });
        }
    });
    $("#newNoteToggle").on("click",function () {
        let noteEntry = $("#noteEntry")

        if(noteEntry.css("display") === "none"){
            noteEntry.css("display","block");
            $(this).attr("value","Hide");
        }else{
            $(this).attr("value","New Note");
            noteEntry.css("display","none");
        }
    });
    loadNotes()
});

function loadNotes(){
    $.ajax({
        url:"loadNotes.php ",
        method:"GET",

        success:function(response) {
            resultsTable.clear();
            let responseParsed = JSON.parse(response);
            for(let row = 0; row<responseParsed.length ; row++) {
                let removeNote = "";
                let editNote = "";
                if(localStorage.getItem("userId") === responseParsed[row].userId || !responseParsed[row].userId){
                    removeNote = "<input type=\'button\' name=\'removeNote_" +  responseParsed[row].noteId + "\' value=\'Remove Note\'>";
                    editNote = "<input type=\'button\' name=\'editNote_" +  responseParsed[row].noteId + "\' value=\'Edit Note\'>";
                }
                let noteLink = "<a href=\'./noteDisplay.html?noteId=" + responseParsed[row].noteId + "\'>" + responseParsed[row].noteId + "</a>";
                let userId = "<input type=\'hidden\' name=\'userId\' value=" +  responseParsed[row].userId +"\'>";
                let owner = (responseParsed[row].firstName ? responseParsed[row].firstName : "") + " " + (responseParsed[row].lastName ? responseParsed[row].lastName : "") + userId;
                let newRow =[
                    noteLink, owner , responseParsed[row].noteStatus,responseParsed[row].noteTitle,responseParsed[row].noteContent,responseParsed[row].noteDate,removeNote, editNote
                ];
                resultsTable.row.add(newRow)
            }
            resultsTable.draw();
            $( "input[name^='removeNote_']" ).on("click",function () {
                let selectedRow = $(this).closest("tr")
                let noteId = $(this).attr("name").split("_")[1]
                $.ajax({
                    url:"changeNoteStatus.php ",
                    method:"POST",
                    data:{
                        noteId: noteId,
                        idToken: localStorage.getItem("idToken"),
                        noteStatus: "NOTE_REMOVED",
                    },
                    success:function(response) {
                        response = JSON.parse(response);
                        if(response.error){
                            alert(response.error["msg"])
                        }else{
                            resultsTable.row(selectedRow).remove().draw();
                        }
                    },
                    error:function(){
                        //TODO: better error message
                        alert("error");
                    }

                });
            })
            $( "input[name^='editNote_']" ).on("click",function () {
                let noteId = $(this).attr("name").split("_")[1];
                $.ajax({
                    url:"loadNote.php ",
                    method:"POST",
                    data:{
                        noteId: noteId,
                        idToken: localStorage.getItem("idToken"),
                    },
                    success:function(response) {
                        response = JSON.parse(response);
                        console.log(response);
                        if(response.error){
                            alert(response.error["msg"])
                        }else{
                            let note = response.note;
                            CKEDITOR.instances['noteContentArea'].setData(note["noteContent"]);
                            $("#noteTitle").val(note["noteTitle"]);
                            $("#noteId").val(note["noteId"]);
                            let noteEntry = $("#noteEntry");
                            noteEntry.css("display","block");
                            $("#newNoteToggle").attr("value","Hide");
                        }

                    },
                    error:function(){
                        //TODO: better error message
                        alert("error");
                    }
                });
            })

        },
        error:function(){
            //TODO: better error message
            alert("error");
        }

    });
}

function signedOut(){
    loadNotes();
}
function signedIn(){
    loadNotes();
}