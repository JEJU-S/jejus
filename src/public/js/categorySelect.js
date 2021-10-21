var category = document.getElementsByClassName("category");

function categorySelect(event) {

  if (event.target.classList[1] === "selected") {
    event.target.classList.remove("selected");
  } else {
    for (var i = 0; i < category.length; i++) {
      category[i].classList.remove("selected");
    }

    event.target.classList.add("selected");
  }
}

function init() {
  for (var i = 0; i < category.length; i++) {
    category[i].addEventListener("click", categorySelect);
  }
}

init();