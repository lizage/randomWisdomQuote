const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

function buildMandala() {
  
  let mandala_top_div = document.createElement('div');
  mandala_top_div.classList.add('mandala_top');
  mandala_top_div.classList.add('spinner_hide');
  $('.quotes_wrapper').appendChild(mandala_top_div);
  
  for(let i=0; i<7; i++) {
    let m_div = document.createElement('div'); 
    mandala_top_div.appendChild(m_div);
    
    for(let j=1; j<4; j++) {
      let m_inner = document.createElement('div');
      m_inner.classList.add('m_inner' + j);
      m_div.appendChild(m_inner);
    }
  }
}

function toggleSpinner() {
  classTogglr('.single_quote_wrapper','quote_show','quote_hide');
  classTogglr('.mandala_top','spinner_hide','spinner_show');
  
}

function randomFixedInteger(length) {
  return 
    Math.floor(Math.pow(10, length-1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length-1) - 1));
}

function classTogglr(target,class1,class2)
{ 
  $(target).classList.toggle(class1);
  $(target).classList.toggle(class2);
}

function renderQuote(response) {
  if (response.charAt(0) == "C") {
    $('.quote').classList.add('errMsg');
    $('.quote').innerHTML = response;
    $('.author').innerHTML = ""; 
  }
  else {
    $('.quote').classList.remove('errMsg');
    const contentsObj = JSON.parse(response);
    $('.quote').innerHTML = contentsObj.quoteText;
    $('.author').innerHTML = contentsObj.quoteAuthor;
  }
}

function getQuote() {
  const key = randomFixedInteger(6);
  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  const url = `http://api.forismatic.com/api/1.0/?method=getQuote&key=${key}&format=json&lang=en`; 
  toggleSpinner();
  fetch(proxyurl + url) 
  .then(response => response.text())
  .then(contents => {toggleSpinner(); renderQuote(contents);})
  .catch(() => { 
    renderQuote("Can’t access API, please try again later");
  })
}

$('#reload_button').addEventListener("click", (event) => {
  getQuote();
})

document.addEventListener("DOMContentLoaded", (event) => {
  buildMandala();
  //getQuote();
});


    
    