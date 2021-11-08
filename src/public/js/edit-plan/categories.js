const cat = document.getElementsByClassName("category");
const title = document.getElementsByTagName('span');

function categoryHover() {
    title.classList.add('hovered');
    
}

function init() {
    for (var i = 0; i < cat.length; i++) {
      cat[i].addEventListener("mouseover", categoryHover);
    }
  }
  
  init();