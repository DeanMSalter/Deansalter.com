$(function () {
    $("#headerContainer").load("../globalHtml/navBar.html", function () {
        $("#notesNavEntry").prepend($("#navActiveImgTemplate").html())
    });
});

$(document).ready(function () {
    let resultsTable;
    $(document).ready(function () {
        resultsTable = $('#noteListTable').DataTable({
             "lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, "All"] ]
        });
    });
    function loadNotes(){
        $.ajax({
            url:"loadNotes.php ",
            method:"GET",

            success:function(response) {
                resultsTable.clear();
                let responseParsed = JSON.parse(response);
                console.log(responseParsed[0]);
                for(let row = 0; row<responseParsed.length ; row++) {
                    console.log(responseParsed[row]);
                    let noteLink = "<a href=\'./noteDisplay.html?noteId=" + responseParsed[row].noteId + "\'>" + responseParsed[row].noteId + "</a>";
                    let removeNote = "<input type=\'button\' name=\'removeNote_" +  responseParsed[row].noteId + "\' value=\'Remove Note\'>";
                    let editNote = "<input type=\'button\' name=\'editNote_" +  responseParsed[row].noteId + "\' value=\'Edit Note\'>";
                    let newRow =[
                        noteLink,responseParsed[row].firstName + " " + responseParsed[row].lastName, responseParsed[row].noteStatus,responseParsed[row].noteTitle,responseParsed[row].noteContent,responseParsed[row].noteDate,removeNote, editNote
                    ];
                    resultsTable.row.add(newRow)
                }
                resultsTable.draw();
                $( "input[name^='removeNote_']" ).on("click",function () {
                    let selectedRow = $(this).closest("tr")
                    let noteId = $(this).attr("name").split("_")[1]
                    console.log(noteId)
                    $.ajax({
                        url:"changeNoteStatus.php ",
                        method:"POST",
                        data:{
                            noteId: noteId,
                            noteStatus: "NOTE_REMOVED",
                        },
                        success:function(response) {
                            resultsTable.row(selectedRow).remove().draw();
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
                        },
                        success:function(response) {
                            response = JSON.parse(response);
                            CKEDITOR.instances['noteContentArea'].setData(response.noteContent);
                            $("#noteTitle").val(response.noteTitle);
                            $("#noteId").val(noteId);
                            let noteEntry = $("#noteEntry")
                            noteEntry.css("display","block");
                            $("#newNoteToggle").attr("value","Hide");
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
            console.log(localStorage.getItem('idToken'));
            $.ajax({
                url:"insertNote.php ",
                method:"POST",
                data:{
                    noteTitle: $("#noteTitle").val(), // Second add quotes on the value.
                    noteContent: CKEDITOR.instances['noteContentArea'].getData(),
                    idToken: localStorage.getItem('idToken')
                },
                success:function(response) {
                    console.log(response);
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
