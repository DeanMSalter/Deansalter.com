'use strict'
let table = document.getElementById("mainTable")
let rows = table.querySelectorAll("tbody tr")
let columns = table.querySelectorAll("#weeks th")

for (let row of rows) {
  for (let o = 0; o<columns.length-1; o++) {
    let cell = document.createElement("td")
    cell.innerHTML='&nbsp'


    cell.addEventListener("click", function() {
      if (cell.innerHTML === '<input type="number" class="cellInputs">') { return } //If cell currently has an input box

      //
      let oldValue = ""
      if (cell.innerHTML !== "&nbsp;") { //if cell has a saved value
        oldValue = cell.innerHTML
      }
      cell.innerHTML = '<input type="text" class="cellInputs">'

      //update input box with old value and focus it
      cell.getElementsByTagName("input")[0].focus()
      cell.getElementsByTagName("input")[0].value = oldValue


      cell.getElementsByTagName("input")[0].addEventListener("keypress", function(e) {
        if(e.key === "." && (cell.getElementsByTagName("input")[0].value.includes(".") || cell.getElementsByTagName("input")[0].value === "" )) {
          e.preventDefault()
          return false
        }
        if (isNaN(e.key) && e.key !==".") {
          console.log(cell.getElementsByTagName("input")[0].value.includes("."))
          e.preventDefault()
          return false
        }
        if (e.keyCode === 13) {
          cell.innerHTML=cell.getElementsByTagName("input")[0].value
        }
        //store value inputted into the actual cell
      })
      cell.getElementsByTagName("input")[0].addEventListener("focusout", function() {
        cell.innerHTML=cell.getElementsByTagName("input")[0].value
      })
    })


    row.appendChild(cell)
  }
}
