"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("regenerator-runtime");

var _socket = _interopRequireDefault(require("./socket"));

//import "./db"; // database 연결
//import app from "./server"; // 서버 객체, 라우터 
var PORT = process.env.PORT || 8080;

var handleListening = function handleListening() {
  return console.log("\u2705Server listening on port http://localhost:".concat(PORT, "  \uD83D\uDE80"));
}; // 서버 4000에서 서버가 열리고 요쳥받음


_socket["default"].listen(PORT, handleListening); //app.listen(PORT, handleListening);
//브라우저가 요청한 페이지 get 해서 보여줘야 함