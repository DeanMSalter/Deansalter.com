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

    $.ajax({
        url:"loadNotes.php ",
        method:"GET",
        success:function(response) {
            resultsTable.clear();
            let responseParsed = JSON.parse(response);
            for(let row = 0; row<responseParsed.length ; row++) {
                resultsTable.row.add(responseParsed[row])
            }
            resultsTable.draw()
        },
        error:function(){
            //TODO: better error message
            alert("error");
        }

    });

    CKEDITOR.replace( 'noteContentArea' );
    $("#submitNote").on("click",function () {
        $.ajax({
            url:"insertNote.php ",
            method:"POST",
            data:{
                noteSummary: $("#noteSummary").val(), // Second add quotes on the value.
                noteContent: CKEDITOR.instances['noteContentArea'].getData(),
            },
            success:function(response) {
                console.log("success" + response)
            },
            error:function(){
                //TODO: better error message
                alert("error");
            }

        });
    });
});


