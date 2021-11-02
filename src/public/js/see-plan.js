const planBtns = document.querySelectorAll(".btn");
const wholePlan = document.getElementsByClassName("whole-plan");
const dayPlans = document.getElementsByClassName("day-plan");

//1 ~ n day

function dayButtonClick(day){
    
    planBtns[0].style.backgroundColor = "#cccccc";
    wholePlan[0].style.display = "none";
    for(let i = 0; i < dayPlans.length; i++){
        if(day == i + 1){
            planBtns[i+1].style.backgroundColor = "white";
            planBtns[i+1].style.zIndex = 1;
            dayPlans[i].style.display = "grid";
            
        }
        else{
            planBtns[i+1].style.backgroundColor = "#cccccc";
            dayPlans[i].style.display = "none";
        }
    }
}

function wholePlanClick(){

    planBtns[0].style.backgroundColor = "white";
    planBtns[0].style.zIndex = 1;
    wholePlan[0].style.display = "flex";
    for(let i =0; i < dayPlans.length; i++){
        planBtns[i+1].style.backgroundColor = "#cccccc";
        dayPlans[i].style.display = "none";
    }
}

// 초대장 전송

const emailForm = document.querySelector(".email-form");

function showInvitationForm(){
    emailForm.style.display = "block";
    // 배경 흐리게
    

}

function sendInvitationToGmail(event){
    const regex = new RegExp(/@gmail.com$/);

    const gmailInput = emailForm.querySelector("input[type='email']");
    console.log(gmailInput.value);
    
    if(!regex.test(gmailInput.value)){
        alert("@gmail.com 형식으로 입력해주세요");
        return;
    }
    //server로 키워드 전송
    emailForm.style.display = "none";
    alert("초대장이 전송되었습니다");
    
}

function closeInvitaitonToGmail(event){
    event.preventDefault();
    const gmailInput = emailForm.querySelector("input[type='email']");
    gmailInput.value ="";
    emailForm.style.display = "none";
}

document.querySelector(".inv-btn").addEventListener("click", showInvitationForm);
emailForm.addEventListener("submit", sendInvitationToGmail);
emailForm.addEventListener("reset", closeInvitaitonToGmail);


wholePlanClick();


