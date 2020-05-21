$(function () {
    $("#headerContainer").load("../projectsHTML/projectsNavBar.html");
});

let friday = false;
let hourDuration = 8;
let minuteDuration = 45;

$("#startTime").on("keyup",function(){
    calcStartTime();
})
$("#endTime").on("keyup",function(){
    calcEndTime();
});
$("#fridayToggle").click(function() {
    if(friday){
        friday=false;
        $(this).text("Week Days");
        hourDuration = 8;
        minuteDuration = 45;
    }else{
        friday=true;
        $(this).text("Friday");
        hourDuration = 5;
        minuteDuration = 0;
    }
    calcStartTime();
    calcEndTime();
});

function calcStartTime(){
    let time = $("#startTime").val().trim();
    let hour = time.split(':')[0];
    let minute = time.split(':')[1];
    hour =  hour % 12 || 12;
    if(hour && minute){
        let theFutureTime = moment().hour(hour).minute(minute).add(hourDuration,'hours').add(minuteDuration,"minutes").format("hh:mm");
        $("#endTime").val(theFutureTime)
    }
}

function calcEndTime(){
    let time = $("#endTime").val().trim();
    let hour = time.split(':')[0];
    let minute = time.split(':')[1];
    hour =  hour % 12 || 12;
    if(hour && minute){
        let theFutureTime = moment().hour(hour).minute(minute).subtract(hourDuration,'hours').subtract(minuteDuration,"minutes").format("hh:mm");
        $("#startTime").val(theFutureTime);
    }
}