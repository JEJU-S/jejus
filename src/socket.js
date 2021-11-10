// socket 구현
import fetch from "node-fetch";
import app from "./server";
import SocketIO from "socket.io";
import http from "http";
import dotdev from "dotenv";
dotdev.config();

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
import {RecPlace} from './models/RecPlace'
import {TotPlan} from './models/TotPlan'


//권역분류만 했을 때
async function sections(region){
    const sections = await RecPlace.find({ section : region}).lean();
    return sections;
}

//카테고리분류만 했을 때
async function categories(cate){
    const categories = await RecPlace.find({category : cate}).lean();
    return categories;
}
//권역, 카테고리 분류 모두 했을때
async function categorize(region,cate){
    const category = await RecPlace.find({section : region, category : cate}).lean();
    return category;
}

//편집중인 plan 찾기
async function finduserPlan(id){
    const usertotplan = await TotPlan.findOne({ _id : id}).lean();
    return usertotplan;
}

function checkid(tot,check){
    let x = false;
    tot.forEach(function(i,j){
        if(i['_id']==check){
            x=i;
            console.log(j,"번째 인덱스")
        }
        else{
            return false;
        }
    })
    return x;
}
function checkidx(tot,check){
    let x = false;
    tot.forEach(function(i,j){
        if(i['_id']==check){
            x=j;
            console.log(j,"번째 인덱스")
        }
        else{
            return false;
        }
    })
    return x;
}

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
    socket.on("join_room", async (planId, userName, init) => {
        socket.join(planId);
        socket["userName"] = userName;
        console.log(socket.rooms);

        console.log("*****************************");
        //DB** 처음 칸반 장소 리스트 불러오기
        const placeList = await finduserPlan(planId);
        let PL = placeList.day_plan;
        console.log(PL)
        socket.to(PL).emit("server_msg", userName, true);
        init(PL);
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

    socket.on("rec_keyword", async (region, category) => {

        //****DB 추천 리스트 반환*/

        // region ( section ) => 전체 , 제주(A) , 남부(B) , 서부(C) , 북동부(D), 성산우도(E)
        // category => 식당(FOOD) , 카페(CAFE), 관광지(TOUR)
        let section='전체';
        let cate='전체';

        console.log(region, category);  
        if(region == '제주'){
            section = 'A';
        }
        else if(region == '남부'){
            section = 'B';
        }
        else if(region == '서부'){
            section = 'C';
        }
        else if(region == '북동부'){
            section = 'D';
        }
        else if(region =='성산우도'){
            section = 'E';
        }

        if(category == '식당'){
            cate = 'FOOD';
        }
        else if(category == '카페'){
            cate = 'CAFE';
        }
        else if(category=='관광'){
            cate = 'TOUR';
        }

        if(category!='전체' && region!='전체'){
            let Rec = await categorize(section,cate);
            console.log(section,cate)
            console.log(Rec);
            const rec1 = Rec;
            socket.emit("rec_result", rec1);
        }
        else if(category=='전체'){
            let Rec_sect = await sections(section);
            console.log(section,cate)
            console.log(Rec_sect)
            const rec2 = Rec_sect;
            socket.emit("rec_result", rec2);
        }
        else if(region=='전체'){
            let Rec_cate = await categories(cate);
            console.log(section,cate)
            console.log(Rec_cate)
            const rec3 = Rec_cate;
            socket.emit("rec_result", rec3);
        }
       
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
    //columId = date Id
    //dropIndex = insert index location

    socket.on("add_to_placelist", async (newPlace, columnId, droppedIndex, planId) => {
        //**DB 작업 필요=> 새로운 아이템 만들어서 넣어야 함 */
        console.log(";;;;;;;;;;;;;")
        console.log(newPlace);
        // const newId = "507f191e810c19729de860ab"; 
        // dayplan 의 index 값의 id 에 접근해야함
        console.log("오브젝트아이디입니다 컬",columnId);
        console.log("오브젝트아이디입니다 플",planId);
        const placeList = await finduserPlan(planId);
        let PL = placeList.day_plan;
        let test1=checkid(PL,columnId);
        let test2=checkidx(PL,columnId);
        console.log(test1)
        test1.place.push(newPlace);
        PL.push(test1);
        PL.pop();
        console.log(test1)
        console.log(PL)
        // let xx =TotPlan.findOne({day_plan:[{_id:columnId}]});
        // console.log(xx);

        // TotPlan.findOneAndUpdate({ _id:planId , day_plan:[{_id:columnId}] }, {$push : {day_plan:[{ place : newPlace }] } } ).exec();
        
            
        // find and update or push? 
        // await TotPlan({
        //     _id:planId,
        //     day_plan: [{
        //         _id:columnId,
        //         place: [newPlace]}]
        // }).save().then(()=>{
        //     console.log("totplan saved",title);
        // }).catch((err) => {
        //     console.error(err)
        // });
        // var day_objectId = mongoose.Types.ObjectId(columnId);
        // var plan_objectId = mongoose.Types.ObjectId(planId);
        // let xd = [{_id:day_objectId , place:[newPlace]}];
        console.log(mongoose.Types.ObjectId.isValid(columnId)) // obj id 유효한지 확인
        TotPlan.findByIdAndUpdate({_id:planId } , {$set : {day_plan: PL } }).exec();
        // TotPlan.findByIdAndUpdate(planId, {$push : {day_plan: { test1 } } }).exec();
        
        socket.to(planId).emit("add_to_placelist" ,test1.place._id, newPlace, columnId, droppedIndex);
        socket.emit("add_to_placelist" , test1.place._id, newPlace, columnId, droppedIndex);
    });
    
    socket.on("move_in_placelist", ( itemId, columnId, droppedIndex, planId) => {

        socket.to(planId).emit("move_in_placelist", itemId, columnId, droppedIndex);
        socket.emit("move_in_placelist" , itemId, columnId, droppedIndex);
    })
    
    socket.on("delete_from_list", (itemId, planId) => {
        console.log(itemId);
        //**DB 작업 필요 */
        //list에서 해당 id를 가진 place 삭제
        socket.to(planId).emit("delete_from_list", itemId);
    })
});

export default server;

