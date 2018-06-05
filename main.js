let currentQuote = {};
let pinnedQuotes = [];

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
  
function buildSpinner() {
  const spinner = newNode('div', ['spinner', 'spinner_show'], '', $('.current_quote'));
  for(let i=0; i<7; i++) {
    const empty_div = newNode('div', [], '', spinner);
    const another_empty_div = newNode('div', [], '', empty_div);
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

// generate API key
function randomFixedInteger(length) {
  return 
    Math.floor(Math.pow(10, length-1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length-1) - 1));
}

function toggleWaitingMode() {
  classTogglr('.quote_wrapper','quote_show','quote_hide');
  classTogglr('.spinner','spinner_hide','spinner_show');
  $('.pin').disabled = ($('.pin').disabled === false) ? true : false;
  $('.share').disabled = ($('.share').disabled === false) ? true : false;
}

function classTogglr(target,class1,class2)
{ 
  $(target).classList.toggle(class1);
  $(target).classList.toggle(class2);
}

function handleResponse(response) {
  // Error case
  if (response.charAt(0) == "C") {
    $('.current_quote > div > .quote').innerHTML = response;
    $('.current_quote > div > .author').innerHTML = ""; 
    $('.current_quote').classList.add('errMsg');
    hideButtonsOnError(false);
  }
  // Response OK case
  else {
    const quoteObj = JSON.parse(response);
    currentQuote = new Quote(quoteObj.quoteText, quoteObj.quoteAuthor, getUniqueId(quoteObj));
    $('.current_quote > div > .quote').innerHTML = currentQuote.text;
    $('.current_quote > div > .author').innerHTML = currentQuote.author;
    $('.current_quote').classList.remove('errMsg');
    hideButtonsOnError(true);
    renderCurrentSharing();
  }
}

// another boilerplate
function hideButtonsOnError(isOK) {
  if (isOK) {
    $('.menu > .theme').style.visibility = "visible";
    $('.menu > .pin').style.visibility = "visible";
    $('.menu > .share').style.visibility = "visible";
  }
  else
  {
    $('.menu > .theme').style.visibility = "hidden";
    $('.menu > .pin').style.visibility = "hidden";
    $('.menu > .share').style.visibility = "hidden";
  }
}

// Quote object constructor
function Quote(text,author,id) {
  this.text = text;
  this.author = author;
  this.id = id;
}

// id starts with '_' bc DOM object id can't start with a digit
function getUniqueId(quoteObj) {
  const link_arr = quoteObj.quoteLink.split('/'); 
  return '_' + link_arr[link_arr.length-2];
}

function renderCurrentSharing() {
  let share_button = newNode(
    'button', 
    ['share'], 
    '', 
    $('.menu'), 
    `<i class="fas fa-share-alt fa-sm"></i>`
  );
  $('.share').parentNode.replaceChild(share_button, $('.share'));
  $('.share').addEventListener("click", (e) => {
    let quote = currentQuote.text;
    let author = currentQuote.author;
    showSocial(quote, author);
  }) 
}

function showSocial(quote, author) {  // to do later: remove boilerplate
  classTogglr('.share_options','share_hide','share_show'); 

  let share_mail = newNode(
    'button', 
    ['share_mail'], 
    '', 
    $('.share_options div'), 
    `<i class="far fa-envelope fa-2x"></i>`
  );
  $('.share_mail').parentNode.replaceChild(share_mail, $('.share_mail'));
  $('.share_mail').addEventListener("click", (e) => {
    return; // todo later
  });

  let share_wh = newNode(
    'button', 
    ['share_wh'], 
    '', 
    $('.share_options div'), 
    `<i class="fab fa-whatsapp fa-2x"></i>`
  );
  $('.share_wh').parentNode.replaceChild(share_mail, $('.share_wh'));
  $('.share_wh').addEventListener("click", (e) => {
    return; // todo later
  });

  let share_fb = newNode(
    'button', 
    ['share_fb'], 
    '', 
    $('.share_options div'), 
    `<i class="fab fa-facebook-f fa-2x"></i>`
  );
  $('.share_fb').parentNode.replaceChild(share_mail, $('.share_fb'));
  $('.share_fb').addEventListener("click", (e) => {
    return; // todo later
  });

  let share_tw = newNode(
    'button', 
    ['share_tw'], 
    '', 
    $('.share_options div'), 
    `<i class="fab fa-twitter fa-2x"></i>`
  );
  $('.share_tw').parentNode.replaceChild(share_mail, $('.share_tw'));
  $('.share_tw').addEventListener("click", (e) => {
    return; // todo later
  });

  let share_pin = newNode(
    'button', 
    ['share_pin'], 
    '', 
    $('.share_options div'), 
    `<i class="fab fa-pinterest-p fa-2x"></i>`
  );
  $('.share_pin').parentNode.replaceChild(share_mail, $('.share_pin'));
  $('.share_pin').addEventListener("click", (e) => {
    return; // todo later
  });
}

function renderPinnedQuotes() {
  if(currentQuote === {}) {
    return;
  }
  else if(pinnedQuotes.length === 0) {
    renderPinnedContainer();
  }
  pinCurrentQuote();
  setRemoveButton();
  renderSharing();
}

function renderPinnedContainer() {
  classTogglr('.pinned_quotes','pinned_hide','pinned_show');
}

function pinCurrentQuote() {
  // push to array
  pinnedQuotes.push(currentQuote);
  syncLocalStorage();
  
  // render on screen
  const quote_div = newNode(
    'div', 
    ['pinned_add'], 
    currentQuote.id, 
    $('.pinned_quotes'), 
    `<div class="quote">${currentQuote.text}</div>
    <div class="author">${currentQuote.author}</div>
    <button id="remove_${currentQuote.id}" class="remove">
        <i class="fas fa-times"></i>
    </button>
    <button id="share_${currentQuote.id}" class="share_pinned">
        <i class="fas fa-share-alt fa-sm"></i>
    </button>
    `);
    $('.pinned_quotes').prepend(quote_div);
}

function setRemoveButton() {
  $('.remove').addEventListener("click", (e) => {
    
    const id = getCurrentId(e);

    // restore pin_quote button
    if(currentQuote.id === id) {
      $('.pin').disabled = false; 
    }
    
    // remove quote object from pinnedQuotes array
    const obj = pinnedQuotes.find(x => x.id === id);
    const index = pinnedQuotes.indexOf(obj);
    pinnedQuotes.splice(index, 1);
    syncLocalStorage();
    
    // remove card from screen
    classTogglr('#' + id,'pinned_add','pinned_remove'); 
    setTimeout(() => $('.pinned_quotes').removeChild($('#' + id)), 400); 
    
    //remove container if array is empty
    if(pinnedQuotes.length === 0) {
      classTogglr('.pinned_quotes','pinned_hide','pinned_show');
    }
  })
}

function getCurrentId(e) {
  let id_arr = e.currentTarget.getAttribute('id').split('_');
  return '_' +  id_arr[id_arr.length-1];
}

function renderSharing() {
  $('.share_pinned').addEventListener("click", (e) => {
    const id = getCurrentId(e);
    const obj = pinnedQuotes.find(x => x.id === id);
    let quote = obj.text;
    let author = obj.author; 
    showSocial(quote, author);
  })  
}

function syncLocalStorage() {
  return; // to do later
}

function toggleTheme() {
  $('html').classList.add('change_theme');

  let current_theme = $('#theme').getAttribute('href');
  let next_theme = ((current_theme === 'lightTheme.css') ? 'darkTheme.css' : 'lightTheme.css');
  $('#theme').setAttribute('href', next_theme);

  setTimeout(() => {
   $('html').classList.remove('change_theme');
  }, 1000);  
}

function init() {

  // to do later:
  // load items from local storage and push them to pinnedQuotes array 
  // also display them on screen

  $('.pin').disabled = true;
  $('.share').disabled = true;
  buildSpinner();
  getQuote();

  $('.load').addEventListener("click", (event) => {
    $('.pin').disabled = false;
    toggleWaitingMode();
    getQuote();
  });
  
  $('.close').addEventListener("click", (e) => {
    classTogglr('.share_options','share_show','share_hide');
  });

  $('.pin').addEventListener("click", (event) => {
    $('.pin').disabled = true;
    renderPinnedQuotes();
  });

  $('.theme').addEventListener("click", (e) => {
    toggleTheme();
  });
}

document.addEventListener("DOMContentLoaded", (event) => {
  init();
});


    
    