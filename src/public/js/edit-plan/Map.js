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

export function recMarkerClick(marker){
    const infoWindow = new naver.maps.InfoWindow({
        content : `<div>info window</div>`



        
    });

    if(infoWindow.getMap()){
        infoWindow.close();
    }else{
        infoWindow.open(map, marker);
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

export function searchMarkerClick(marker){
    const infoWindow = new naver.maps.InfoWindow({
        content : `<div>info window</div>`



        
    });
    
    if(infoWindow.map){
        infoWindow.close();
    }else{
        infoWindow.open(map, marker);
    }
    map.panTo(marker.getPosition());
}

let temp = 0;
export async function removeMarkersFromMap(markers){
    for (const marker of markers) {
        await marker.setMap(null);
        temp++;
    }
    console.log(temp);
    temp = 0;
    console.log(markers.length);
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








