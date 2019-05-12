'use strict' // eslint-disable-line
import {
  element, resizeText
} from './util.js'; // eslint-disable-line

export class PalindromeCalc extends HTMLElement { // eslint-disable-line
  constructor() {
    super()

    const shadow = this.attachShadow({
      mode: 'open'
    })
    element(shadow, 'link', {
      rel: 'stylesheet',
      type: "text/css",
      href: './palindromeCalc/palindrome.css'
    })
    console.log(window.location.pathname)

    const container = element(shadow, "div", {
      id: "palindrome-container"
    })

    let submitButton = element(container, "button", {
      id: "submitButton"
    })
    let inputBox = element(container, "input", {
      id: "inputBox"
    })
    let title = element(container, "h1", {
      id: "titleText"
    })
    let result = element(container, "h2", {
      id: "resultText"
    })
    let reversedOutput = element(container, "h2", {
      id: "reversedText"
    })
    let summary = element(container, "h3", {
      id: "summaryText"
    })

    title.textContent = "Palindrome calculator"
    submitButton.textContent = "Submit"
    summary.textContent= "Welcome to my palindrome calculator.\nThis is just a simple application to test if a given string is a palindrome.\nIt was created so I could familarise myself with using grid layouts and web components "


    window.onload = function() {
      resizeText(container, summary, 0.04)
      resizeText(container, title, 0.06)
      resizeText(container, reversedOutput, 0.04)
      resizeText(container, result, 0.04)

      inputBox.style.height = container.offsetHeight*0.1
      inputBox.style.width = container.offsetWidth*0.4

      submitButton.style.height = container.offsetHeight*0.1
      submitButton.style.width = container.offsetWidth*0.2
      resizeText(container, submitButton, 0.04)

      resizeText(container, inputBox, 0.04)
    }
    window.onresize = function() {
      console.log(container.offsetWidth)
      resizeText(container, summary, 0.04)
      resizeText(container, title, 0.06)
      resizeText(container, reversedOutput, 0.04)
      resizeText(container, result, 0.04)

      inputBox.style.height = container.offsetHeight*0.1
      inputBox.style.width = container.offsetWidth*0.4

      submitButton.style.height = container.offsetHeight*0.1
      submitButton.style.width = container.offsetWidth*0.2
      resizeText(container, submitButton, 0.04)

      resizeText(container, inputBox, 0.04)
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
  }
}
customElements.define('palindrome-calc', PalindromeCalc) // eslint-disable-line
