
/*
const recplaceSchema = new mongoose.Schema({
    id: Number,
    name: String,
    road_adr: String,
    x : Number,
    y : Number,
    img_url: String,
    score: Number,
    map_link: String
})
*/
const sampleRecList = [];

const regionBtn = document.querySelector(".region-select");
const fakeRegion = "애월";

const categoryBtns = document.querySelectorAll(".recommandation__categories");
function selectCategory(event){
    const category = event.target;
    return category.textContent;
}

categoryBtns.forEach((btn) => {
    btn.addEventListener("click", selectCategory);
})


//******************** */
class RecItem {
    constructor(place_name, road_address_name, place_url, x, y, image_url, score){
        this.elements = {};

        this.elements.root = PlaceItem.createRoot();
        this.elements.title = this.elements.root.querySelector("span");
        this.elements.roadAdr = this.elements.root.querySelector("p");
        


    }

    static createRoot(){
        const range = document.createRange();
        range.selectNode(document.body);
        return range.createContextualFragment(`
                <li>
                    <img src="", alt="추천 장소">
                    <div>
                        <span></span>
                        <button class="more-btn"><span class="material-icons"></span>더보기</button>
                        <div class="wrap-star">
                            <div class="star-rating">
                                <span></span>
                            </div>
                        </div>
                        <span></span>
                        <span>A</span>
                    </div>
                <li>
        `).children[0];
    }

}

class RecList  {
    constructor(root, placeList){
        this.root = root;

        placeList.forEach((place) => {
            this.renderItem(place);
        })
    }

    renderItem(place){
        const placeItem = new PlaceItem(
            place.name, 
            place.road_adr, 
            place.map_link,
            place.x, 
            place.y,
            place.img_url,
            place.srore,
            );
            //뒤에 2개 더 들어감
        this.root.appendChild(placeItem.elements.root);
    }
}