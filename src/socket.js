// socket 구현
import fetch from "node-fetch";
import app from "./server";
import WebSocket from "ws";
import SocketIO from "SocketIO";
import http from "http";
import dotdev from "dotenv";
dotdev.config();

const server = http.createServer(app);
const wss = new WebSocket.Server({server});
const sockets = [];

// searchPlace 비동기 사용해서 불러옴
async function searchPlace(keyword){
    const placeResults = [];
    const baseURL = "https://dapi.kakao.com/v2/local/search/keyword.json";
    const config = {
        query : keyword,
        x : "126.54220428695811",
        y : "33.395088234717406",
    }
    const params = new URLSearchParams(config).toString();
    const finalURL = `${baseURL}?${params}`
    const result = await (
            await fetch (finalURL, {
            method : "GET",
            headers : {
                Authorization : `KakaoAK ${process.env.KAKAO_KEY}`
            },
        })
    ).json();
    result["documents"].forEach((document) => {
        placeResults.push(document);
    });

    return placeResults;
}

async function sendPlaceResults(message){
    const msgString = message.toString('utf8');
    const placeResults = await(searchPlace(msgString));
    sockets.forEach((socket)=> {
        socket.send(JSON.stringify(placeResults));
    });
}

wss.on("connection", (socket) => {
    sockets.push(socket);
    socket.on("message",sendPlaceResults);
    socket.on("close", () => {console.log("disconnected from client")});
});

export default server;

