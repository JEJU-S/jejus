import ChattingList from "/public/js/edit-plan/Message.js";
import SearchList from "/public/js/edit-plan/SearchList.js";
import {createMapMarker, removeMapMarker, mapPanToBound} from "/public/js/edit-plan/Map.js";

import {Kanban, mapMarkerList, Item} from "/public/js/edit-plan/Kanban.js";

/******************socket 생성************************/
export const socket = io(); 

export const planId = document.querySelector("#plan-id").innerHTML;
const userName = document.querySelector("#user-name").innerHTML;
const image_url = document.querySelector("#user-image").innerHTML;
const userId = document.querySelector("#user-id").innerHTML;

/**************************************/

let kanbanList;

//들어올 때 서버로 보내기💨
socket.emit("join_room", planId, userName, userId, init);
function init(placeList){

  // 칸반리스트 만들기
  kanbanList = new Kanban(document.querySelector(".kanban"), placeList);
}
/***************************************/

const chatForm = document.querySelector(".chatting form");
const chatBox = document.querySelector(".chat-box");

// 채팅 메시지 전송
const chattingList = new ChattingList(document.querySelector(".chat-box"));

chatForm.addEventListener("submit", sendChattingMessage);
function sendChattingMessage(event){
    event.preventDefault();
    const input = chatForm.querySelector("textarea");
    chatBox.scrollTop = chatBox.scrollHeight;
    //서버로 보내기💨
    socket.emit("send_chatting_msg", image_url, input.value, planId);
    chattingList.addMessage("", input.value, "outgoing");
    input.value = "";
}

// server side에서 전달 받을 때 사용할 함수
socket.on("incomming_chatting_msg", receiveChattingMessage);
function receiveChattingMessage(image_url, message){
    chattingList.addMessage(image_url, message, "incoming");
    chatBox.scrollTop = chatBox.scrollHeight;
}

socket.on("server_msg", receiveSystemMessage);
function receiveSystemMessage(name, enter){
    console.log("***************");
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
  new SearchList(document.querySelector(".search-list ul"), resultList);
}

/*******************Kanban*******************************/

socket.on("delete_from_list", deleteFromList);
socket.on("add_to_placelist", addFromList);
socket.on("move_in_placelist", moveInList);

function deleteFromList(itemId){
    console.log("***********삭제 시작");
    console.log(kanbanList.root);
    //item 삭제
    const deletedItem = kanbanList.root.querySelector(`.kanban div[data-id="${itemId}"]`);

    //map 삭제
    let mapIndex;
    mapMarkerList.forEach((mapMarker, index) => {
        if(mapMarker.id == itemId){
            removeMapMarker(mapMarker.marker);   
            mapIndex = index;
        } 
    })
    if(mapIndex != undefined){
        console.log(mapMarkerList);
        mapMarkerList.splice(mapIndex, 1);
    }
    deletedItem.parentElement.removeChild(deletedItem);
    console.log("삭제 완료");
}

function addFromList(newId, newPlace, columnId, droppedIndex){

    const newItem = new Item(newId, newPlace.name, newPlace.road_adr, newPlace.x, newPlace.y, newPlace.map_link);
    const droppedItemElement = newItem.elements.root;
    const columnElement = document.querySelector(`.kanban div[data-id="${columnId}"]`);
    const dropZonesInColumn = Array.from(columnElement.querySelectorAll(".kanban__dropzone"));

    const dropZone = dropZonesInColumn[droppedIndex];
    console.log("dropZoneIndex : ", droppedIndex);
    const insertAfter = dropZone.parentElement.classList.contains("kanban__item") ? dropZone.parentElement : dropZone;

    if(droppedItemElement.contains(dropZone)){
        return;
    }
    insertAfter.after(droppedItemElement);
}

function moveInList(itemId, columnId, droppedIndex){
    const droppedItemElement = document.querySelector(`.kanban div[data-id="${itemId}"]`);
    console.log(droppedItemElement);

    const columnElement = document.querySelector(`.kanban div[data-id="${columnId}"]`);
    console.log(columnElement);

    const dropZonesInColumn = Array.from(columnElement.querySelectorAll(".kanban__dropzone"));
    const dropZone = dropZonesInColumn[droppedIndex];

    console.log("dropZoneIndex : ", droppedIndex);
    const insertAfter = dropZone.parentElement.classList.contains("kanban__item") ? dropZone.parentElement : dropZone;

    if(droppedItemElement.contains(dropZone)){
        return;
    }
    
    insertAfter.after(droppedItemElement);
}

socket.on("current_participant", checkCurrentParticipant);


function checkCurrentParticipant(currentParticipant){
    currentParticipant.forEach((participantId) => {
        console.log(participantId);
        if(document.querySelector(`.participant [data-id="${participantId}"]`) != null){
            document.querySelector(`.participant [data-id="${participantId}"]`).classList.remove("notattend");
        }
    })
}

document.querySelector("#save").addEventListener("click", () => {
    
    window.location.href = `/plans/${planId}`;
})




