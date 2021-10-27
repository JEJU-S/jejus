"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _userController = require("../controllers/userController");

var _middleware = require("../middleware");

// /users/~~~
var userRouter = _express["default"].Router(); // google login api 처리하는 함수 사용


userRouter.get("/callback", _userController.callback);
userRouter.get("/logout", _userController.logout); // user profile

userRouter.get("/:id([0-9a-f]{24})", _middleware.protectMiddleware, _userController.seeProfile);
userRouter.route("/:id([0-9a-f]{24})/edit", _middleware.protectMiddleware).get(_userController.getEditProfile).post(_userController.postEditProfile);
var _default = userRouter;
exports["default"] = _default;