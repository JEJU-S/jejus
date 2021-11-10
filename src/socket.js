// socket 구현
import fetch from "node-fetch";
import app from "./server";
import SocketIO from "socket.io";
import http from "http";
import dotdev from "dotenv";
dotdev.config();


/* 추후 삭제 해야 함*****************************/
const fakePlaceList = [
    {
    _id : "507f191e810c19729de860e1",
    date : new Date("2021-05-04"),
    place : [
        {   
            _id : "5bf142459b72e12b2b1b2c11",
            name : "place 1",
            road_adr : "도로명 주소1",
            x : "126.52001020252465",
            y : "33.48137202695348",
            map_link : ""
        },
        {   
            _id : "5bf142459b72e12b2b1b2c12",
            name : "place 2",
            road_adr : "도로명 주소2",
            x : "126.53001020252465",
            y : "33.48437202695348",
            map_link : ""
        }
    ]},
    {
        _id : "507f191e810c19729de860e2",
        date : new Date("2021-05-05"),
        place : [
            {   
                _id : "5bf142459b72e12b2b1b2c13",
                name : "place 3",
                road_adr : "도로명 주소3",
                x : "126.54001020252465",
                y : "33.48137205695348",
                map_link : ""
            },
            {   
                _id : "5bf142459b72e12b2b1b2c14",
                name : "place 4",
                road_adr : "도로명 주소4",
                x : "126.55001020252465",
                y : "33.48137202695348",
                map_link : ""
            }
        ]},
        {
            _id : "507f191e810c19729de860e3",
            date : new Date("2021-05-06"),
            place : [
                {   
                    _id : "5bf142459b72e12b2b1b2c15",
                    name : "place 5",
                    road_adr : "도로명 주소5",
                    x : "126.56001020252465",
                    y : "33.48337202695348",
                    map_link : ""
                },
                {   
                    _id : "5bf142459b72e12b2b1b2c16",
                    name : "place 6",
                    road_adr : "도로명 주소6",
                    x : "126.57001020252465",
                    y : "33.42337202695348",
                    map_link : ""
                }
        ]}
]

const fakeRecPlaceList = [
    {
        idx : 1,
        category : "CAFE",
        section : "", 
        name : "식빵가게",
        map_link: "https://place.map.kakao.com/615988591",
        road_adr : "제주특별자치도 제주시 월성로10길 2 2층",
        y : 33.417778216064875,
        x : 126.53305646875006,
        image_url: "",
        score: 4.5,
        model_score : 6.7,
        rank_index : 1,
        model_rank : "A"
    },

    {
        idx : 2,
        category : "FOOD",
        section : "", 
        name : "식빵가게1",
        map_link: "https://place.map.kakao.com/615988591",
        road_adr : "제주특별자치도 제주시 월성로10길 2 1층",
        y : 33.354711344326816,
        x : 126.75690290070189,
        image_url: "",
        score: 3,
        model_score : 8,
        rank_index : 2,
        model_rank : "A"
    },

    {
        idx : 3,
        category : "TOUR",
        section : "", 
        name : "식빵가게3",
        map_link: "https://place.map.kakao.com/615988591",
        road_adr : "제주특별자치도 제주시 월성로10길 2 3층",
        y : 33.33126374144996, 
        x : 126.32827061149187,
        image_url: "",
        score: 1,
        model_score : 1,
        rank_index : 3,
        model_rank : "D"
    }
];

/******************************/

const server = http.createServer(app);
const io = SocketIO(server);

// searchPlace 비동기 사용해서 검색 결과 반환
async function searchPlace(keyword){
    const searchResults = [];
    const baseURL = "https://dapi.kakao.com/v2/local/search/keyword.json";
    const config = {
        query : keyword,
        x : "126.54220428695811",
        y : "33.395088234717406",
        rect : "126.12717034442123,33.57731072530017,127.00740156999781,33.259875411548975"
    }
    const params = new URLSearchParams(config).toString();
    const finalURL = `${baseURL}?${params}`;
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
    console.log(searchResults);
    return searchResults;
}

async function sendSearchResults(keyword, socket){
    const searchResults = await(searchPlace(keyword));
    socket.emit("search_result", searchResults);
}

io.on("connection", (socket) => {
    //무슨 event가 일어났는지 확인하는 용도(추후 삭제)
    socket.onAny((event) => {
        console.log(`Socket Event: ${event}`);
    });  

    // plan id 로 만든 room에 join    
    socket.on("join_room", (planId, userName, userId, init) => {
        socket.join(planId);
        socket["userName"] = userName;
        socket["userId"] =userId;
        
        console.log(socket.rooms);
        console.log("*****************************");
        //DB** 처음 칸반 장소 리스트 불러오기
        const placeList = fakePlaceList;
        socket.to(planId).emit("server_msg", userName, true);
        init(placeList);
    });
    /*****채팅 메시지***/

    socket.on("send_chatting_msg", (image_url, message, planId) => {
        socket.to(planId).emit("incomming_chatting_msg", image_url, message);
        //socket.nsp.to(room).emit(event) => nsp 문서 확인 후 적용
    })
    /*****검색 리스트*/
    //search_keyword로 찾기
    socket.on("search_keyword", (keyword) => {
        sendSearchResults(keyword, socket);
    });

    socket.on("rec_keyword", (region, category) => {

        //****DB 추천 리스트 반환*/
        console.log("결과 : ", region, category);

        const recList = fakeRecPlaceList;
        socket.emit("rec_result", recList);
    });

    /* option
    socket.on("change_date", (start, end, planId) => {
        //DB****** 날짜 바꾸기
        console.log(planId);
        console.log(start);
        console.log(end);

        socket.to(planId).emit("create_date_div", start, end);
        socket.emit("create_date_div", start , end);
    })
    */

    /*****칸반리스트***/
    socket.on("add_to_placelist", (newPlace, columnId, droppedIndex, planId) => {
        //**DB 작업 필요=> 새로운 아이템 만들어서 넣어야 함 */
        console.log(newPlace);
        const newId = "507f191e810c19729de860ab"; 

        socket.to(planId).emit("add_to_placelist" , newId, newPlace, columnId, droppedIndex);
        socket.emit("add_to_placelist", newId, newPlace, columnId, droppedIndex);
    });
    
    socket.on("move_in_placelist", ( itemId, columnId, droppedIndex, planId) => {



        socket.to(planId).emit("move_in_placelist", itemId, columnId, droppedIndex);
        socket.emit("move_in_placelist" , itemId, columnId, droppedIndex);
    })
    
    socket.on("delete_from_list", (itemId, columnId, planId) => {
        console.log(itemId);
        //**DB 작업 필요 */
        //list에서 해당 id를 가진 place 삭제
        socket.to(planId).emit("delete_from_list", itemId);
        //socket.emit("delete_from_list", itemId);
    })
});

export default server;

