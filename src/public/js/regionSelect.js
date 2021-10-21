const regionBackground = document.getElementById('regionplace');
const selectBtn = document.getElementById('regionbtn');
const jejuRegion = document.getElementsByClassName("jeju-region");


function regionSelect() {
    regionBackground.style.display='block';
}

function closeRegionSelect() {
    regionBackground.style.display='none';   
}

for (var i = 0; i < jejuRegion.length; i++) {
    var eachjejuRegion = jejuRegion[i];
    eachjejuRegion.addEventListener('click', closeRegionSelect);
}


selectBtn.addEventListener('click',regionSelect);