
import {socket, planId} from "./communicate.js";

/***********************/

let fakeRegion = "전체";

const categoryBtns = document.querySelectorAll(".recommandation__categories");
categoryBtns.forEach((btn) => {
    btn.addEventListener("click", selectCategory);
})

function selectCategory(event){
    const category = event.target.closest('div').dataset.category;
    console.log(category);

    socket.emit("rec_keyword", fakeRegion, category);
}

//******************** */
class RecItem {
    constructor(id, place_name, road_address_name, place_url, x, y, image_url, score, model_grade){
        this.elements = {};
        this.elements.root = RecItem.createRoot();
        this.elements.img = this.elements.root.querySelector("img");
        this.elements.name = this.elements.root.querySelector(".reco-title");
        this.elements.moreBtn = this.elements.root.querySelector("button");
        this.elements.rating = this.elements.root.querySelector(".rating");
        this.elements.grade = this.elements.root.querySelector(".grade");

        this.elements.img.src = image_url;
        this.elements.img.alt= "추천 장소";
        this.elements.name.textContent = place_name;

        this.elements.root.dataset.x = x;
        this.elements.root.dataset.y = y;
        this.elements.root.dataset.road_adr = road_address_name;
        this.elements.root.dataset.id = id;
        
        //별점 비율
        this.elements.rating.style.width = `${score/5 * 100}%`;
        this.elements.grade.textContent = model_grade;

        this.elements.moreBtn.addEventListener("click", (event) => {
            window.open(place_url);
            event.stopPropagation();
        })

        this.elements.root.addEventListener("dragstart", (event) => {

            event.dataTransfer.setData("text/plain", JSON.stringify({
                name : place_name, 
                road_adr : road_address_name, 
                x : x, 
                y : y, 
                map_link : place_url,
            }));
        });
    }

    static createRoot(){
        const range = document.createRange();
        range.selectNode(document.body);
        return range.createContextualFragment(`
                <li draggable = "true">
                    <img>
                    <div>
                        <div>
                            <span class="reco-title"></span>
                            <button class="more-btn"><span class="material-icons">open_in_new</span>더보기</button>
                        </div>
                        <div class="star-rating">
                            <span>별점 : </span>
                            <span class="star"><span class="rating"></span></span>
                        </div>
                        <div>
                            <span>자체 평점 : </span><span class="grade"></span>
                        </div>
                    </div>
                <li>
        `).children[0];
    }

}

class RecList {
    constructor(root, placeList){
        this.root = root;
        this.deleteItems();

        placeList.forEach((place) => {
            this.renderItem(place);
        })
    }

    renderItem(place){
        const recItem = new RecItem(
            place.id,
            place.name, 
            place.road_adr, 
            place.map_link,
            place.x, 
            place.y,
            place.img_url,
            place.score,
            place.model_grade
            );
            //뒤에 2개 더 들어감
        this.root.appendChild(recItem.elements.root);
    }

    deleteItems(){
        this.root.textContent = "";
    }
}

// 지역, 카테고리

socket.on("rec_result", showRecResult);
function showRecResult(placeList){

    new RecList(document.querySelector(".recommandation__list"), placeList);
}