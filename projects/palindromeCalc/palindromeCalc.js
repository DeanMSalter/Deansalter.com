'use strict'
let container = document.getElementById("palindrome-container")
let title = document.getElementById("titleText")
let summary = document.getElementById("summaryText")
let submitButton = document.getElementById("submitButton")
let inputBox = document.getElementById("inputBox")
let result = document.getElementById("resultText")
let reversedOutput = document.getElementById("reversedText")

window.onload = function (){
  let wrapper = document.getElementById("palindrome")
//    container.style.height = wrapper.offsetHeight
  wrapper.style.height = wrapper.offsetHeight
  resizeText(container, summary, 0.04)
  resizeText(container, title, 0.06)
  resizeText(container, reversedOutput, 0.04)
  resizeText(container, result, 0.04)

  inputBox.style.height = container.offsetHeight * 0.1
  inputBox.style.width = container.offsetWidth * 0.4

  submitButton.style.height = container.offsetHeight * 0.1
  submitButton.style.width = container.offsetWidth * 0.2
  resizeText(container, submitButton, 0.04)

  resizeText(container, inputBox, 0.04)
}
window.onresize = function() {
  let wrapper = document.getElementById("palindrome")
//    container.style.height = wrapper.offsetHeight
  wrapper.style.height = wrapper.offsetHeight
  resizeText(container, summary, 0.04)
  resizeText(container, title, 0.06)
  resizeText(container, reversedOutput, 0.04)
  resizeText(container, result, 0.04)

  inputBox.style.height = container.offsetHeight * 0.1
  inputBox.style.width = container.offsetWidth * 0.4

  submitButton.style.height = container.offsetHeight * 0.1
  submitButton.style.width = container.offsetWidth * 0.2
  resizeText(container, submitButton, 0.04)

  resizeText(container, inputBox, 0.04)
  window.location.reload()
}
let input = ''
submitButton.addEventListener('click', function() {
  input = inputBox.value
  calculate(input)
})

inputBox.addEventListener("keyup", function(event) {
  event.preventDefault()
  if (event.keyCode === 13) {
    submitButton.click()
  }
})

function calculate(input) {
  let reversed = ""
  for (let i = input.length - 1; i >= 0; i--) {
    reversed += input[i]
  }
  reversed = reversed.toLowerCase()
  input = input.toLowerCase()
  if (reversed === input) {
    result.innerHTML = input + " is a Palindrome!"
  } else {
    result.innerHTML = input + " is not a Palindrome!"
  }
  reversedOutput.innerHTML = "Reversed = " + reversed
}
function resizeText(parent, element, scale) {
  element.style.fontSize = ((parent.offsetWidth+parent.offsetHeight)/2)*scale
  return element
}
