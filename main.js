const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const randomFixedInteger = function (length) {
  return Math.floor(Math.pow(10, length-1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length-1) - 1));
}

function renderQuote(contents) {
  const contentsObj = JSON.parse(contents);
  $('#quote').innerHTML = contentsObj.quoteText;
  $('#author').innerHTML = contentsObj.quoteAuthor;
}

function getQuote() {
  const key = randomFixedInteger(6);
  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  const url = `http://api.forismatic.com/api/1.0/?method=getQuote&key=${key}&format=json&lang=en`; 
  fetch(proxyurl + url) 
  .then(response => response.text())
  .then(contents => renderQuote(contents))
  .catch(() => console.log("Can’t access " + url + " response"))
}

document.addEventListener("DOMContentLoaded", (event) => {
  getQuote();
});


    
    