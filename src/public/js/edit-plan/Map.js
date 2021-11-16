
//map init
 const mapOptions = {
    center : new naver.maps.LatLng(33.38722505430828, 126.54036671675767),
    zoom : 11
};

const map = new naver.maps.Map(document.getElementById("map"), mapOptions);
export const recMarkers = [];
export const searchMarkers = [];
export const kanbanMarkers = [];

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

export function mapPanToBound(lon, lat){

    map.morph(new naver.maps.LatLng(lat, lon), 12);
}


export function removeMapMarker(marker){
    marker.setMap(null);
}

export function showOverall(){

    map.morph(new naver.maps.LatLng(33.400273684416305, 126.5418323465492), 10)
}

const recInfroWindow = new naver.maps.InfoWindow({
    content : '',
    backgroundColor: "#00000000",
    borderWidth: 0,
    disableAnchor: true
});
export function recMarkerClick(marker, category, place_name, road_address_name, image_url){
    recInfroWindow.setContent(
        [
            `<div class='map-info'>`,
            `   <img src=${image_url}>`,
            `   <div><h3>${place_name}</h3>`,
            `   <p>${road_address_name}</p></div></div>`
        ].join('')
    );
    
    /*
    recInfroWindow = new naver.maps.InfoWindow({
        content : [
        `<div class='map-info'>`,
        `   <img src=${image_url}>`,
        `   <div><h3>${place_name}</h3>`,
        `   <p>${road_address_name}</p></div></div>`
        ].join(''),
        backgroundColor: "#00000000",
        borderWidth: 0,
        disableAnchor: true
    });
    */

    if(recInfroWindow.getMap()){
        recInfroWindow.close();
    }else{
        recInfroWindow.open(map, marker);
    }
    map.panTo(marker.getPosition());
    //map.morph(marker.getPosition(), 14);
}

export function recListClick(lon, lat){
    map.panTo(new naver.maps.LatLng(lat , lon));
    //map.morph(new naver.maps.LatLng(lat , lon), 14);
    
}

export function listClick(marker){
    map.panTo(marker.getPosition());
}

const searchInfoWindow = new naver.maps.InfoWindow({
    content : ``,
    backgroundColor: "#00000000",
    borderWidth: 0,
    disableAnchor: true 
});

export function searchMarkerClick(marker, place_name, road_address_name){
    searchInfoWindow.setContent(
        [
            `<div class='map-info'>`,
            `   <div><h3>${place_name}</h3>`,
            `   <p>${road_address_name}</p></p></div>`
        ].join('')
    );
    
    /*
    searchInfoWindow = new naver.maps.InfoWindow({
        content : [
        `<div class='map-info search'>`,
        `   <div><h3>${place_name}</h3>`,
        `   <p>${road_address_name}</p></p></div>`
        ].join(''),
        backgroundColor: "#00000000",
        borderWidth: 0,
        disableAnchor: true 
    });
    */

    if(searchInfoWindow.getMap()){
        searchInfoWindow.close();
    }else{
        searchInfoWindow.open(map, marker);
    }
    map.panTo(marker.getPosition());
}


export async function removeMarkersFromMap(markers){
    for (const marker of markers) {
        await marker.setMap(null);
    }
    markers.splice(0, markers.length);  
    console.log(markers); 
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








