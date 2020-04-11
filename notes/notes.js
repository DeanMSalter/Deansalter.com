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
                    let newRow =[
                        noteLink,responseParsed[row][1],responseParsed[row][2],responseParsed[row][3],responseParsed[row][4],removeNote
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
            },
            error:function(){
                //TODO: better error message
                alert("error");
            }

        });
    }

    CKEDITOR.replace( 'noteContentArea' );
    $("#submitNote").on("click",function () {
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


