import ChattingList from "/public/js/edit-plan/Message.js";
import SearchList from "/public/js/edit-plan//SearchList.js";
import Kanban from "/public/js/edit-plan//Kanban.js";

/*************채팅**************/

const chattingList = new ChattingList(document.querySelector(".chat-box"));

const chatForm = document.querySelector(".chatting form");
const chatBox = document.querySelector(".chat-box");

chatForm.addEventListener("submit", sendChattingMessage);

function sendChattingMessage(event){
    event.preventDefault();
    const input = chatForm.querySelector("textarea");
    chatBox.scrollTop = chatBox.scrollHeight;
    chattingList.addMessage("", input.value, "outgoing");
    //서버로 보내기💨
    input.value = "";
}

// server side에서 전달 받을 때 사용할 함수
function receiveChattingMessage(image_url, message){
    chattingList.addMessage(image_url, message, "incoming");
    chatBox.scrollTop = chatBox.scrollHeight;
}

function receiveSystemMessage(name, enter){
    const message = (enter == true)? `${name}님이 입장하셨습니다` : `${name}님이 퇴장하셨습니다`;
    chattingList.addMessage(name, message, "system");
    chatBox.scrollTop = chatBox.scrollHeight;
}
/***************검색리스트******************/

const searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", submitSearchKeyword);

function submitSearchKeyword(event){
  event.preventDefault();
  const input = searchForm.querySelector("input");
  //server로 키워드 전송
  //socket.emit("search_keyword", input.value);
  input.value = "";
  //temp
  socketReturn();
}

function socketReturn(){
  const searchList = new SearchList(document.querySelector(".search-list ul"), samplePlaceList);
}

/******************칸반보드********************/
new Kanban( document.querySelector(".kanban"), fakeItems2);










