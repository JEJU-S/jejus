//import "./db"; // database 연결
import app from "./server"; // 서버 객체, 라우터 
import "regenerator-runtime";
import WebSocket from "ws";
import http from "http";


const PORT = process.env.PORT || 8080;

const handleListening = () =>
    console.log(`✅Server listening on port http://localhost:${PORT}  🚀`);
// 서버 4000에서 서버가 열리고 요쳥받음

// socket 구현
const server = http.createServer(app);
const wss = new WebSocket.Server({server});

wss.on("connection", (socket) => {
    socket.on("close", () => {console.log("disconnected from client")});
    socket.on("message", (message) => {console.log(message)});
    socket.send("hello");
});


server.listen(PORT, handleListening);
//app.listen(PORT, handleListening);
//브라우저가 요청한 페이지 get 해서 보여줘야 함