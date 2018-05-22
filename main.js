const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

function buildMandala() {
  
  const mandala_top_div = document.createElement('div');
  mandala_top_div.classList.add('mandala');
  mandala_top_div.classList.add('mandala_top');
  mandala_top_div.classList.add('spinner_show');
  $('.menu_wrapper').insertAdjacentElement('afterend', mandala_top_div);
  
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

// generate API key
function randomFixedInteger(length) {
  return 
    Math.floor(Math.pow(10, length-1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length-1) - 1));
}

function classTogglr(target,class1,class2)
{ 
  $(target).classList.toggle(class1);
  $(target).classList.toggle(class2);
}

function toggleWaitingMode() {
  classTogglr('#current_quote','quote_show','quote_hide');
  classTogglr('.mandala_top','spinner_hide','spinner_show');
  
}

function getUniqueId(quoteObj) {
  let link_arr = quoteObj.quoteLink.split('/'); 
  return quoteObj.quoteLink.split('/')[link_arr.length-2];
}

// Quote object constructor
function Quote(text,author,id) {
  this.text = text;
  this.author = author;
  this.id = id;
}

function handleResponse(response) {
  // Error case
  if (response.charAt(0) == "C") {
    $('#current_quote > .buttons').style.display = "none";
    $('#current_quote > .quote_bground > .quote').classList.add('errMsg');
    $('#current_quote > .quote_bground > .quote').innerHTML = response;
    $('#current_quote > .quote_bground > .author').innerHTML = ""; 
  }
  // Response OK case
  else {
    $('#current_quote > .buttons').style.display = "block";
    $('#current_quote > .quote_bground > .quote').classList.remove('errMsg');
    const quoteObj = JSON.parse(response);
    currentQuote = new Quote(quoteObj.quoteText, quoteObj.quoteAuthor, getUniqueId(quoteObj));
    $('#current_quote > .quote_bground > .quote').innerHTML = currentQuote.text;
    $('#current_quote > .quote_bground > .author').innerHTML = currentQuote.author;
  }
}

function getQuote() {
  const key = randomFixedInteger(6);
  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  const url = `http://api.forismatic.com/api/1.0/?method=getQuote&key=${key}&format=json&lang=en`; 
  fetch(proxyurl + url) 
  .then(response => response.text())
  .then(contents => {toggleWaitingMode(); handleResponse(contents);})
  .catch(() => { 
    handleResponse("Can’t access API, please try again");
  })
}

function renderPinnedTitle() {
  let title = document.createElement('div');
  title.classList.add('pinned_quotes_title');
  title.innerHTML = "My saved quotes:";
  $('.quotes_wrapper').appendChild(title);
}

function pinCurrentQuote() {
  pinnedQuotes.push(currentQuote);
  let quote_div = document.createElement('div');
  quote_div.classList.add('single_quote_wrapper');
  quote_div.classList.add('pinned_add');
  quote_div.setAttribute('id', currentQuote.id);
  quote_div.innerHTML = 
    `<div class="pinned_quote_bground">
      <div class="quote">${currentQuote.text}</div>
      <div class="author">${currentQuote.author}</div>
    </div>
    <div class="buttons pinned_buttons">
      <button id="remove_${currentQuote.id}" class="remove_pin"><i class="fas fa-times"></i></button>
      <button><i class="fas fa-share-alt fa-sm"></i></button>
    </div>
    `;
    $('.pinned_quotes_title').insertAdjacentElement('afterend', quote_div); 
}

function setRemoveButton() {

  $('.remove_pin').addEventListener("click", (event) => {
    // get the id of quote to be removed
    let id_arr = event.currentTarget.getAttribute('id').split('_');
    let id = id_arr[id_arr.length-1];

    // restore pin_quote button
    if(currentQuote.id === id) {
      $('#pin_quote').disabled = false; 
    }
    
    // remove quote object from pinnedQuotes array
    let = obj = pinnedQuotes.find(x => x.id === id);
    let index = pinnedQuotes.indexOf(obj);
    pinnedQuotes.splice(index, 1);
    
    // remove card from screen
    let card = document.getElementById(id);
    card.classList.remove('pinned_add');
    card.classList.add('pinned_remove');
    setTimeout(() => $('.quotes_wrapper').removeChild(card), 350);
    
    //remove title if array is empty
    if(pinnedQuotes.length === 0) {
      $('.quotes_wrapper').removeChild($('.pinned_quotes_title'));
    }
  })
}

function renderPinnedQuotes() {
  if(currentQuote === {}) {
    return;
  }
  else if(pinnedQuotes.length === 0) {
    renderPinnedTitle();
  }
  else if(pinnedQuotes[pinnedQuotes.length-1].id === currentQuote.id) {
    return;
  }
  pinCurrentQuote();
  setRemoveButton();
}

function init() {

  buildMandala();
  getQuote();

  $('#load_quote').addEventListener("click", (event) => {
    $('#pin_quote').disabled = false;
    toggleWaitingMode();
    getQuote();
  })
  
  $('#pin_quote').addEventListener("click", (event) => {
    $('#pin_quote').disabled = true;
    renderPinnedQuotes();
  })
}

document.addEventListener("DOMContentLoaded", (event) => {
  init();
});


    
    