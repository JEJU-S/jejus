
let removeToast;

const result = document.getElementsByClassName("result");

const toast = document.getElementById("toast");

function handleOnclick1() {

    toast.classList.contains("reveal") ?
        (clearTimeout(removeToast), removeToast = setTimeout(function () {
            document.getElementById("toast").classList.remove("reveal")
        }, 1000)) :
        removeToast = setTimeout(function () {
            document.getElementById("toast").classList.remove("reveal")
        }, 1500)
    toast.classList.add("reveal")

}

for (var i = 0; i < result.length; i++) {
    var eachResult = result[i];
    eachResult.addEventListener('click', handleOnclick1);
}