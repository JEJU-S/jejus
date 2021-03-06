"use strict";

var planBtns = document.querySelectorAll(".btn");
var wholePlan = document.getElementsByClassName("whole-plan");
var dayPlans = document.getElementsByClassName("day-plan");
var planId = document.querySelector(".whole-plan").dataset.planid; //1 ~ n day

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

var statusCode = Number(document.querySelector(".inv-area").dataset.status);
alertServerMsg(statusCode);

function alertServerMsg(statusCode) {
  var message;

  switch (statusCode) {
    case -1:
      return;

    case 0:
      {
        message = "초대장이 전송되었습니다";
        break;
      }

    case 1:
      {
        message = "본인에게 초대장을 보낼 수 없습니다";
        break;
      }

    case 2:
      {
        message = "이미 초대된 회원입니다";
        break;
      }

    case 3:
      {
        message = "회원이 아닙니다.";
        break;
      }
  }

  alert(message);
  history.replaceState({}, null, location.pathname);
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
var infoWindow = new naver.maps.InfoWindow({
  content: '',
  backgroundColor: "#00000000",
  borderWidth: 0,
  disableAnchor: true
});

function seeplanMarkerClick(map, marker, name, road_adr) {
  if (infoWindow.getMap()) {
    infoWindow.close();
  }

  infoWindow.setContent(["<div class='map-info search' ondragstart=\"return false\" onselectstart=\"return false\">", "   <div><h3>".concat(name, "</h3>"), "   <p>".concat(road_adr, "</p></p></div>")].join(''));

  if (infoWindow.getMap()) {
    infoWindow.close();
  } else {
    infoWindow.open(map, marker);
  }

  map.panTo(marker.getPosition());
}

var totMap = new naver.maps.Map(document.getElementById("total-map"), mapOptions);
var dayPlan = JSON.parse(document.getElementById("total-map").dataset.dayplan);
var totMapMarkers = [];

var _loop = function _loop(i) {
  var _loop3 = function _loop3(j) {
    var marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(dayPlan[i].place[j].y, dayPlan[i].place[j].x),
      map: totMap
    });
    naver.maps.Event.addListener(marker, 'click', function (event) {
      seeplanMarkerClick(totMap, marker, dayPlan[i].place[j].name, dayPlan[i].place[j].road_adr);
    });
  };

  for (var j = 0; j < dayPlan[i].place.length; j++) {
    _loop3(j);
  }
};

for (var i = 0; i < dayPlan.length; i++) {
  _loop(i);
}

naver.maps.Event.addListener(totMap, 'click', function (event) {
  if (infoWindow.getMap()) {
    infoWindow.close();
  }
});
/******버튼************/

document.querySelector(".edit-btn").addEventListener("click", function () {
  window.location.href = "/plans/".concat(planId, "/edit");
});

if (document.querySelector(".edit-link") !== null) {
  document.querySelectorAll(".edit-link").forEach(function (link) {
    link.addEventListener("click", function () {
      window.location.href = "/plans/".concat(planId, "/edit");
    });
  });
}

if (document.querySelector(".del-btn") !== null) {
  document.querySelector(".del-btn").addEventListener("click", function () {
    window.location.href = "/plans/".concat(planId, "/delete");
  });
}
/************DAY********************/


var dayInfoWindows = [];
document.querySelectorAll(".day-map").forEach(function (dayMap) {
  var day = Number(dayMap.dataset.dayindex);
  var map = new naver.maps.Map(document.getElementById("day-map".concat(day + 1)), mapOptions);
  naver.maps.Event.addListener(map, 'click', function (event) {
    if (dayInfoWindows[day].getMap()) {
      dayInfoWindows[day].close();
    }
  });
  dayInfoWindows.push(new naver.maps.InfoWindow({
    content: '',
    backgroundColor: "#00000000",
    borderWidth: 0,
    disableAnchor: true
  }));
  var dayPolyPath = [];

  var _loop2 = function _loop2(_i) {
    var marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(dayPlan[day].place[_i].y, dayPlan[day].place[_i].x),
      map: map
    });
    naver.maps.Event.addListener(marker, 'click', function (event) {
      //(map, marker, dayPlan[day].name, dayPlan[day].road_adr);
      if (dayInfoWindows[day].getMap()) {
        dayInfoWindows[day].close();
      }

      dayInfoWindows[day].setContent(["<div class='map-info search' ondragstart=\"return false\" onselectstart=\"return false\">", "   <div>".concat(day + 1, "\uC77C ").concat(_i + 1, "\uBC88\uC9F8</div>"), "   <div><h3>".concat(dayPlan[day].place[_i].name, "</h3>"), "   <p>".concat(dayPlan[day].place[_i].road_adr, "</p></p></div>")].join(''));

      if (dayInfoWindows[day].getMap()) {
        dayInfoWindows[day].close();
      } else {
        dayInfoWindows[day].open(map, marker);
      }

      map.panTo(marker.getPosition());
    });
    dayPolyPath.push(new naver.maps.LatLng(dayPlan[day].place[_i].y, dayPlan[day].place[_i].x));
  };

  for (var _i = 0; _i < dayPlan[day].place.length; _i++) {
    _loop2(_i);
  }

  if (dayPolyPath.length > 1) {
    var dayPolyLine = new naver.maps.Polyline({
      map: map,
      path: dayPolyPath,
      strokeWeight: 2,
      strokeOpacity: 0.9,
      strokeColor: '#4169E1',
      strokeStyle: 'shortdash',
      endIcon: 1
    });
  }
});
document.querySelectorAll(".more-btn").forEach(function (moreBtn) {
  moreBtn.addEventListener("click", function () {
    window.location.href = moreBtn.dataset.link;
  });
});