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
            imageDiv.classList.add("chat-image");
            image.src = image_url;
            image.alt="image_url";
            imageDiv.append(image);

            this.elements.root.insertBefore(imageDiv, this.elements.message);
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

