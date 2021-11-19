
//map init
 const mapOptions = {
    center : new naver.maps.LatLng(33.38722505430828, 126.54036671675767),
    zoom : 11
};

export const map = new naver.maps.Map(document.getElementById("map"), mapOptions);
export const recMarkers = [];
export const searchMarkers = [];
export const kanbanMapMarkers = [];

export function createMapMarker(lon, lat, image){
    const marker = new naver.maps.Marker({  // 위도 경도
            position : new naver.maps.LatLng(lat, lon),
            map : map,
            icon : {
                url : `/public/images/${image}.png`,
                scaledSize : new naver.maps.Size(25, 40),
            }
        })
    return marker;
}

/*
const kanbanPolyPath = [];
let kanbanPolyLine;

function drawKanbanPolyLine(){
    console.log(kanbanMapMarkers);
    if(kanbanPolyLine != undefined && kanbanPolyLine.getMap() != null){
        kanbanPolyLine.setMap(null);
        kanbanPolyPath.length = 0;
    }

    kanbanMapMarkers.forEach(root => {
        kanbanPolyPath.push(root.marker.getPosition());
    });

     if(kanbanPolyPath.length > 1){
        kanbanPolyLine = new naver.maps.Polyline({
            map : map,
            path : kanbanPolyPath,
            strokeWeight : 2,
            strokeOpacity : 0.9,
            strokeColor : '#4169E1',
            strokeStyle : 'shortdash',
            endIcon : 1
        }) 
    }
}
*/

export function mapPanToBound(lon, lat){

    map.morph(new naver.maps.LatLng(lat, lon), 12);
}


export function removeMapMarker(marker){
    marker.setMap(null);
}

export function showOverall(){

    map.morph(new naver.maps.LatLng(33.400273684416305, 126.5418323465492), 10)
}

const infoWindow = new naver.maps.InfoWindow({
    content : '',
    backgroundColor: "#00000000",
    borderWidth: 0,
    disableAnchor: true
});

//
let colorChangedRoot;
export function recMarkerClick(marker, category, place_name, road_address_name, image_url, root){
    if(colorChangedRoot != undefined){
        colorChangedRoot.style.backgroundColor = "#ffffff";
    }
    if(infoWindow.getMap()){
        infoWindow.close();
    }
    infoWindow.setContent(
        [
            `<div class='map-info' ondragstart="return false" onselectstart="return false">`,
            `   <img src=${image_url} draggable='false'>`,
            `   <div><h3>${place_name}</h3>`,
            `   <p>${road_address_name}</p></div></div>`
        ].join('')
    );
    
    if(infoWindow.getMap()){
        infoWindow.close();
    }else{
        infoWindow.open(map, marker);
    }
    map.panTo(marker.getPosition());
    root.style.backgroundColor = "whitesmoke";
    colorChangedRoot = root;

    setTimeout(() => {
        root.scrollIntoView({
           behavior: 'smooth'
        });
     });
}

export function searchMarkerClick(marker, place_name, road_address_name){
    if(infoWindow.getMap()){
        infoWindow.close();
    }

    infoWindow.setContent(
        [
            `<div class='map-info search' ondragstart="return false" onselectstart="return false">`,
            `   <div><h3>${place_name}</h3>`,
            `   <p>${road_address_name}</p></p></div>`
        ].join('')
    );
    
    if(infoWindow.getMap()){
        infoWindow.close();
    }else{
        infoWindow.open(map, marker);
    }
    map.panTo(marker.getPosition());
}

export function kanbanMarkerClick(marker, place_name, road_address_name){
    if(infoWindow.getMap()){
        infoWindow.close();
    }

    infoWindow.setContent(
        [
            `<div class='map-info search' ondragstart="return false" onselectstart="return false">`,
            `   <div><h3>${place_name}</h3>`,
            `   <p>${road_address_name}</p></p></div>`
        ].join('')
    );
    
    if(infoWindow.getMap()){
        infoWindow.close();
    }else{
        infoWindow.open(map, marker);
    }
    map.panTo(marker.getPosition());
}

naver.maps.Event.addListener(map, 'click', (event) => {
    if(infoWindow.getMap()){
        infoWindow.close();
    }
    if(colorChangedRoot != undefined){
        colorChangedRoot.style.backgroundColor = "#ffffff";
    }
})

export function recListClick(lon, lat){
    map.panTo(new naver.maps.LatLng(lat , lon));
    
}

export function listClick(marker){
    map.panTo(marker.getPosition());
}

export function removeMarkersFromMap(markers){
    if(infoWindow.getMap()){
        infoWindow.close();
    }
    
    for (const marker of markers) {
       marker.setMap(null);
    }
    markers.splice(0, markers.length);  
}

/*
naver.maps.Event.addListener(map, 'zoom_changed', () => {
    updateMarkers(recMarkers);
});

naver.maps.Event.addListener(map, 'dragend', () => {
    updateMarkers(recMarkers);
});

function updateMarkers(markers){
    const mapBound = map.getBounds();
    console.log(mapBound);

    let position;
    console.log(markers);
    recMarkers.forEach((marker) => {
        position = marker.getPosition();

        if(mapBound.hasLatLing(position)) {
            showMarker(marker);
        }else{
            hideMarker(marker);
        }
    });
}

function showMarker(marker){
    if(marker.setMap()) return;
    marker.setMap(map);
}

function hideMarker(marker){
    if(!marker.setMap()) return;
    marker.setMap(null);
}
*/








