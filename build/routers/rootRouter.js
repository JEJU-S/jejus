"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _userController = require("../controllers/userController");

var _middleware = require("../middleware");

var rootRouter = _express["default"].Router();

rootRouter.get("/", _middleware.loggedInMiddleware, _userController.main); // google aouth2로 넘어감

rootRouter.get("/login", _middleware.loggedInMiddleware, _userController.login);
var _default = rootRouter;
exports["default"] = _default;