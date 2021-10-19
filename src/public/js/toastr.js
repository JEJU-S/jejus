
let removeToast;

const result = document.getElementsByClassName("result");
const toast = document.getElementById("toast");

function handleOnclick1() {
    var div = document.createElement('div');
    div.innerHTML = document.getElementById('place-object').innerHTML;
    document.getElementById('plcBox').appendChild(div);


    toast.classList.contains("reveal") ?
        (clearTimeout(removeToast), removeToast = setTimeout(function () {
            document.getElementById("toast").classList.remove("reveal")
        }, 1000)) :
        removeToast = setTimeout(function () {
            document.getElementById("toast").classList.remove("reveal")
        }, 1000)
    toast.classList.add("reveal")

}

for (var i = 0; i < result.length; i++) {
    var eachResult = result[i];
    eachResult.addEventListener('click', handleOnclick1);
}

const addBtn = document.getElementsByClassName("obj-add-btn");

for (var i = 0; i < addBtn.length; i++) {
    var eachaddBtn = addBtn[i];
    eachaddBtn.addEventListener('click', handleOnclick1);
}