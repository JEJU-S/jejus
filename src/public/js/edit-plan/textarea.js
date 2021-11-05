
function submitOnEnter(event){
    if(event.which === 13 && !event.shiftKey){
        document.querySelector('.send-message').click()
        event.preventDefault(); 
    }
}

document.getElementById("form").addEventListener("keypress", submitOnEnter);
