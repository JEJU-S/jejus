"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _server = _interopRequireDefault(require("./server"));

require("regenerator-runtime");

var _ws = _interopRequireDefault(require("ws"));

var _http = _interopRequireDefault(require("http"));

//import "./db"; // database 연결
// 서버 객체, 라우터 
var PORT = process.env.PORT || 8080;

var handleListening = function handleListening() {
  return console.log("\u2705Server listening on port http://localhost:".concat(PORT, "  \uD83D\uDE80"));
}; // 서버 4000에서 서버가 열리고 요쳥받음
// socket 구현


var server = _http["default"].createServer(_server["default"]);

var wss = new _ws["default"].Server({
  server: server
});
wss.on("connection", function (socket) {
  socket.on("close", function () {
    console.log("disconnected from client");
  });
  socket.on("message", function (message) {
    console.log(message);
  });
  socket.send("hello");
});
server.listen(PORT, handleListening); //app.listen(PORT, handleListening);
//브라우저가 요청한 페이지 get 해서 보여줘야 함