
var tooltip = document.getElementsByClassName("user"); 
var tooltipTxt = document.getElementsByClassName("userinfo"); 

for (var i = 0; i < tooltip.length; i++) {
    var eachTooltip = tooltip[i];
}

for (var i = 0; i < tooltipTxt.length; i++) {
    var eachTooltipTxt = tooltipTxt[i];
}

eachTooltip.addEventListener('mousemove', function(e){ 
    eachTooltipTxt.style.left = 
    (e.clientX - 288) + 'px'; eachTooltipTxt.style.top = (e.clientY - 95) + 'px'; 
    }
);