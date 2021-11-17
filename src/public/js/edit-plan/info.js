const info = document.getElementById("info")
const infoBox = document.getElementsByClassName("dragdrop-info") 

function onOffInfo() {
    if (infoBox[0].style.display == 'none'){
        infoBox[0].style.display='flex';
        infoBox[1].style.display='flex';
        infoBox[2].style.display='flex';
    } else {
        infoBox[0].style.display='none';
        infoBox[1].style.display='none';
        infoBox[2].style.display='none';
    }
    
}

info.addEventListener('click', onOffInfo);