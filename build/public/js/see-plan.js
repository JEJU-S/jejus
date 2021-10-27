"use strict";

var planBtns = document.querySelectorAll(".btn");
var wholePlan = document.getElementsByClassName("whole-plan");
var dayPlans = document.getElementsByClassName("day-plan"); //1 ~ n day

function dayButtonClick(day) {
  planBtns[0].style.backgroundColor = "#cccccc";
  wholePlan[0].style.display = "none";

  for (var i = 0; i < dayPlans.length; i++) {
    if (day == i + 1) {
      planBtns[i + 1].style.backgroundColor = "white";
      planBtns[i + 1].style.zIndex = 1;
      dayPlans[i].style.display = "grid";
    } else {
      planBtns[i + 1].style.backgroundColor = "#cccccc";
      dayPlans[i].style.display = "none";
    }
  }
}

function wholePlanClick() {
  planBtns[0].style.backgroundColor = "white";
  planBtns[0].style.zIndex = 1;
  wholePlan[0].style.display = "flex";

  for (var i = 0; i < dayPlans.length; i++) {
    planBtns[i + 1].style.backgroundColor = "#cccccc";
    dayPlans[i].style.display = "none";
  }
}

planBtns[0].addEventListener("click", wholePlanClick);
planBtns.forEach(function (button, day) {
  if (day != 0) {
    button.addEventListener("click", function () {
      dayButtonClick(day);
    });
  }
});
wholePlanClick();