//map init
 const mapOptions = {
    center : new naver.maps.LatLng(33.38722505430828, 126.54036671675767),
    zoom : 11,
    //maxZoom : 11,
};

const map = new naver.maps.Map(document.getElementById("map"), mapOptions);


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
        content : [
        `<div class='map-info'>info window</div>`,
        `   <h3>상호명</h3>`,
        `   <img src='사진'>`
        ].join('')


        
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








