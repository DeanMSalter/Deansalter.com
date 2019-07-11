'use strict'
let table = document.getElementById("mainTable")
let rows = table.querySelectorAll("tbody tr")
let columns = table.querySelectorAll("#weeks th")

for (let r = 0; r <rows.length;r++) {
  for (let c = 0; c<columns.length-1; c++) {
    let cell = document.createElement("td")
    cell.innerHTML='&nbsp'
    cell.addEventListener("click", populateCell(cell, r, c))
    rows[r].appendChild(cell)
  }
}
function populateCell(cell, r, c) {
  createInput(cell)
  attachListeners(cell, r, c)
}
function createInput(cell) {

  if (cell.getElementsByTagName("input")[0]) {
    return
  } //If cell currently has an input box
  //
  let oldValue = ""
  if (cell.innerHTML !== "&nbsp;") { //if cell has a saved value
    oldValue = cell.innerHTML
  }
  cell.innerHTML = '<input type="text" class="cellInputs">'

  //update input box with old value and focus it

  cell.getElementsByTagName("input")[0].value = oldValue
}
function attachListeners(cell, r, c) {
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
    cell.innerHTML=cell.getElementsByTagName("input")[0].value
    cell.addEventListener("click", populateCell(cell, r, c))
  })
  cell.getElementsByTagName("input")[0].addEventListener("keydown", function(e) {
    let newC = c
    let newR = r
    if (e.keyCode === 37) { //Left
      newC = c - 1
    } else if (e.keyCode === 38) { //Up
      newR = r - 1
    } else if (e.keyCode === 39) { //Right
      newC = c + 1
    } else if (e.keyCode === 40) { //Down
      newR = r + 1
    } else {
      return
    }

    populateCell(table.querySelectorAll("tbody tr")[newR].querySelectorAll("td")[newC], newR, newC)
    table.querySelectorAll("tbody tr")[newR].querySelectorAll("td")[newC].getElementsByTagName("input")[0].focus()
  })
}
