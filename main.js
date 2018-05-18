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
    $('#current_buttons').style.display = "none";
    $('.quote').classList.add('errMsg');
    $('.quote').innerHTML = response;
    $('.author').innerHTML = ""; 
  }
  else {
    $('#current_buttons').style.display = "block";
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

function Quote(text,author) {
  this.text = text;
  this.author = author;
}



function renderPinnedTitle() {
  let title = document.createElement('div');
  title.classList.add('pinned_quotes_title');
  title.innerHTML = "My pinned quotes:";
  $('.quotes_wrapper').appendChild(title);
}

function pinCurrentQuote() {
  let p_quote = document.createElement('div');
  $('.pinned_quotes_title').insertAdjacentElement('afterend', p_quote);
  //p_quote = $('.quotes_wrapper').insertAfter(p_quote, $('.pinned_quotes_title'));
  p_quote.classList.add('single_quote_wrapper');
  p_quote.innerHTML = 
    `<div class="pinned_quote_bground">
      <div class="quote">${pinnedQuotes[pinnedQuotes.length-1].text}</div>
      <div class="author">${pinnedQuotes[pinnedQuotes.length-1].author}</div>
    </div>
    <div class="buttons pinned_buttons" id="current_buttons">
      <button><i class="fas fa-times"></i></button>
      <button><i class="fas fa-share-alt fa-sm"></i></button>
    </div>
    `;
  //$('.quotes_wrapper').appendFirstChild(p_quote);
  
}

function renderPinnedQuotes() {
  if(pinnedQuotes.length === 0) {
    return;
  }
  if(pinnedQuotes.length === 1) {
    renderPinnedTitle();
  }
  pinCurrentQuote();
}

function pinQuote() {
  let newQuote = new Quote($('.quote').innerHTML, $('.author').innerHTML);
  pinnedQuotes.push(newQuote);
  renderPinnedQuotes();
}

$('#pin_quote').addEventListener("click", (event) => {
  pinQuote();
})

$('#load_quote').addEventListener("click", (event) => {
  getQuote();
})

document.addEventListener("DOMContentLoaded", (event) => {
  buildMandala();
  //getQuote();
});


    
    