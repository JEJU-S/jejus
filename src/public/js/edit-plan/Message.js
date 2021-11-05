
const chatForm = document.querySelector(".chatting form");
const chatBox = document.querySelector(".chat-box");

//chatForm.querySelector("textarea").addEventListener();

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

class Message {
    constructor(image_url, message, className){
        this.elements = {};
        this.elements.root = Message.createRoot();
        this.elements.root.classList.add(className);
        this.elements.message = this.elements.root.querySelector(".chat-message");
        this.elements.message.textContent = message;
        
        if(className === "incoming"){
            const imageDiv = document.createElement("div");
            const image = document.createElement("img");
            imageDiv.classList.add("chat-img");
            image.src = image_url;
            image.alt="image_url";
            imageDiv.append(image);

            this.elements.root.append(imageDiv);
        }
    }

    static createRoot(){
        const range = document.createRange();
		range.selectNode(document.body);
		return range.createContextualFragment(`
			<div class="chat">
            <div class="chat-message"></div>
            </div>
		`).children[0];
    }
}

export default class ChattingList {
    constructor(root){
        this.root = root;
    }

    addMessage(image_url, message, className){
        const msg = new Message(image_url, message, className);
        this.root.append(msg.elements.root);
    }
}

const chattingList = new ChattingList(document.querySelector(".chat-box"));

//chattng popup click
const chattingPopup = document.querySelector("#popup");

chattingPopup.addEventListener("click", showChatBox);

function showChatBox(){
    document.querySelector(".chatting").style.display = "flex";
    chattingPopup.style.display = "none";
}

document.querySelector(".chatting button").addEventListener("click", showChatPopup);
function showChatPopup(event){
    event.preventDefault();
    chattingPopup.style.display = "flex";
    document.querySelector(".chatting").style.display = "none";
}