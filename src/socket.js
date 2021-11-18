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

async function Arank(){
    const rec = await RecPlace.find({}).limit(50).lean();
    return rec;
}
//권역분류만 했을 때
async function sections(region){
    const sections = await RecPlace.find({ section : region}).limit(50).lean();
    return sections; 
}

//카테고리분류만 했을 때
async function categories(cate){
    const categories = await RecPlace.find({category : cate}).limit(50).lean();
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

async function checkid(tot,check){
    let x = false;
    await tot.forEach(function(i,j){
        if(i['_id']==check){
            x=i;
            //console.log(j,"번째 인덱스")
        }
        else{
            return false;
        }
    })
    return x;
}
async function checkitem(tot,check){
    let x;
    await tot.forEach(function(i,j){
        if(i['_id']==check){
            x=i;
            //console.log(j,"번째 인덱스")
        }
        else{
            return false;
        }
    })
    return x;
}
async function checkidx(tot,check){
    let x = false;
    tot.forEach(function(i,j){
        if(i['_id']==check){
            x=j;
            //console.log(j,"번째 인덱스")
            //console.log(i)
        }
        else{
            return false;
        }
    })
    return x;
}
async function checkobj(tot,check){
    let x;
    tot.forEach(function(i,j){
        if(i['x']==check.x && i['y'] == check.y){
            //console.log(i);
            x=i['_id'];
        }
        else{
            return false;
        }
    })
    return x;
}



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

async function sendCurrentParticipant(planId, totParticipants, socket){
    const clientsInRoom = await io.in(planId).fetchSockets();
    const currentParticipant = [];
    
    clientsInRoom.forEach((user) => {
        currentParticipant.push(user.userId);
    })
    //socket.nsp.to(planId).emit("current_participant", currentParticipant);
    socket.to(planId).emit("current_participant", currentParticipant , totParticipants);
    socket.emit("current_participant", currentParticipant, totParticipants);
}


//******************socket ****/
io.on("connection", (socket) => {
    //무슨 event가 일어났는지 확인하는 용도(추후 삭제)
    socket.onAny((event) => {
        console.log(`Socket Event: ${event}`);
    });  

    // plan id 로 만든 room에 join    
    socket.on("join_room", async (planId, userName, userId, init) => {
        socket.join(planId);
        socket.join(userId);
        socket["userName"] = userName;
        socket["userId"] = userId;
        socket["planId"] = planId;

        //console.log(socket.rooms); 
        //DB** 처음 칸반 장소 리스트 불러오기
        const placeList = await finduserPlan(planId);
        //DB** 사용자 불러오기(참가자 업데이트)
        const totParticipants = placeList.participants;
        //console.log(totParticipants);
        let PL = placeList.day_plan;
        //console.log(PL);
        sendCurrentParticipant(planId, totParticipants, socket);
        
        socket.to(planId).except(socket.userId).emit("server_msg", userName, true);
        init(PL);
    });
    /*****채팅 메시지***/

    socket.on("send_chatting_msg", (image_url, message, planId) => {

        const participants = io.sockets.adapter.rooms.get(socket.planId);
        for(const prt of participants){
            if(io.sockets.sockets.get(prt).userId === socket.userId)
                socket.to(prt).emit("outgoing_chatting_msg", message);
        }

        socket.to(planId).except(socket.userId).emit("incomming_chatting_msg", image_url, message);
        //socket.to(socket.userId).emit("outgoing_chatting_msg", message);
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

        //console.log(region, category);  
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
            //console.log(section,cate)
            //console.log(Rec);
            const rec1 = Rec;
            socket.emit("rec_result", rec1);
        }
        else if(category=='전체' && region!='전체'){
            let Rec_sect = await sections(section);
            //console.log(section,cate)
            //console.log(Rec_sect)
            const rec2 = Rec_sect;
            socket.emit("rec_result", rec2);
        }
        else if(region=='전체' && category!='전체'){
            let Rec_cate = await categories(cate);
            //console.log(section,cate)
            //console.log(Rec_cate)
            const rec3 = Rec_cate;
            socket.emit("rec_result", rec3);
        }
        else if(category=='전체' && region=='전체'){
            let Rec_rank = await Arank();
            const rec = Rec_rank;
            socket.emit("rec_result",rec);
        }

    });

    /*****칸반리스트***/

    socket.on("add_to_placelist", async (newPlace, columnId, droppedIndex, planId) => {
        //**DB 작업 필요=> 새로운 아이템 만들어서 넣어야 함 */
       // console.log("ADD TO PLACELIST")
        //console.log(newPlace);
        
        //console.log("OBJ ID 입니다 Day",columnId);
        //console.log("OBJ ID 입니다 Plan",planId);
        const placeList = await finduserPlan(planId);
        if(placeList==null){
            io.in(planId).disconnectSockets(true);
            //socket.disconnect();
            return;
        }
        let PL = placeList.day_plan;
        let dplace = await checkid(PL,columnId);
        
        Array.prototype.insert = function ( index, item ) {
            this.splice( index, 0, item );
        };
        if(dplace.place.length){
            await dplace.place.insert(droppedIndex,newPlace);
        }
        else{
            await dplace.place.push(newPlace);
        }
            
        PL.push(dplace);
        PL.pop();
        //console.log(dplace)
        //console.log(PL)

        //console.log(mongoose.Types.ObjectId.isValid(columnId)) // obj id 유효한지 확인
        await TotPlan.findByIdAndUpdate({ _id:planId } , {$set : {day_plan: PL } }).exec();

        const check_placeList = await finduserPlan(planId);
        let check_PL = check_placeList.day_plan;
        let check_place = await checkid(check_PL,columnId);
        let newitemId = await checkobj(check_place.place , newPlace);
        //console.log("추가된 아이템 확인1",check_place.place)
        //console.log("추가된 아이템 확인2",newitemId);

        socket.to(planId).emit("add_to_placelist" ,newitemId, newPlace, columnId, droppedIndex);
        socket.emit("add_to_placelist" , newitemId, newPlace, columnId, droppedIndex);
    });
    
    socket.on("move_in_placelist", async ( itemId, originColumnId, columnId, droppedIndex, planId) => {
        // 옮기는것도 결국 delete and insert ,, 해당 인덱스만 찾아서
        //고른 아이템 삭제 
        //console.log("MOVE IN PLACELIST")
        //console.log("item:",itemId)
        //console.log("origin",originColumnId)
        //console.log("dropped",columnId,droppedIndex)
        
       
        const placeList = await finduserPlan(planId);
        if(placeList==null){
            io.in(planId).disconnectSockets(true);
            //socket.disconnect();
            return;
        }
        let mPL = placeList.day_plan;
        //console.log(mPL)

        let del_place = await checkid(mPL,originColumnId);
        let date_check = del_place.date;
        let id_check = del_place._id;
        let del_index = await checkidx(mPL,originColumnId);
        let del_place_list = await del_place.place;

        let del_item = await checkidx(del_place_list,itemId);
        let insert_item = await checkitem(del_place_list,itemId); 

        //console.log("인덱스확인",del_item,"->",droppedIndex);
        //고른 아이템 추가
        Array.prototype.insert = async function ( index, item ) {
            this.splice( index, 0, item );
        };
        if(columnId==originColumnId && ( del_item == droppedIndex || del_item == droppedIndex-1) ){
            //console.log("칸반 인덱스 변동이 없음")
        }
        else
        {
            //console.log("삭제할 아이템 확인",del_item , insert_item);
            //console.log(del_place_list);
            await del_place_list.splice(del_item,1);
            //console.log("삭제확인",del_place_list);
            
            let update_array = { date: date_check , place : del_place_list , _id : id_check }

            await mPL.splice(del_index, 1,update_array );

            //console.log("옮기기 전 아이템 삭제",mPL);
            
            await TotPlan.findByIdAndUpdate({_id:planId } , {$set : {day_plan: mPL } }).exec();

            let insert_place = await checkid(mPL,columnId) 
            

            if(insert_place.place.length){
                await insert_place.place.insert(droppedIndex,insert_item);
            }
            else{
                await insert_place.place.push(insert_item);
            }

            await mPL.push(insert_place);
            await mPL.pop();

            await TotPlan.findByIdAndUpdate({_id:planId } , {$set : {day_plan: mPL } }).exec();

            socket.to(planId).emit("move_in_placelist", itemId, columnId, droppedIndex);
            socket.emit("move_in_placelist" , itemId, columnId, droppedIndex);
        }

    })
    
    socket.on("delete_from_list", async (itemId, columnId, planId) => {
        //console.log("DELETE FROM LIST")
       
        //console.log(itemId);
        const placeList = await finduserPlan(planId);
        if(placeList==null){
            io.in(planId).disconnectSockets(true);
            //socket.disconnect();
            return;
        }
        let dPL = placeList.day_plan;
        //console.log(dPL)
        let del_place = await checkid(dPL,columnId);
        let date_check = del_place.date;
        let id_check = del_place._id;
        let del_index = await checkidx(dPL,columnId);
        
        let del_place_list = del_place.place;
        let del_item = await checkidx(del_place_list,itemId);

        //console.log("확인",del_item);

        //console.log(del_place_list);
        del_place_list.splice(del_item,1);
        //console.log("삭제확인",del_place_list);
        
        let update_array = { date: date_check , place : del_place_list , _id : id_check }


        dPL.splice(del_index, 1, update_array );
        // dPL.splice(del_index, 0, update_array);
        //console.log(dPL)

        TotPlan.findByIdAndUpdate({_id:planId } , {$set : {day_plan: dPL } }).exec();

        
        //list에서 해당 id를 가진 place 삭제
        socket.to(planId).emit("delete_from_list", itemId);
        //socket.emit("delete_from_list", itemId);
    })

    socket.on("disconnecting", async (reason) => {
        //console.log(socket.planId);
        //console.log(socket.userId);
        const participants = io.sockets.adapter.rooms.get(socket.planId);
        const users = [];
        for(const prt of participants){
            if(io.sockets.sockets.get(prt).userId === socket.userId)
                users.push(io.sockets.sockets.get(prt).userId);
        }
       
        //console.log(users.length);
        if(users.length <= 1){
            socket.to(socket.planId).emit("server_msg", socket.userName, false);
            socket.to(socket.planId).emit("disconnecting_user", socket.userId);
        }
        /*
        const userCon = io.sockets.adapter.rooms.get(socket.userId);
        if(userCon !== undefined && userCon.size <= 1){
            socket.rooms.forEach(room => {
                console.log(room);  
                if(room !== sp){
                socket.to(room).emit("server_msg", socket.userName, false);
                socket.to(room).emit("disconnecting_user", socket.userId);
            }
        });
        }
        */
    });
});

export default server;

