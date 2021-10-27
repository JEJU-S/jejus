
function addobj() {
    //리스트에 추가하는 스크립트//
    var div = document.createElement('div');
    div.innerHTML = document.getElementById('place-obj').innerHTML;
    document.getElementById('plcBox').appendChild(div);
}

let removeToast;
const toast = document.getElementById("toast");
const result = document.getElementsByClassName("result");

function toaster() {

    //토스터 나왔다가 들어가는 스크립트//
    toast.classList.contains("reveal") ?
        (clearTimeout(removeToast), removeToast = setTimeout(function () {
            document.getElementById("toast").classList.remove("reveal")
        }, 1000)) :
        removeToast = setTimeout(function () {
            document.getElementById("toast").classList.remove("reveal")
        }, 1000)
    toast.classList.add("reveal")

}
//클래스 하나하나에 숫자를 먹여 객체로 변환하고, 클릭 시 위의 함수가 실행되게 하는 스크립트//
for (var i = 0; i < result.length; i++) {
    var eachResult = result[i];
    eachResult.addEventListener('click', addobj);
    eachResult.addEventListener('click', toaster);
}

const addBtn = document.getElementsByClassName("obj-add-btn");

for (var i = 0; i < addBtn.length; i++) {
    var eachaddBtn = addBtn[i];
    eachaddBtn.addEventListener('click', addobj);
    eachaddBtn.addEventListener('click', toaster);
}

