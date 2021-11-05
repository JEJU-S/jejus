"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.seeProfile = exports.postEditProfile = exports.main = exports.logout = exports.login = exports.getEditProfile = exports.callback = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _os = _interopRequireDefault(require("os"));

var _User = require("../models/User");

var _fakeDB = require("./fakeDB");

var _mongoose = require("mongoose");

var _cli = require("cli");

var _mongodb = require("mongoose/node_modules/mongodb");

_dotenv["default"].config();

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

//
var hostname = _os["default"].networkInterfaces();

var PORT = process.env.PORT || 8080;

function finduser(_x) {
  return _finduser.apply(this, arguments);
} // Main Page 


function _finduser() {
  _finduser = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(user_gmail) {
    var user_info;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _User.User.findOne({
              gmail: user_gmail
            }).lean();

          case 2:
            user_info = _context2.sent;
            return _context2.abrupt("return", user_info);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _finduser.apply(this, arguments);
}

var main = function main(req, res) {
  return res.render("main");
}; // --로그인 작업--
//Main -> Profile 로 가는 process function 
//login -> callback -> profile


exports.main = main;

var login = function login(req, res) {
  //구글 로그인 전달 url 파라미터들
  var baseURL = "https://accounts.google.com/o/oauth2/v2/auth";
  var config = {
    response_type: "code",
    client_id: process.env.GL_CLIENT,
    scope: "email profile",
    redirect_uri: "http://localhost:".concat(PORT, "/users/callback")
  };
  var params = new URLSearchParams(config).toString();
  var finalURL = "".concat(baseURL, "?").concat(params);
  return res.redirect(finalURL);
};

exports.login = login;

var callback = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    var baseURL, config, params, finalURL, tokenRequest, access_token, _baseURL, _config, _params, _finalURL, userRequest, user_name, user_gmail, user_image_url, user_info, login_id, login_name, login_gmail, login_image, login_totPlan_list, login_call_list;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log("call back function!");
            baseURL = "https://oauth2.googleapis.com/token";
            config = {
              client_id: process.env.GL_CLIENT,
              client_secret: process.env.GL_SECRET,
              code: req.query.code,
              grant_type: "authorization_code",
              redirect_uri: "http://localhost:".concat(PORT, "/users/callback")
            };
            params = new URLSearchParams(config).toString();
            finalURL = "".concat(baseURL, "?").concat(params); //token 받기

            _context.next = 7;
            return (0, _nodeFetch["default"])(finalURL, {
              method: "POST",
              headers: {
                Accept: "application/json"
              }
            });

          case 7:
            _context.next = 9;
            return _context.sent.json();

          case 9:
            tokenRequest = _context.sent;

            if (!("access_token" in tokenRequest)) {
              _context.next = 50;
              break;
            }

            access_token = tokenRequest.access_token;
            _baseURL = "https://people.googleapis.com/v1/people/me";
            _config = {
              personFields: "emailAddresses,names,photos",
              access_token: access_token
            };
            _params = new URLSearchParams(_config).toString();
            _finalURL = "".concat(_baseURL, "?").concat(_params); // 사용자 정보 받아옴(json 형식)

            _context.next = 18;
            return (0, _nodeFetch["default"])(_finalURL, {
              method: "GET"
            });

          case 18:
            _context.next = 20;
            return _context.sent.json();

          case 20:
            userRequest = _context.sent;
            user_name = userRequest['names'][0]['displayName'];
            user_gmail = userRequest['emailAddresses'][0]['value'];
            user_image_url = userRequest['photos'][0]['url'];
            _context.next = 26;
            return new _User.User({
              name: user_name,
              gmail: user_gmail,
              image_url: user_image_url
            }).save().then(function () {
              console.log('Saved successfully');
            })["catch"](function (err) {
              console.log("already exist");
            });

          case 26:
            _context.next = 28;
            return finduser(user_gmail);

          case 28:
            user_info = _context.sent;
            login_id = user_info._id;
            login_name = user_info.name;
            login_gmail = user_info.gmail;
            login_image = user_info.image_url;
            login_totPlan_list = user_info.totPlan_list;
            login_call_list = user_info.call_list;
            console.log('---------------------------');
            console.log('UserInfo from MongoDB');
            console.log(login_id);
            console.log(login_name);
            console.log(login_gmail);
            console.log(login_image);
            console.log(login_totPlan_list);
            console.log(login_call_list);
            console.log('---------------------------');
            req.session.loggedIn = true; // session User 저장(DB에서 user찾아서)

            req.session.user = {
              _id: login_id,
              name: login_name,
              image_url: login_image,
              gmail: login_gmail,
              totPlan_list: login_totPlan_list,
              // user가 가지고 있는 plan 뽑아서 id, title을 저장
              call_list: login_call_list // 초대장 리스트

            };
            console.log(req.session.user); //profile 페이지로 redirect(seeProfile 함수)

            res.redirect("/users/".concat(req.session.user._id));
            _context.next = 52;
            break;

          case 50:
            console.log("error");
            res.redirect("/");

          case 52:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function callback(_x2, _x3) {
    return _ref.apply(this, arguments);
  };
}(); //goes to user router


exports.callback = callback;

var getEditProfile = function getEditProfile(req, res) {
  res.render("edit-profile", {
    user: req.session.user,
    totPlanTitles: req.session.user.totPlan_list
  });
};

exports.getEditProfile = getEditProfile;

var postEditProfile = function postEditProfile(req, res) {
  //**DB** : => user 변경사항 다시 저장
  //session에서 user 다시 저장
  var id = req.params.id;
  var name = req.body.name;
  req.session.user.name = name;
  res.redirect("/users/".concat(id));
};

exports.postEditProfile = postEditProfile;

var seeProfile = function seeProfile(req, res) {
  // session user 가 받은 초대를 
  return res.render("see-profile", {
    user: req.session.user,
    totPlanTitles: req.session.user.totPlan_list
  });
}; //로그아웃 -> main 페이지로 간다


exports.seeProfile = seeProfile;

var logout = function logout(req, res) {
  req.session.destroy();
  res.redirect("/");
};

exports.logout = logout;