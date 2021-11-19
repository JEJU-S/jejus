import ChattingList from "/public/js/edit-plan/Message.js";
import SearchList from "/public/js/edit-plan/SearchList.js";
import {map, createMapMarker, removeMapMarker, searchMarkers, kanbanMapMarkers} from "/public/js/edit-plan/Map.js";
//import {RecList} from "/public/js/edit-plan/RecList.js";
import {Kanban, Item} from "/public/js/edit-plan/Kanban.js";

const POLY_LINE_COLOR = [
    `#0079b9`,
`#0059ff`,
`#2611a0`,
`#0c2854`,
`#003f03`
]

/******************socket 생성************************/
export const socket = io(); 

export const planId = document.querySelector("#plan-id").innerHTML;
const userName = document.querySelector("#user-name").innerHTML;
const image_url = document.querySelector("#user-image").innerHTML;
const userId = document.querySelector("#user-id").innerHTML;
const adminId = document.querySelector(".participant").dataset.admin.toString();

/**************************************/

let kanbanList;

//들어올 때 서버로 보내기💨
//socket.emit("join_room", planId, userName, userId, init);
window.addEventListener('pageshow', (event) => {
    socket.emit("join_room", planId, userName, userId, init);
    console.log(event.persisted);
    if(event.persisted){
        history.go(0);
    }
});


document.querySelectorAll("input[type=checkbox]").forEach((checkbox, index) => {
    //const index = checkbox.dataset.index;
    checkbox.addEventListener("change", (event) => {
        setPolyLineVisability(index);    
    })
})

function setPolyLineVisability(index){
    if(kanbanPolyLine[index] != undefined && kanbanPolyLine[index].getMap() != null){
        if(kanbanPolyLine[index].getVisible() != false){
            kanbanPolyLine[index].setVisible(false);
        }else{
            kanbanPolyLine[index].setVisible(true);
        }
    }
}

const kanbanPolyLine = [];
function init(placeList){
  // 칸반리스트 만들기
    kanbanList = new Kanban(document.querySelector(".kanban"), placeList);
    const day = placeList.length;

    placeList.forEach((plan, index) => {
        const path = [];
        for(const place of plan.place){
            path.push(new naver.maps.LatLng(place.y, place.x))
        };
        drawKanbanPolyLine(path, index);
    })
}


function drawKanbanPolyLine(path, index){
    if(path.length > 1){
        kanbanPolyLine.push(
            new naver.maps.Polyline({
            map : map,
            path : path,
            strokeWeight : 2,
            strokeOpacity : 0.9,
            strokeColor : POLY_LINE_COLOR[index],
            strokeStyle : 'shortdash',
            endIcon : 1
        }))
    }
}

function changeKanbanPolyLine(path, index){
    if(kanbanPolyLine[index] != undefined && kanbanPolyLine[index].getMap() != null){
        kanbanPolyLine[index].setMap(null);
    }
    if(path.length > 1){
        kanbanPolyLine[index] = new naver.maps.Polyline({
            map : map,
            path : path,
            strokeWeight : 2,
            strokeOpacity : 0.9,
            strokeColor : POLY_LINE_COLOR[index],
            strokeStyle : 'shortdash',
            endIcon : 1
        });
    }
    //console.log(`#checkbox${index+1}`);
    //console.log(document.querySelector(`#checkbox${index+1}`));
    if(document.querySelector(`#checkbox${index+1}`).checked == false){
        console.log("fd");
        kanbanPolyLine[index].setVisible(false);
    }
}

/***************************************/

const chatForm = document.querySelector(".chatting form");
const chatBox = document.querySelector(".chat-box");
const nMsg = document.querySelector(".new-message");


//chattng popup click
const chattingPopup = document.querySelector("#popup");

chattingPopup.addEventListener("click", showChatBox);

function showChatBox(){
    document.querySelector(".chatting").style.display = "flex";
    chattingPopup.style.display = "none";
    document.querySelector(".new-message").style.visibility = "hidden";
}

document.querySelector(".chatting button").addEventListener("click", showChatPopup);
function showChatPopup(event){
    event.preventDefault();
    chattingPopup.style.display = "flex";
    document.querySelector(".chatting").style.display = "none";
}

// 채팅 메시지 전송
const chattingList = new ChattingList(document.querySelector(".chat-box"));

chatForm.addEventListener("submit", sendChattingMessage);
function sendChattingMessage(event){
    event.preventDefault();
    const input = chatForm.querySelector("textarea");
    //서버로 보내기💨
    socket.emit("send_chatting_msg", image_url, input.value, planId);
    chattingList.addMessage("", input.value, "outgoing");
    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
}

socket.on("outgoing_chatting_msg", recieveMyOwnMessage);

function recieveMyOwnMessage(message){
    chattingList.addMessage("", message, "outgoing");
    chatBox.scrollTop = chatBox.scrollHeight;
}

// server side에서 전달 받을 때 사용할 함수
socket.on("incomming_chatting_msg", receiveChattingMessage);

function receiveChattingMessage(image_url, message){
    chattingList.addMessage(image_url, message, "incoming");
    chatBox.scrollTop = chatBox.scrollHeight;
    console.log(chattingPopup.style.display);
    if(chattingPopup.style.display == "none"){
        document.querySelector(".new-message").style.visibility = "none";
    }
    else{
        document.querySelector(".new-message").style.visibility = "visible";
    }

}

socket.on("server_msg", receiveSystemMessage);
function receiveSystemMessage(name, enter){
    const message = (enter == true)? `${name}님이 입장하셨습니다` : `${name}님이 퇴장하셨습니다`;
    chattingList.addMessage(name, message, "system");
    chatBox.scrollTop = chatBox.scrollHeight;
}

/*****************검색창***************************/
const searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", submitSearchKeyword);

function submitSearchKeyword(event){
    event.preventDefault();
    const input = searchForm.querySelector("input");
  //server로 키워드 전송💨
    socket.emit("search_keyword", input.value);
    input.value = "";
}

socket.on("search_result", printSearchList);
function printSearchList(resultList){

    if(resultList.length === 0){
        for(const marker of searchMarkers){
            marker.setMap(null);
        }
        searchMarkers.splice(0, searchMarkers.length);

        document.querySelector(".search-list ul").innerHTML = `<div>검색 결과가 없어요..😥<br> 검색어를 확인해 주세요.</div>`;
    }else{
    new SearchList(document.querySelector(".search-list ul"), resultList);
    }
}

document.querySelector(".clear-btn").addEventListener("click", (event) => {
    event.preventDefault();
    for(const marker of searchMarkers){
        marker.setMap(null);
    }
    searchMarkers.splice(0, searchMarkers.length);
    new SearchList(document.querySelector(".search-list ul"), []);
})

/*******************Kanban*******************************/

socket.on("delete_from_list", deleteFromList);
socket.on("add_to_placelist", addFromList);
socket.on("move_in_placelist", moveInList);

function deleteFromList(itemId){
    //item 삭제
    const deletedItem = kanbanList.root.querySelector(`.kanban div[data-id="${itemId}"]`);
    const changedColumn = deletedItem.closest(".kanban__column");
    const columnIndex = Number(changedColumn.dataset.index);

    //map 삭제
    let mapIndex;
    kanbanMapMarkers.forEach((mapMarker, index) => {
        if(mapMarker.id == itemId){
            removeMapMarker(mapMarker.marker);   
            mapIndex = index;
        } 
    })
    if(mapIndex != undefined){
        kanbanMapMarkers.splice(mapIndex, 1);
    }
    deletedItem.parentElement.removeChild(deletedItem);

    const path = [];
    changedColumn.querySelectorAll(`.kanban__item`).forEach(item => {
        path.push(new naver.maps.LatLng(item.dataset.y, item.dataset.x));
    });

    changeKanbanPolyLine(path, columnIndex);

    //drawKanbanPolyLine();
}

function addFromList(newId, newPlace, columnId, droppedIndex){

    const newItem = new Item(newId, newPlace.name, newPlace.road_adr, newPlace.x, newPlace.y, newPlace.map_link);
    const droppedItemElement = newItem.elements.root;
    const columnElement = document.querySelector(`.kanban div[data-id="${columnId}"]`);
    const dropZonesInColumn = Array.from(columnElement.querySelectorAll(".kanban__dropzone"));

    const dropZone = dropZonesInColumn[droppedIndex];
    const insertAfter = dropZone.parentElement.classList.contains("kanban__item") ? dropZone.parentElement : dropZone;

    if(droppedItemElement.contains(dropZone)){
        return;
    }
    insertAfter.after(droppedItemElement);


    const changedColumn = columnElement;
    const columnIndex = Number(changedColumn.dataset.index);


    const path = [];
    changedColumn.querySelectorAll(`.kanban__item`).forEach(item => {
        console.log(item.dataset.y, item.dataset.x);

        path.push(new naver.maps.LatLng(item.dataset.y, item.dataset.x));
    });

    changeKanbanPolyLine(path, columnIndex);
}

function moveInList(itemId, originColumnId, columnId, droppedIndex){
    const droppedItemElement = document.querySelector(`.kanban div[data-id="${itemId}"]`);

    const columnElement = document.querySelector(`.kanban div[data-id="${columnId}"]`);
    const originColumnElement = document.querySelector(`.kanban div[data-id="${originColumnId}"]`);

    const dropZonesInColumn = Array.from(columnElement.querySelectorAll(".kanban__dropzone"));
    const dropZone = dropZonesInColumn[droppedIndex];

    const insertAfter = dropZone.parentElement.classList.contains("kanban__item") ? dropZone.parentElement : dropZone;

    if(droppedItemElement.contains(dropZone)){
        return;
    }
    
    insertAfter.after(droppedItemElement);

    const columnIndex = Number(columnElement.dataset.index);
    const originIndex = Number(originColumnElement.dataset.index);
    console.log(columnElement);
    console.log(originColumnElement);

    const changedPath = [];
    columnElement.querySelectorAll(`.kanban__item`).forEach(item => {

        changedPath.push(new naver.maps.LatLng(item.dataset.y, item.dataset.x));
    });
    changeKanbanPolyLine(changedPath, columnIndex);

    if(columnIndex != originIndex){
        const originPath = [];
        originColumnElement.querySelectorAll(`.kanban__item`).forEach(item => {

            originPath.push(new naver.maps.LatLng(item.dataset.y, item.dataset.x));
        });
        changeKanbanPolyLine(originPath, originIndex);
    }

}

//************************ */

document.querySelector("#save").addEventListener("click", () => {
    //socket leave room
    window.location.href = `/plans/${planId}`;
})


socket.on("disconnecting_user", checkDisconnectingUser);

function checkDisconnectingUser(userId){
    if(document.querySelector(`.participant [data-id="${userId}"]`) != null){
        document.querySelector(`.participant [data-id="${userId}"]`).classList.add("notattend");
    }
} 

socket.on("disconnect", () => {
    window.location.href = `/plans/${planId}`;
});

socket.on("current_participant", createParticipantHeader);

function createParticipantHeader(currentParticipant, totParticipants){
    
    const participantContent = [];

    totParticipants.forEach((participant) => {
        participantContent.push(
        `<div><img src="${participant.image_url}" alt="user-image" data-id="${participant._id}" class="hover notattend" draggable="false">
            <div class="participant-info">`);

        const prtName = (participant._id.toString() === adminId) ? `<span>${participant.name}👑</span>` : `<span>${participant.name}</span>`;
        participantContent.push(prtName + "</div></div>");
    });

    document.querySelector(".participant").innerHTML =participantContent.join('');

    checkCurrentParticipant(currentParticipant);
}

function checkCurrentParticipant(currentParticipant){
    currentParticipant.forEach((participantId) => {
        if(document.querySelector(`.participant [data-id="${participantId}"]`) != null){
            document.querySelector(`.participant [data-id="${participantId}"]`).classList.remove("notattend");
        }
    })
}







