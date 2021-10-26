// socket 구현
import fetch from "node-fetch";
import app from "./server";
import SocketIO from "socket.io";
import http from "http";
import dotdev from "dotenv";
dotdev.config();


const server = http.createServer(app);
const io = SocketIO(server);
//const io = new WebSocket.Server({server});

// searchPlace 비동기 사용해서 불러옴

async function searchPlace(keyword){
    const searchResults = [];
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
        searchResults.push(document);
    });

    return searchResults;
}

async function sendSearchResults(keyword, socket){
    const searchResults = await(searchPlace(keyword));
    socket.emit("search_result", searchResults);
}

function addPlaceToDataBase(){
    // DATABASE 작업
}

function delPlaceFromDataBase(){
    // DATABASE 작업
}



io.on("connection", (socket) => {
    
    socket.onAny((event) => {
        console.log(`Socket Event: ${event}`);
      });

    socket.on("join_room", (planId) => {
        socket.join(planId);
    });

    socket.on("search_keyword", (keyword) => {
        sendSearchResults(keyword, socket);
    });
    
    socket.on("add_to_placelist", (searchResult) => {
        io.emit("place_add_map",searchResult);
    });

    /*
    socket.on("del_from_placelist", (coordinates) => {
        io.emit("", )
    })
    */     
});

export default server;

