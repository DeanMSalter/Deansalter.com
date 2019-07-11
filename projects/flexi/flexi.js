'use strict'

$("td").each(function () {

  this.addEventListener("click", function() {
    console.log(this)
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
$(".fridayToggle").each(function () {
  this.addEventListener("click",function() {
    let weekdays = document.getElementById("weekDays")
    let friday = document.getElementById("friday")
    if (weekdays.style.display === "none") {
      weekdays.style.display = "block"
      friday.style.display = "none"
      let fridayToggles = document.getElementsByClassName(this.className)
      for (let i = 0; i<fridayToggles.length; i++) {
        fridayToggles[i].textContent = "Week days"
      }
    } else {
      weekdays.style.display = "none"
      friday.style.display = "block"
      this.textContent = "Friday"
      let fridayToggles = document.getElementsByClassName(this.className)
      for (let i = 0; i<fridayToggles.length; i++) {
        fridayToggles[i].textContent = "Friday"
      }
    }
  })
})
