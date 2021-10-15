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

var _fakeDB = require("./fakeDB");

_dotenv["default"].config(); // 추후 진짜 db로 바꿔야 함


// Main Page 
var main = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            return _context.abrupt("return", res.render("main"));

          case 4:
            _context.prev = 4;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", res.render("<h1>SERVER ERROR🛑</h1>"));

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 4]]);
  }));

  return function main(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}(); // --로그인 작업--
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
    redirect_uri: "http://localhost:4000/users/callback"
  };
  var params = new URLSearchParams(config).toString();
  var finalURL = "".concat(baseURL, "?").concat(params);
  return res.redirect(finalURL);
};

exports.login = login;

var callback = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
    var baseURL, config, params, finalURL, tokenRequest, access_token, _baseURL, _config, _params, _finalURL, userRequest;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log("call back function!");
            baseURL = "https://oauth2.googleapis.com/token";
            config = {
              client_id: process.env.GL_CLIENT,
              client_secret: process.env.GL_SECRET,
              code: req.query.code,
              grant_type: "authorization_code",
              redirect_uri: "http://localhost:4000/users/callback"
            };
            params = new URLSearchParams(config).toString();
            finalURL = "".concat(baseURL, "?").concat(params); //token 받기

            _context2.next = 7;
            return (0, _nodeFetch["default"])(finalURL, {
              method: "POST",
              headers: {
                Accept: "application/json"
              }
            });

          case 7:
            _context2.next = 9;
            return _context2.sent.json();

          case 9:
            tokenRequest = _context2.sent;

            if (!("access_token" in tokenRequest)) {
              _context2.next = 34;
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

            _context2.next = 18;
            return (0, _nodeFetch["default"])(_finalURL, {
              method: "GET"
            });

          case 18:
            _context2.next = 20;
            return _context2.sent.json();

          case 20:
            userRequest = _context2.sent;
            console.log(userRequest);
            console.log("-----------user info-------------");
            console.log(userRequest['names'][0]['displayName']);
            console.log(userRequest['photos'][0]['url']);
            console.log(userRequest['emailAddresses'][0]['value']);
            console.log("---------------------------------"); //**DB**
            //db에서 사용자를 찾을 수 없다면 => 추가 
            // db에서 사용자 찾을 수 있다면
            // => select
            //session 초기화(만든다)

            req.session.loggedIn = true; //session User 저장(DB에서 user찾아서)

            req.session.user = {
              _id: "507f1f77bcf86cd799439011",
              name: userRequest['names'][0]['displayName'],
              image_url: userRequest['photos'][0]['url'],
              gmail: userRequest['emailAddresses'][0]['value'],
              totPlan_id: ["507f191e810c19729de860ea", "13jbrkw3494msd3j3456e245"]
            }; // user가 가지고 있는 plan 뽑아서 id, title을 저장
            // fake db에서는 2개 만든걸로 있는 걸로 넣음

            req.session.totPlanTitleList = [{
              title: _fakeDB.fakeTotPlan1.title,
              _id: _fakeDB.fakeTotPlan1._id
            }, {
              title: _fakeDB.fakeTotPlan2.title,
              _id: _fakeDB.fakeTotPlan2._id
            }];
            console.log(req.session.totPlanTitleList); //profile 페이지로 redirect(seeProfile 함수)

            res.redirect("/users/".concat(req.session.user._id));
            _context2.next = 36;
            break;

          case 34:
            console.log("error 알림 해줘야 함");
            res.redirect("/");

          case 36:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function callback(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}(); //goes to user router


exports.callback = callback;

var getEditProfile = function getEditProfile(req, res) {
  res.render("edit-profile", {
    user: req.session.user,
    totPlanTitles: req.session.totPlanTitleList
  });
};

exports.getEditProfile = getEditProfile;

var postEditProfile = function postEditProfile(req, res) {
  console.log("post func"); //**DB** : => user 변경사항 다시 저장
  //session에서 user 다시 저장

  var id = req.params.id;
  var name = req.body.name;
  req.session.user.name = name;
  res.redirect("/users/".concat(id));
};

exports.postEditProfile = postEditProfile;

var seeProfile = function seeProfile(req, res) {
  return res.render("see-profile", {
    user: req.session.user,
    totPlanTitles: req.session.totPlanTitleList
  });
}; //로그아웃 -> main 페이지로 간다


exports.seeProfile = seeProfile;

var logout = function logout(req, res) {
  req.session.destroy();
  res.redirect("/");
};

exports.logout = logout;