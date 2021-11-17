//사이드바 onclick

document.querySelectorAll(".menu-name").forEach((menu) => {
    menu.addEventListener("click", (event) => {
        const menu = event.target.closest(".menu-name"); 

        if(menu.id !== "sidebar-group") {
            window.location.href = menu.querySelector("a").href;
        }
    });

})


