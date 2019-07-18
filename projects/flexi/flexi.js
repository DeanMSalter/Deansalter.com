'use strict'

let endTimesFriday = ["12:00","12:15","12:30","12:45","1:00","1:15","1:30","1:45","2:00","2:15","2:30"]
let endTimesWeekdays = ["3:45","4:00","4:15","4:30","4:45","5:00","5:15","5:30","5:45","6:00","6:15"]
let friday = false;
let hourDuration = 8;
let minuteDuration = 45;
$("td").each(function () {
  this.addEventListener("click", function() {
    let times = document.getElementsByTagName("td")
    for (let i = 0; i<times.length; i++) {
      times[i].style.backgroundColor = "transparent"
      times[i].style.color = "white"
    }
    let tagClass = document.getElementsByClassName(this.className)
    for (let i = 0; i<tagClass.length; i++) {
      tagClass[i].style.backgroundColor = "rgb(249, 212, 117)"
      tagClass[i].style.color="black"
    }
  })
})

$("#startTime").on("keyup",function(){
  let time = $(this).val().trim()
  let hour = time.split(':')[0]
  let minute = time.split(':')[1]
  hour =  hour % 12 || 12;
  if(hour && minute){
    let theFutureTime = moment().hour(hour).minute(minute).add(hourDuration,'hours').add(minuteDuration,"minutes").format("HH:mm");
    $("#endTime").val(theFutureTime)
    console.log(theFutureTime)
  }
})
$("#endTime").on("keyup",function(){
  let time = $(this).val().trim()
  let hour = time.split(':')[0]
  let minute = time.split(':')[1]
  hour =  hour % 12 || 12;
  if(hour && minute){
    let theFutureTime = moment().hour(hour).minute(minute).subtract(hourDuration,'hours').subtract(minuteDuration,"minutes").format("hh:mm");
    $("#startTime").val(theFutureTime)
    console.log(theFutureTime)
  }
})

let endTimes;
  $("#fridayToggle").click(function() {
      let iterator = 0
      if(friday){
        friday=false
        $(this).text("Week Days")
        hourDuration = 8
        minuteDuration = 45
        endTimes = endTimesWeekdays
      }else{
        friday=true
        $(this).text("Friday")
        hourDuration = 5
        minuteDuration = 0
        endTimes = endTimesFriday
      }
      $("#endTableBody tr td").each(function() {
        this.textContent = endTimes[iterator]
        iterator++
      });
  })
