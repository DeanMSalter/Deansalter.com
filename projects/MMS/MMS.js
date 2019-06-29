'use strict'
let table = document.getElementById("mainTable")
let rows = table.querySelectorAll("tbody tr")
let columns = table.querySelectorAll("#weeks th")

for (let row of rows) {
  for (let o = 0; o<columns.length-1; o++) {
    let cell = document.createElement("td")
    cell.innerHTML='&nbsp'


    cell.addEventListener("click", function() {
      if (cell.getElementsByTagName("input")[0]) { return } //If cell currently has an input box
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
        if (e.keyCode === 13) {
          cell.innerHTML=cell.getElementsByTagName("input")[0].value
          e.preventDefault()
          return true
        }
      })
      cell.getElementsByTagName("input")[0].addEventListener("input", function(e) {
        console.log(e)
        let cellValue = cell.getElementsByTagName("input")[0].value
        if (e.data === "." && (cellValue.split('.').length-1 > 1 || cellValue === ".")) {
          console.log("stop")
          cell.getElementsByTagName("input")[0].value = (cellValue).substring(0, cellValue.length - e.data.length)
        }
        if (isNaN(e.data) && e.data !==".") {
          console.log("Stop")
          cell.getElementsByTagName("input")[0].value = (cellValue).substring(0, cellValue.length - e.data.length)
        }

        //store value inputted into the actual cell
      })
      cell.getElementsByTagName("input")[0].addEventListener("paste", function(e) {
   //      clipboardData = e.clipboardData || window.clipboardData;
   // pastedData = clipboardData.getData('Text');

        let cellValue = cell.getElementsByTagName("input")[0].value
        if (cellValue !== "") {
          e.preventDefault()
          return false
        }
        if (e.clipboardData.getData('text') === "." && (cellValue.split('.').length-1 > 1 || cellValue === ".")) {
          e.preventDefault()
          return false
        }
        if (isNaN(e.clipboardData.getData('text')) && e.clipboardData.getData('text') !==".") {
          e.preventDefault()
          return false
        }

        //store value inputted into the actual cell
      })
      cell.getElementsByTagName("input")[0].addEventListener("focusout", function() {
        console.log(document.activeElement)
        cell.innerHTML=cell.getElementsByTagName("input")[0].value
      })
    })


    row.appendChild(cell)
  }
}
