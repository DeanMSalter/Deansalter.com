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
                for(let row = 0; row<responseParsed.length ; row++) {
                    let noteLink = "<a href=\'./noteDisplay.html?noteId=" + responseParsed[row][0] + "\'>" + responseParsed[row][0] + "</a>";
                    let removeNote = "<input type=\'button\' name=\'removeNote_" +  responseParsed[row][0] + "\' value=\'Remove Note\'>";
                    let editNote = "<input type=\'button\' name=\'editNote_" +  responseParsed[row][0] + "\' value=\'Edit Note\'>";
                    let newRow =[
                        noteLink,responseParsed[row][1],responseParsed[row][2],responseParsed[row][3],responseParsed[row][4],removeNote, editNote
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
            $.ajax({
                url:"insertNote.php ",
                method:"POST",
                data:{
                    noteTitle: $("#noteTitle").val(), // Second add quotes on the value.
                    noteContent: CKEDITOR.instances['noteContentArea'].getData(),
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


