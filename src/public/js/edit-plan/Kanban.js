import {socket, planId} from "./communicate.js"

import {createMapMarker, removeMapMarker, mapPanToBound} from "/public/js/edit-plan/Map.js";
const fakeItems2 = [
    {
    _id : "507f191e810c19729de860e1",
    date : new Date("2021-05-04"),
    place : [
        {   
            _id : "5bf142459b72e12b2b1b2c11",
            name : "place 1",
            road_adr : "도로명 주소1",
            x : "126.52001020252465",
            y : "33.48137202695348",
            map_link : ""
        },
        {   
            _id : "5bf142459b72e12b2b1b2c12",
            name : "place 2",
            road_adr : "도로명 주소2",
            x : "126.53001020252465",
            y : "33.48437202695348",
            map_link : ""
        }
    ]},
    {
        _id : "507f191e810c19729de860e2",
        date : new Date("2021-05-05"),
        place : [
            {   
                _id : "5bf142459b72e12b2b1b2c13",
                name : "place 3",
                road_adr : "도로명 주소3",
                x : "126.54001020252465",
                y : "33.48137205695348",
                map_link : ""
            },
            {   
                _id : "5bf142459b72e12b2b1b2c14",
                name : "place 4",
                road_adr : "도로명 주소4",
                x : "126.55001020252465",
                y : "33.48137202695348",
                map_link : ""
            }
        ]},
        {
            _id : "507f191e810c19729de860e3",
            date : new Date("2021-05-06"),
            place : [
                {   
                    _id : "5bf142459b72e12b2b1b2c15",
                    name : "place 5",
                    road_adr : "도로명 주소5",
                    x : "126.56001020252465",
                    y : "33.48337202695348",
                    map_link : ""
                },
                {   
                    _id : "5bf142459b72e12b2b1b2c16",
                    name : "place 6",
                    road_adr : "도로명 주소6",
                    x : "126.57001020252465",
                    y : "33.42337202695348",
                    map_link : ""
                }
        ]}
]

const mapMarkerList = [];

class MapMarker {
    constructor(id, x, y){
        this.id = id;
        this.marker = createMapMarker(x, y);
    } 
}

class DropZone {
    static createDropZone(){
		const range = document.createRange();
		range.selectNode(document.body);
		const dropZone = range.createContextualFragment(`
			<div class="kanban__dropzone"></div>
		`).children[0];

        //효과
		dropZone.addEventListener("dragover", (event) => {
			event.preventDefault();
			dropZone.classList.add("kanban__dropzone--active");
		});

        dropZone.addEventListener("dragleave", (event) => {
            dropZone.classList.remove("kanban__dropzone--active");
        });
        //***********

        let droppedItemElement;
        // 새로운 아이템 추가, 아이템 이동✨
        dropZone.addEventListener("drop", (event) => {
            const idReg = new RegExp("[0-9a-f]{24}");
            event.preventDefault();
            dropZone.classList.remove("kanban__dropzone--active");
            console.log(typeof(event.dataTransfer.getData("text/plain")));
        
            // 새로운 item 추가됐을 때
            if(!idReg.test(event.dataTransfer.getData("text/plain"))){
                const newPlace = JSON.parse(event.dataTransfer.getData("text/plain"));
                console.log(newPlace);
                // DB에서 place item으로 부여해준다*************
                //addPlaceToKanbanList(id, name, road_adr, x, y, map_link);
                //진짜 아이디 넣어 주면 됨
                const newItem = this.addPlaceToKanbanList("507f191e810c19729de860ab", newPlace.name, newPlace.road_adr, newPlace.x, newPlace.y, newPlace.map_link);
                //addPlaceToKanbanList();
                droppedItemElement = newItem.elements.root;
            }
            else{
            const itemId = event.dataTransfer.getData("text/plain");
            droppedItemElement = document.querySelector(`[data-id="${itemId}"]`);
            console.log(droppedItemElement);
            }

            const columnElement = dropZone.closest(".kanban__column");
            const columnId = columnElement.dataset.id;

            console.log("columnElement :", columnElement);
            console.log("columnId :", columnId);
            const dropZonesInColumn = Array.from(columnElement.querySelectorAll(".kanban__dropzone"));
            const droppedIndex = dropZonesInColumn.indexOf(dropZone);
            console.log(droppedIndex);

            const insertAfter = dropZone.parentElement.classList.contains("kanban__item") ? dropZone.parentElement : dropZone;

            if(droppedItemElement.contains(dropZone)){
                return;
            }

            console.log(insertAfter);
            insertAfter.after(droppedItemElement);
            //console.log(itemId);
            
            //소켓으로 보내준다 => ******DB에 저장
        })
        return dropZone;
    }

    //id를 가진 Item으로 만들어준다 
    static addPlaceToKanbanList(id, name, road_adr, x, y, map_link){
        const newItem = new Item(id, name, road_adr, x, y, map_link);
        return newItem;
    }
}

// map marker도 여기 같이 넣자
class Item {
    constructor(id, name, road_adr, x, y, map_link){

        const bottomDropZone = DropZone.createDropZone();

        this.elements = {};
        this.elements.root = Item.createRoot();
        
        this.elements.name = this.elements.root.querySelector(".kanban__item-name");
        this.elements.road_adr = this.elements.root.querySelector(".kanban__item-road_adr");
        this.elements.delBtn = this.elements.root.querySelector("button");
        //this.elements.input = this.elements.root.querySelector(".kanban__item-input");
        
        this.elements.name.textContent = name;
        this.elements.road_adr.textContent = road_adr;
        
        this.elements.root.dataset.id = id;
        this.elements.root.dataset.x = x; // 경도
        this.elements.root.dataset.y = y; // 위도
        this.elements.root.dataset.map_link = map_link;
        
        //**** */
        mapMarkerList.push(new MapMarker(this.elements.root.dataset.id, x, y));
        console.log(mapMarkerList);
        //this.elements.marker = createMapMarker(x, y);

        
        //this.elements.input.textContent = content;
        //this.content = content;

        this.elements.root.appendChild(bottomDropZone);
        
        // 데이터베이스, 서버 작업 필요✨
        this.elements.delBtn.addEventListener("click", () => {
            const check = confirm("삭제하시겠습니까?");
            if (check){
                
                /*
                fakeItems2.find(element => element._id == id).place.forEach((placeItem) => {
                });
                fakeItems.splice(id, 1); //DB에서 삭제*******
                */
               //소켓서버에 보냄 💨
               socket.emit("delete_from_list", this.elements.root.dataset.id, planId);

               // map 삭제 find index 왜 안되는지 찾아보기💦
                let mapIndex;
                mapMarkerList.forEach((mapMarker, index) => {
                    if(mapMarker.id == this.elements.root.dataset.id){
                        removeMapMarker(mapMarker.marker);   
                        mapIndex = index;
                    } 
                })
                if(mapIndex != undefined){
                    console.log(mapMarkerList);
                    mapMarkerList.splice(mapIndex, 1);
                }
               /*
                if(markerIndex != -1){
                    removeMapMarker(mapMarkerList[markerIndex].marker);
                    mapMarkerList.splice(markerIndex, 1);
                }
                */
                this.elements.root.parentElement.removeChild(this.elements.root); // 컬럼에서 삭제
            }
        });

        this.elements.root.addEventListener("dragstart", event => {
            event.dataTransfer.setData("text/plain", id);
        });

        // 추후 수정 필요!!!!!!!!!!!!!!!!
        this.elements.name.addEventListener("drop", event => {
            event.preventDefualt();
        })
        this.elements.road_adr.addEventListener("drop", event => {
            event.preventDefualt();
        })

        this.elements.root.addEventListener("click", event => {
            mapPanToBound(this.elements.root.dataset.x, this.elements.root.dataset.y);
        })
    }

    static createRoot(){
        const range = document.createRange();
        range.selectNode(document.body);

        return range.createContextualFragment(`
            <div class="kanban__item" draggable="true">
                <div class="kanban__item-name"></div>
                <div class="kanban__item-road_adr"></div>
                <button><span class="material-icons">backspace</span></button>
            </div>
        `).children[0];
    }
}

 class Column {
	constructor(id, title) {    

        const topDropZone = DropZone.createDropZone();

        //하위 element
		this.elements = {};
		this.elements.root = Column.createRoot();
		this.elements.title = this.elements.root.querySelector(".kanban__column-title");
		this.elements.items = this.elements.root.querySelector(".kanban__column-items");
        
        this.elements.root.dataset.id = id;
        this.elements.title.textContent = title;
        this.elements.items.appendChild(topDropZone);

        // 각 컬럼 id 값으로 아이템 불러옴 서버에서 받아야 함
        /*
		KanbanAPI.getItems(id).forEach(item => {
			this.renderItem(item);
		});
        */ 

        //추후 수정(실제 데이터로)
        fakeItems2.find(element => element._id == id).place.forEach((placeItem) => {
            this.renderItem(placeItem);
        });
    }

	static createRoot() {
		const range = document.createRange();
		range.selectNode(document.body);
		return range.createContextualFragment(`
			<div class="kanban__column">
				<div class="kanban__column-title"></div>
				<div class="kanban__column-items"></div>
			</div>
		`).children[0];
	}

    renderItem(data){
        //ToDo : create Item Instance
        const item = new Item(data._id, data.name, data.road_adr, data.x, data.y, data.map_link);
        this.elements.items.appendChild(item.elements.root);
    }
}

export default class Kanban {
	constructor(root, dayPlanList) {
		this.root = root;
        console.log(this.root);

		Kanban.columns(dayPlanList).forEach(column => {
            const columnView = new Column(column.id, column.title);
            this.root.appendChild(columnView.elements.root);
		});
	}
    // 서버에서 day column 받아와야 함 
	static columns(dayPlanList) {
        console.log(dayPlanList);
        const dayPlanListColumns = [];

        dayPlanList.forEach((dayPlan, index) => {   
            dayPlanListColumns.push({
                id : dayPlan._id,
                title : `Day ${index + 1}`
            });
        });

        return dayPlanListColumns;
    }

}

const kanbanList = new Kanban( document.querySelector(".kanban"), fakeItems2);


socket.on("delete_from_list", deleteFromList);

function deleteFromList(itemId){
    console.log("***********삭제 시작");
    console.log(kanbanList.root);
    //item 삭제
    const deletedItem = kanbanList.root.querySelector(`div[data-id="${itemId}"]`);

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

