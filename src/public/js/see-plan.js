const planBtns = document.querySelectorAll(".btn");
const wholePlan = document.getElementsByClassName("whole-plan");
const dayPlans = document.getElementsByClassName("day-plan");
const planId = document.querySelector(".whole-plan").dataset.planid;

//1 ~ n day

function dayButtonClick(day){
    
    planBtns[0].style.backgroundColor = "#e3e3e3";
    wholePlan[0].style.display = "none";
    planBtns[0].style.zIndex = 1;

    for(let i = 0; i < dayPlans.length; i++){
        if(day == i + 1){
            planBtns[i+1].style.backgroundColor = "white";
            planBtns[i+1].style.zIndex = 10;
            dayPlans[i].style.display = "grid"; 
        }
        else{
            planBtns[i+1].style.backgroundColor = "#e3e3e3";
            dayPlans[i].style.display = "none";
            planBtns[i+1].style.zIndex = 1;
        }
    }
}

function wholePlanClick(){
    planBtns[0].style.backgroundColor = "white";
    planBtns[0].style.zIndex = 10;
    wholePlan[0].style.display = "flex";

    for(let i =0; i < dayPlans.length; i++){
        planBtns[i+1].style.backgroundColor = "#e3e3e3";
        dayPlans[i].style.display = "none";
        planBtns[i + 1].style.zIndex = 1;
    }
}
// 초대장 전송

const emailForm = document.querySelector(".inv-area");

function showInvitationForm(){
    emailForm.style.display = "flex";
    // 배경 흐리게
}

function sendInvitationToGmail(event){
    //변경해야 함
    const regex = new RegExp(/[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]$/i);

    const gmailInput = emailForm.querySelector("input[type='email']");
    /*
    if(!regex.test(gmailInput.value)){
        alert("email 형식으로 입력해주세요");
        event.preventDefault();
        return;
    }
    */
    //server로 키워드 전송
    emailForm.style.display = "none";
    
}
const statusCode = Number(document.querySelector(".inv-area").dataset.status);
alertServerMsg(statusCode);
function alertServerMsg(statusCode){
    let message;
    switch(statusCode){
        case -1 :
            return; 
        case 0 :{
            message = "초대장이 전송되었습니다";
            break;
        }
        case 1 :{   
            message = "본인에게 초대장을 보낼 수 없습니다";
            break;
        }
        case 2 :{
            message = "이미 초대된 회원입니다";
            break;
        }
        case 3 : {
            message = "해당 이메일이 회원이 아닙니다.";
            break;
        }
    }
    alert(message);
    history.replaceState({}, null, location.pathname);
}


function closeInvitaitonToGmail(event){
    event.preventDefault();
    const gmailInput = document.querySelector(".inv-area input[type='email']");
    gmailInput.value ="";
    emailForm.style.display = "none";
}

document.querySelector(".inv-btn").addEventListener("click", showInvitationForm);
emailForm.addEventListener("submit", sendInvitationToGmail);
emailForm.addEventListener("reset", closeInvitaitonToGmail);

planBtns[0].addEventListener("click", wholePlanClick);

planBtns.forEach(function(button, day) {
    if(day != 0){
    button.addEventListener("click", function(){dayButtonClick(day)})
    }
});


wholePlanClick();
/***MAP********************************************/

const mapOptions = {
    center : new naver.maps.LatLng(33.50088510909299, 126.52906251498592),
    zoom : 10
};

const totMap = new naver.maps.Map(document.getElementById("total-map"), mapOptions);
const dayPlan = JSON.parse(document.getElementById("total-map").dataset.dayplan);

for(let i =0; i < dayPlan.length; i++){
    for(let j = 0; j < dayPlan[i].place.length; j++){
        new naver.maps.Marker({
            position : new naver.maps.LatLng(
                dayPlan[i].place[j].y,
                dayPlan[i].place[j].x
                ),
            map : totMap
        })
    }   
}

/******버튼************/


document.querySelector(".edit-btn").addEventListener("click", () => {
    window.location.href = `/plans/${planId}/edit`;
});

if(document.querySelector(".edit-link") !== null){

    document.querySelectorAll(".edit-link").forEach((link) => {
        link.addEventListener("click", () => {
            window.location.href = `/plans/${planId}/edit`;
    });
    });
}

if(document.querySelector(".del-btn") !== null){
    document.querySelector(".del-btn").addEventListener("click", () => {
        window.location.href = `/plans/${planId}/delete`;
    });
}

/************DAY********************/

document.querySelectorAll(".day-map").forEach((dayMap) => {    
    const day = Number(dayMap.dataset.dayindex);
    const map = new naver.maps.Map(document.getElementById(`day-map${day + 1}`), mapOptions);

    const dayPolyPath = [];
    
    for(let i =0; i < dayPlan[day].place.length; i++){
        new naver.maps.Marker({
            position : new naver.maps.LatLng(
                dayPlan[day].place[i].y,
                dayPlan[day].place[i].x
            ),
            map : map
        })
        dayPolyPath.push(new naver.maps.LatLng(
            dayPlan[day].place[i].y,
            dayPlan[day].place[i].x
        ));
    }
    console.log(dayPolyPath);
        if(dayPolyPath.length > 1){
        const dayPolyLine = new naver.maps.Polyline({
            map : map,
            path : dayPolyPath,
            strokeWeight : 2,
            strokeOpacity : 0.9,
            strokeColor : '#4169E1',
            strokeStyle : 'shortdash',
            endIcon : 1
        })
    }
})

document.querySelectorAll(".more-btn").forEach((moreBtn) => {
    moreBtn.addEventListener("click", () => {
        window.location.href =  moreBtn.dataset.link;
    })
})
