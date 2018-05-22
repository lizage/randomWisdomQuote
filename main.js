const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);


// boilerplate for creating DOM elements
function newNode(node, class_arr, id, parent, html) {
    const new_node = document.createElement(node);
    for (let className of class_arr) {
      new_node.classList.add(className);
    }
    new_node.setAttribute('id', id);
    if (parent) {
      parent.appendChild(new_node);
    }
    if (html) {
      new_node.innerHTML = html;
    }
    return new_node;
  }

function buildMandala() {
  const mandala_top_div = newNode('div', ['mandala', 'mandala_top', 'spinner_show']);
  $('.menu_wrapper').insertAdjacentElement('afterend', mandala_top_div);
  for(let i=0; i<7; i++) {
    const m_div = newNode('div', [], '', mandala_top_div);
    for(let j=1; j<4; j++) {
      const m_inner = newNode('div', ['m_inner' + j], '', m_div);
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

// id starts with '_' bc DOM object id can't start with a digit
function getUniqueId(quoteObj) {
  const link_arr = quoteObj.quoteLink.split('/'); 
  return '_' + link_arr[link_arr.length-2];
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
    $('#current_quote > .quote_bground > .quote').innerHTML = response;
    $('#current_quote > .quote_bground > .author').innerHTML = "";
    $('#current_quote > .buttons').style.display = "none";
    $('#current_quote > .quote_bground > .quote').classList.add('errMsg');
  }
  // Response OK case
  else {
    const quoteObj = JSON.parse(response);
    currentQuote = new Quote(quoteObj.quoteText, quoteObj.quoteAuthor, getUniqueId(quoteObj));
    $('#current_quote > .quote_bground > .quote').innerHTML = currentQuote.text;
    $('#current_quote > .quote_bground > .author').innerHTML = currentQuote.author;
    $('#current_quote > .buttons').style.display = "block";
    $('#current_quote > .quote_bground > .quote').classList.remove('errMsg');
  }
}

// bring random quote from API
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
  const title = newNode('div', ['pinned_quotes_title'], '', $('.quotes_wrapper'), 'My saved quotes:');
}

function pinCurrentQuote() {
  // push to array
  pinnedQuotes.push(currentQuote);
  
  // render on screen
  const quote_div = newNode(
    'div', 
    ['single_quote_wrapper', 'pinned_add'], 
    currentQuote.id, 
    '', 
    `<div class="pinned_quote_bground">
        <div class="quote">${currentQuote.text}</div>
        <div class="author">${currentQuote.author}</div>
      </div>
      <div class="buttons pinned_buttons">
        <button id="remove_${currentQuote.id}" class="remove_pin">
          <i class="fas fa-times"></i>
        </button>
        <button>
          <i class="fas fa-share-alt fa-sm"></i>
        </button>
      </div>
      `);
    $('.pinned_quotes_title').insertAdjacentElement('afterend', quote_div); 
}

function setRemoveButton() {
  $('.remove_pin').addEventListener("click", (e) => {
    
    const id = getCurrentId(e);

    // restore pin_quote button
    if(currentQuote.id === id) {
      $('#pin_quote').disabled = false; 
    }
    
    // remove quote object from pinnedQuotes array
    const obj = pinnedQuotes.find(x => x.id === id);
    const index = pinnedQuotes.indexOf(obj);
    pinnedQuotes.splice(index, 1);
    
    // remove card from screen
    classTogglr('#' + id,'pinned_add','pinned_remove');
    setTimeout(() => $('.quotes_wrapper').removeChild($('#' + id)), 350);
    
    //remove title if array is empty
    if(pinnedQuotes.length === 0) {
      setTimeout(() => $('.quotes_wrapper').removeChild($('.pinned_quotes_title')), 300);
    }
  })
}

function getCurrentId(e) {
  let id_arr = e.currentTarget.getAttribute('id').split('_');
  return '_' +  id_arr[id_arr.length-1];
}

function renderPinnedQuotes() {
  if(currentQuote === {}) {
    return;
  }
  else if(pinnedQuotes.length === 0) {
    renderPinnedTitle();
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


    
    