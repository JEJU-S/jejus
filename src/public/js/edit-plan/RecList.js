
import {socket} from "./communicate.js";
import {createMapMarker, recMarkerClick, recListClick, removeMapMarker, mapPanToBound, showOverall} from "/public/js/edit-plan/Map.js";

const recMarkerList = [];
/******************************** */

const regionBackground = document.getElementById('regionplace');
const regionSelectBtn = document.getElementById('regionbtn');
const jejuRegion = document.getElementsByClassName("jeju-region");
const closeBtn = document.querySelector(".region-close");

regionSelectBtn.addEventListener('click', regionSelect);
function regionSelect() {
    regionBackground.style.display='block';
    regionBackground.style.opacity='1';
}

function closeRegionSelect(){
    regionBackground.style.display='none';
    regionBackground.style.opacity='0';   
}

for (let i = 0; i < jejuRegion.length; i++) {
    let eachjejuRegion = jejuRegion[i];
    eachjejuRegion.addEventListener('click', getRegionSelect);
    eachjejuRegion.addEventListener('click', closeRegionSelect);
}

closeBtn.addEventListener('click',closeRegionSelect);
/***********************/

const categoryBtns = document.querySelectorAll(".recommandation__categories");
categoryBtns.forEach((btn) => {
    btn.addEventListener("click", selectCategory);
})

let selectedRegion = "전체";
// 지역 고르기
function getRegionSelect(event){
    document.querySelector(".md-2").style.display = "none";
    selectedRegion = event.target.alt;

    const imgIcon = regionSelectBtn.querySelector("img");
    imgIcon.style.display = "flex";
    imgIcon.src = `/public/images/${event.target.dataset.icon}.png`;
    imgIcon.alt = event.target.alt;

    document.querySelector("#region").textContent = selectedRegion;


    
    document.querySelectorAll(".category").forEach((btn) => {
        btn.style.backgroundColor = "#20253b";
        btn.style.color = "#ffffff";
    })

    document.querySelector(".category[data-category='전체']").style.backgroundColor = "#ffffff";
    document.querySelector(".category[data-category='전체']").style.color = "#20253b";

    for (const marker of recMarkerList) {
        marker.setMap(null);
    }
    recMarkerList.splice(0, recMarkerList.length);  
    //서버 전송💨
    socket.emit("rec_keyword", selectedRegion, "전체");
}



// 카테고리 고르기
function selectCategory(event){
    const category = event.target.closest('div').dataset.category;
    console.log(category);
    const selectedCategory = document.querySelector(`.category[data-category=${category}]`);
    
    document.querySelector(".recommandation__list").textContent = "";
    for (const marker of recMarkerList) {
        marker.setMap(null);
    }
    recMarkerList.splice(0, recMarkerList.length);   

    if(selectedCategory.style.backgroundColor === "rgb(255, 255, 255)"){
        selectedCategory.style.backgroundColor = "#20253b";
        selectedCategory.style.color = "#ffffff";
        return;
    }

    document.querySelectorAll(".category").forEach((btn) => {
        btn.style.backgroundColor = "#20253b";
        btn.style.color = "#ffffff";
    })

    selectedCategory.style.backgroundColor = "#ffffff";
    selectedCategory.style.color = "#20253b";

    socket.emit("rec_keyword", selectedRegion, category);
}


function matchCategoryMarkerImg(category){
    let image = "";
    switch(category){
        case "TOUR" :
            image = "marker-rec-tour";
            break;
        case "FOOD" :
            image = "marker-rec-resturant";  
            break;       
        case "CAFE" : 
            image = "marker-rec-cafe";
            break;
    }
    return image;
}

class RecItem {
    constructor(category, place_name, place_url, road_address_name, x, y, image_url, score, model_rank){
        this.elements = {};
        this.elements.root = RecItem.createRoot();
        this.elements.img = this.elements.root.querySelector("img");
        this.elements.name = this.elements.root.querySelector(".reco-title");
        this.elements.moreBtn = this.elements.root.querySelector("button");
        this.elements.rating = this.elements.root.querySelector(".rating");
        this.elements.grade = this.elements.root.querySelector(".grade");

        this.elements.img.src = (image_url != 0)? image_url : "/public/images/default-image.png";
    
        this.elements.img.alt= "추천 장소";
        this.elements.name.textContent = place_name;

        this.elements.root.dataset.x = x;
        this.elements.root.dataset.y = y;
        this.elements.root.dataset.road_adr = road_address_name;
        
        //별점 비율
        this.elements.rating.style.width = `${score/5 * 100}%`;
        this.elements.grade.textContent = model_rank;

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

        matchCategoryMarkerImg(category);
        this.elements.marker = createMapMarker(x, y, matchCategoryMarkerImg(category));
        recMarkerList.push(this.elements.marker);

        
        this.elements.root.addEventListener("click", () => {
            this.elements.marker.setAnimation(1);
            console.log(this.elements.marker.getZIndex());
            this.elements.marker.setZIndex(10);
            recListClick(x, y);
            
        });     
        this.elements.root.addEventListener("mouseleave", () => {
            if(this.elements.marker.getAnimation() !== null)
                {
                    this.elements.marker.setAnimation(null);
                }
                this.elements.marker.setZIndex(null);
        }); 
        
        naver.maps.Event.addListener(this.elements.marker, 'click', (event) => {
            recMarkerClick(this.elements.marker);
            this.elements.root.scrollIntoView({behavior : 'smooth'});
        })
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
                            <button class="more-btn"><span class="material-icons">open_in_new</span></button>
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
            place.category, 
            place.name,
            place.map_link,
            place.road_adr,
            place.x,
            place.y,
            place.image_url,
            place.score,
            place.model_rank
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
    showOverall();
}