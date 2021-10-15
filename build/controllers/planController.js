"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.seePlan = exports.editPlan = exports.del = exports.createPlan = void 0;

var _dotenv = _interopRequireDefault(require("dotenv"));

var _fakeDB = require("./fakeDB");

_dotenv["default"].config(); //goes to plan router
// fake database(json) 추후 진짜 데이터베이스로 바꿔야 함


//사용자 마다 완성된 plan 보여주기 위한 것
var seePlan = function seePlan(req, res) {
  var id = req.params.id; // 같은 id 값을 가지고 있는 plan 가지고 오기
  //**DB** : => user, user가 가지고 있는 plan목록, 페이지에서 보여주고 있는 total plan

  res.render("see-plan", {
    user: req.session.user,
    totPlanTitles: req.session.totPlanTitleList,
    totPlan: _fakeDB.fakeTotPlan1,
    map_cl: process.env.MAP_CLIENT
  });
};

exports.seePlan = seePlan;

var editPlan = function editPlan(req, res) {
  //**DB** : => user, 페이지에서 보여주고 있는 total plan
  res.render("edit-plan");
};

exports.editPlan = editPlan;

var createPlan = function createPlan(req, res) {
  res.render("create-plan", {
    user: req.session.user,
    totPlanTitles: req.session.totPlanTitleList
  });
}; // 처음 만든 사람만 삭제 가능하게 만들어야 함


exports.createPlan = createPlan;

var del = function del(req, res) {
  return res.send("delete plans");
};

exports.del = del;