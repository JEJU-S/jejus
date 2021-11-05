"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _mongoose = _interopRequireDefault(require("mongoose"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _genericPool = _interopRequireDefault(require("generic-pool"));

var _mongodb = require("mongoose/node_modules/mongodb");

_dotenv["default"].config();

_mongoose["default"].connect(process.env.DB_URL, {
  useNewUrlParser: true,
  //deprecatedError 발생 방지
  useUnifiedTopology: true,
  // 
  dbName: "jeju_plan" // 이 이름으로 db가 생성됩니다.

});

var db = _mongoose["default"].connection;

var handleOpen = function handleOpen() {
  return console.log("Connected to DB✅!");
};

var handleError = function handleError(error) {
  return console.log("❌DB ERROR", error);
};

db.on("error", handleError);
db.once("open", handleOpen);