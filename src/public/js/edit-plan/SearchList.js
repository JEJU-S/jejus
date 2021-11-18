import {createMapMarker, removeMapMarker, mapPanToBound, listClick, searchMarkerClick} from "/public/js/edit-plan/Map.js";
import {searchMarkers} from "./Map.js"
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

        this.elements.marker = createMapMarker(x, y , "marker-search");
        searchMarkers.push(this.elements.marker);


        this.elements.moreButton.addEventListener("click", (event) => {
            window.open(place_url);
            event.stopPropagation();
        });
        
        this.elements.root.addEventListener("click", () => {
            
            this.elements.marker.setAnimation(1);
            console.log(this.elements.marker.getZIndex());
            /*
            if(this.elements.marker != undefined){
                removeMapMarker(this.elements.marker);
            }*/
            listClick(this.elements.marker);
        });
        
        this.elements.root.addEventListener("mouseleave", () => {
            if(this.elements.marker.getAnimation() !== null){
                this.elements.marker.setAnimation(null);
            }
        });
        
        naver.maps.Event.addListener(this.elements.marker, 'click', (event) => {
            
            searchMarkerClick(this.elements.marker, place_name, road_address_name);
            this.elements.root.scrollIntoView({behavior : 'smooth'});    
        })

        this.elements.root.addEventListener("dragstart", event => {

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
        for (const marker of searchMarkers) {
            marker.setMap(null);
        }
        searchMarkers.splice(0, searchMarkers.length);  

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

/*
document.querySelector("body").addEventListner("click", "");

*/

