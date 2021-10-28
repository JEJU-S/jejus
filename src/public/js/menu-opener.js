
const opener = document.getElementById("group");

function menuOpen(){
    var con = document.getElementById('mygroup');
    if (con.style.display == "flex"){ 
            con.style.display = "none"; 
    } else {
        con.style.display = "flex"; 
    }
}

opener.addEventListener('click', menuOpen);