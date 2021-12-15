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

var _User = require("../models/User");

var _RecPlace = require("../models/RecPlace");

var _mongoose = require("mongoose");

var _cli = require("cli");

var _mongodb = require("mongoose/node_modules/mongodb");

_dotenv["default"].config();

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// new RecPlace({});
var PORT = process.env.PORT || 8080;

function finduser(_x) {
  return _finduser.apply(this, arguments);
} // Main Page 


function _finduser() {
  _finduser = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(user_gmail) {
    var user_info;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _User.User.findOne({
              gmail: user_gmail
            }).lean();

          case 2:
            user_info = _context4.sent;
            return _context4.abrupt("return", user_info);

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
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
    // redirect_uri : `http://localhost:${PORT}/users/callback`,
    redirect_uri: "https://chlwodnjs.netlify.app/users/callback"
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
            baseURL = "https://oauth2.googleapis.com/token";
            config = {
              client_id: process.env.GL_CLIENT,
              client_secret: process.env.GL_SECRET,
              code: req.query.code,
              grant_type: "authorization_code",
              // redirect_uri : `http://localhost:${PORT}/users/callback`,
              redirect_uri: "https://chlwodnjs.netlify.app/users/callback"
            };
            params = new URLSearchParams(config).toString();
            finalURL = "".concat(baseURL, "?").concat(params); //token 받기

            _context.next = 6;
            return (0, _nodeFetch["default"])(finalURL, {
              method: "POST",
              headers: {
                Accept: "application/json"
              }
            });

          case 6:
            _context.next = 8;
            return _context.sent.json();

          case 8:
            tokenRequest = _context.sent;

            if (!("access_token" in tokenRequest)) {
              _context.next = 39;
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

            _context.next = 17;
            return (0, _nodeFetch["default"])(_finalURL, {
              method: "GET"
            });

          case 17:
            _context.next = 19;
            return _context.sent.json();

          case 19:
            userRequest = _context.sent;
            user_name = userRequest['names'][0]['displayName'];
            user_gmail = userRequest['emailAddresses'][0]['value'];
            user_image_url = userRequest['photos'][0]['url'];
            _context.next = 25;
            return new _User.User({
              name: user_name,
              gmail: user_gmail,
              image_url: user_image_url
            }).save().then(function () {
              console.log('Saved successfully');
            })["catch"](function (err) {
              console.log("already exist");
            });

          case 25:
            _context.next = 27;
            return finduser(user_gmail);

          case 27:
            user_info = _context.sent;
            login_id = user_info._id;
            login_name = user_info.name;
            login_gmail = user_info.gmail;
            login_image = user_info.image_url;
            login_totPlan_list = user_info.totPlan_list;
            login_call_list = user_info.call_list;
            req.session.loggedIn = true; // session User 저장(DB에서 user찾아서)

            req.session.user = {
              _id: login_id,
              name: login_name,
              image_url: login_image,
              gmail: login_gmail,
              totPlan_list: login_totPlan_list,
              // user가 가지고 있는 plan 뽑아서 id, title을 저장
              call_list: login_call_list // 초대장 리스트

            }; //profile 페이지로 redirect(seeProfile 함수)

            res.redirect("/users/".concat(req.session.user._id));
            _context.next = 40;
            break;

          case 39:
            res.redirect("/");

          case 40:
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

var postEditProfile = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var id, name, user_data;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            //**DB** : => user 변경사항 다시 저장
            //session에서 user 다시 저장
            id = req.params.id;
            name = req.body.name;
            _context2.next = 4;
            return _User.User.findOne({
              _id: id
            }).exec(function (err, res) {
              if (res) {
                res.name = name;
                res.save();
              }
            });

          case 4:
            _context2.next = 6;
            return finduser(req.session.user.gmail);

          case 6:
            user_data = _context2.sent;
            req.session.user = user_data;
            res.redirect("/users/".concat(id));

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function postEditProfile(_x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

exports.postEditProfile = postEditProfile;

var seeProfile = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    var user_data;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return finduser(req.session.user.gmail);

          case 2:
            user_data = _context3.sent;
            req.session.user = user_data;
            return _context3.abrupt("return", res.render("see-profile", {
              user: req.session.user,
              totPlanTitles: req.session.user.totPlan_list
            }));

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function seeProfile(_x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}(); //로그아웃 -> main 페이지로 간다


exports.seeProfile = seeProfile;

var logout = function logout(req, res) {
  req.session.destroy();
  res.redirect("/");
};

exports.logout = logout;