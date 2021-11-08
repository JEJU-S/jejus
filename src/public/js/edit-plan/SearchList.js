import {createMapMarker, removeMapMarker, mapPanToBound} from "/public/js/edit-plan/Map.js";

/*****************************************************************/
class PlaceItem {
    constructor(place_name, road_address_name, place_url, x, y){
        this.elements = {};

        this.elements.root = PlaceItem.createRoot();
        this.elements.title = this.elements.root.querySelector("span");
		this.elements.roadAdr = this.elements.root.querySelector("p");

        this.elements.title.textContent = place_name;
        this.elements.roadAdr.textContent = road_address_name;
        this.elements.root.dataset.x = x;
        this.elements.root.dataset.y = y;


		this.elements.moreButton = this.elements.root.querySelector("button");
        this.elements.moreButton.textContent = "더보기"
        this.elements.moreButton.classList = "more-btn";


        this.elements.moreButton.addEventListener("click", (event) => {
            window.open(place_url);
            event.stopPropagation();
        });
        // 마우스가 올라갈 시 맵에 띄워줌 mouseenter
        this.elements.root.addEventListener("mouseenter", () => {
            this.elements.marker = createMapMarker(x, y);
            mapPanToBound(x, y);
        });

        this.elements.root.addEventListener("mouseleave", () => {
          if(this.elements.marker != undefined){
            removeMapMarker(this.elements.marker);
          }
        });

        this.elements.root.addEventListener("dragstart", event => {
            //map 마커 지워준다 => item 마커로 바뀌게
            if(this.elements.marker != undefined){
              removeMapMarker(this.elements.marker);
            }

          // 객체 전달
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
        <li draggable="true">
            <span></span>
            <button></button>
            <p></p>
        </li>
        `).children[0];
    }
}

export default class SearchList {
    
    constructor(root, placeList){
        
        this.root = root;
        this.deleteItems();

        placeList.forEach((place) => {
            this.renderItem(place);
        })
    }
    renderItem(place){//서버에서 받아서 render
        //ToDo : create Place items Instance
        const placeItem = new PlaceItem(
			place.place_name, 
            place.road_address_name, 
            place.place_url,
            place.x, place.y);
        
        this.root.appendChild(placeItem.elements.root);
    }

    deleteItems(){
        this.root.textContent = "";
    }
}


