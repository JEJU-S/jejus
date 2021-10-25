const header = document.querySelector("#header");
const headerHeight = header.getBoundingClientRect().height;
const menu = document.querySelector(".menu");
 
window.addEventListener("scroll", function () {
        if (window.scrollY > headerHeight) {
            header.setAttribute("style", "background-color: #826cc1c9; box-shadow: 0 0 4px 0 rgb(0 0 0 / 13%);");
        } else {

            header.setAttribute("style", "background-color: transparent;");
        }
    });
