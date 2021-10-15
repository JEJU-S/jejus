"use strict";

var removeToast;

function toast(string) {
  var toast = document.getElementById("toast");
  toast.classList.contains("reveal") ? (clearTimeout(removeToast), removeToast = setTimeout(function () {
    document.getElementById("toast").classList.remove("reveal");
  }, 1000)) : removeToast = setTimeout(function () {
    document.getElementById("toast").classList.remove("reveal");
  }, 1500);
  toast.classList.add("reveal");
}