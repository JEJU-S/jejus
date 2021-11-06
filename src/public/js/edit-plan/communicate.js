import ChattingList from "/public/js/edit-plan/Message.js";
import SearchList from "/public/js/edit-plan/SearchList.js";
//import Kanban from "/public/js/edit-plan/Kanban.js";


/******************socket 생성************************/
export const socket = io(); 

export const planId = document.querySelector("#plan-id").innerHTML;
const userName = document.querySelector("#user-name").innerHTML;
const image_url = document.querySelector("#user-image").innerHTML;
/**************************************/
//들어올 때 서버로 보내기💨
socket.emit("join_room", planId, userName, init);

function init(){

  //database에서 초기 값 꺼내 온다
  //new Kanban(document.querySelector(".kanban"), fakeItems2);


}

/***************************************/

const chatForm = document.querySelector(".chatting form");
const chatBox = document.querySelector(".chat-box");

// 채팅 생성
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

