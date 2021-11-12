"use strict";

var planBtns = document.querySelectorAll(".btn");
var wholePlan = document.getElementsByClassName("whole-plan");
var dayPlans = document.getElementsByClassName("day-plan"); //1 ~ n day

function dayButtonClick(day) {
  planBtns[0].style.backgroundColor = "#e3e3e3";
  wholePlan[0].style.display = "none";
  planBtns[0].style.zIndex = 1;

  for (var i = 0; i < dayPlans.length; i++) {
    if (day == i + 1) {
      planBtns[i + 1].style.backgroundColor = "white";
      planBtns[i + 1].style.zIndex = 10;
      dayPlans[i].style.display = "grid";
    } else {
      planBtns[i + 1].style.backgroundColor = "#e3e3e3";
      dayPlans[i].style.display = "none";
      planBtns[i + 1].style.zIndex = 1;
    }
  }
}

function wholePlanClick() {
  console.log(planBtns[0]);
  planBtns[0].style.backgroundColor = "white";
  planBtns[0].style.zIndex = 10;
  wholePlan[0].style.display = "flex";

  for (var i = 0; i < dayPlans.length; i++) {
    planBtns[i + 1].style.backgroundColor = "#e3e3e3";
    dayPlans[i].style.display = "none";
    planBtns[i + 1].style.zIndex = 1;
  }
} // 초대장 전송


var emailForm = document.querySelector(".inv-area");

function showInvitationForm() {
  emailForm.style.display = "flex"; // 배경 흐리게
}

function sendInvitationToGmail(event) {
  //변경해야 함
  var regex = new RegExp(/[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]$/i);
  var gmailInput = emailForm.querySelector("input[type='email']");
  console.log(gmailInput.value);

  if (!regex.test(gmailInput.value)) {
    alert("email 형식으로 입력해주세요");
    return;
  } //server로 키워드 전송


  emailForm.style.display = "none";
  alert("초대장이 전송되었습니다");
}

function closeInvitaitonToGmail(event) {
  event.preventDefault();
  var gmailInput = document.querySelector(".inv-area input[type='email']");
  gmailInput.value = "";
  emailForm.style.display = "none";
}

document.querySelector(".inv-btn").addEventListener("click", showInvitationForm);
emailForm.addEventListener("submit", sendInvitationToGmail);
emailForm.addEventListener("reset", closeInvitaitonToGmail);
planBtns[0].addEventListener("click", wholePlanClick);
planBtns.forEach(function (button, day) {
  if (day != 0) {
    button.addEventListener("click", function () {
      dayButtonClick(day);
    });
  }
});
wholePlanClick();
/***MAP********************************************/

var mapOptions = {
  center: new naver.maps.LatLng(33.50088510909299, 126.52906251498592),
  zoom: 10
};
var totMap = new naver.maps.Map(document.getElementById("total-map"), mapOptions);
var dayPlan = JSON.parse(document.getElementById("total-map").dataset.dayplan);
console.log(dayPlan);

for (var i = 0; i < dayPlan.length; i++) {
  for (var j = 0; j < dayPlan[i].place.length; j++) {
    new naver.maps.Marker({
      position: new naver.maps.LatLng(dayPlan[i].place[j].y, dayPlan[i].place[j].x),
      map: totMap
    });
  }
}
/******버튼************/


var planId = document.querySelector(".whole-plan").dataset.planid;
document.querySelector(".edit-btn").addEventListener("click", function () {
  window.location.href = "/plans/".concat(planId, "/edit");
});
document.querySelector(".edit-link").addEventListener("click", function () {
  window.location.href = "/plans/".concat(planId, "/edit");
});

if (document.querySelector(".del-btn") !== null) {
  document.querySelector(".del-btn").addEventListener("click", function () {
    window.location.href = "/plans/".concat(planId, "/delete");
  });
}
/*********************/


document.querySelectorAll(".day-map").forEach(function (dayMap) {
  var day = Number(dayMap.dataset.dayindex);
  var map = new naver.maps.Map(document.getElementById("day-map".concat(day + 1)), mapOptions);
  console.log(map);
  console.log("day-map".concat(day + 1));

  for (var _i = 0; _i < dayPlan[day].place.length; _i++) {
    new naver.maps.Marker({
      position: new naver.maps.LatLng(dayPlan[day].place[_i].y, dayPlan[day].place[_i].x),
      map: map
    });
  }
});