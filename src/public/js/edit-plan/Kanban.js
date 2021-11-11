import {socket, planId} from "./communicate.js"
import {createMapMarker, removeMapMarker, mapPanToBound} from "/public/js/edit-plan/Map.js";

export const mapMarkerList = [];

class MapMarker {
    constructor(id, x, y){
        this.id = id;
        this.marker = createMapMarker(x, y, "marker-user");
    } 
}

class DropZone {
    constructor(){
        this.root = createDropZone();
    }

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

        // 새로운 아이템 추가, 아이템 이동
        //DB, SOCKET 작업 필요✨
        dropZone.addEventListener("drop", (event) => {
            const idReg = new RegExp("[0-9a-f]{24}");
            event.preventDefault();
            dropZone.classList.remove("kanban__dropzone--active");
            console.log(typeof(event.dataTransfer.getData("text/plain")));

            let droppedItemElement;
            // 새로운 item 추가됐을 때
            if(!idReg.test(event.dataTransfer.getData("text/plain"))){
                const newPlace = JSON.parse(event.dataTransfer.getData("text/plain"));
                console.log(newPlace); 
               

                // DB에서 place item으로 부여해준다*************
                //addPlaceToKanbanList(id, name, road_adr, x, y, map_link);
                //진짜 아이디 넣어 주면 됨
                //const newItem = this.addPlaceToKanbanList("507f191e810c19729de860ab", newPlace.name, newPlace.road_adr, newPlace.x, newPlace.y, newPlace.map_link);
                
                //droppedItemElement = newItem.elements.root;

                const columnElement = dropZone.closest(".kanban__column");
                const columnId = columnElement.dataset.id;
                const dropZonesInColumn = Array.from(columnElement.querySelectorAll(".kanban__dropzone"));
                const droppedIndex = dropZonesInColumn.indexOf(dropZone);
                console.log(droppedIndex);

                 //socket server로 전송💨
                socket.emit("add_to_placelist", newPlace, columnId, droppedIndex, planId);
                /*
                //console.log("columnElement :", columnElement);
                //console.log("columnId :", columnId);

                const insertAfter = dropZone.parentElement.classList.contains("kanban__item") ? dropZone.parentElement : dropZone;

                if(droppedItemElement.contains(dropZone)){
                    return;
                }
                //socket server로 전송💨
                socket.emit("add_to_placelist", newPlace, columnId, planId);


                //더해주는 부분임
                insertAfter.after(droppedItemElement);
                */

            }
            else{
                const itemId = event.dataTransfer.getData("text/plain");
                droppedItemElement = document.querySelector(`.kanban div[data-id="${itemId}"]`);
                console.log(droppedItemElement);
                
                //****************/
                if (droppedItemElement === null){
                    return;
                }

                /************************* */
                const columnElement = dropZone.closest(".kanban__column");
                const columnId = columnElement.dataset.id;

                //console.log("columnElement :", columnElement);
                //console.log("columnId :", columnId);
                const dropZonesInColumn = Array.from(columnElement.querySelectorAll(".kanban__dropzone"));
                const droppedIndex = dropZonesInColumn.indexOf(dropZone);
                console.log(droppedIndex);

                const originColumnId = droppedItemElement.closest(".kanban__column").dataset.id;

                socket.emit("move_in_placelist", itemId, originColumnId, columnId, droppedIndex, planId);
                /*
                const insertAfter = dropZone.parentElement.classList.contains("kanban__item") ? dropZone.parentElement : dropZone;

                if(droppedItemElement.contains(dropZone)){
                    return;
                }

                console.log(insertAfter);
                insertAfter.after(droppedItemElement);
                //console.log(itemId);
                */
            }
        })


        return dropZone;
    }
}

// map marker도 여기 같이 넣자
export class Item {
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
                
                const parentColumnId = this.elements.root.parentNode.parentNode.dataset.id;

                //소켓서버에 보냄 💨
                socket.emit("delete_from_list", this.elements.root.dataset.id, parentColumnId, planId);


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
	constructor(id, title, placeList) {    

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
        placeList.find(element => element._id == id).place.forEach((placeItem) => {
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

export class Kanban {
	constructor(root, placeList) {
		this.root = root;
        console.log(this.root);

		Kanban.columns(placeList).forEach(column => {
            const columnView = new Column(column.id, column.title, placeList);
            this.root.appendChild(columnView.elements.root);
		});
	}
    // 서버에서 day column 받아와야 함 
	static columns(placeList) {
        console.log(placeList);
        const placeListColumns = [];

        placeList.forEach((dayPlan, index) => {   
            placeListColumns.push({
                id : dayPlan._id,
                title : `Day ${index + 1}`
            });
        });

        return placeListColumns;
    }

}
