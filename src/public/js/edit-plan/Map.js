//map init
 const mapOptions = {
    center : new naver.maps.LatLng(33.38722505430828, 126.54036671675767),
    zoom : 10,
    //maxZoom : 11,
};

const map = new naver.maps.Map(document.getElementById("map"), mapOptions);


export function createMapMarker(lon, lat, option){
    /*
    switch(option){
    case "rec" : "red";
    case "srh" : "yellow";
    case "kbn" : "blue";
    }
    */
    const marker = new naver.maps.Marker({  // 위도 경도
            position : new naver.maps.LatLng(lat, lon),
            map : map
        })
    return marker;
}

export function mapPanToBound(lon, lat){
    const position = new naver.maps.LatLngBounds(
        new naver.maps.LatLng(Number(lat) + 0.1, Number(lon) - 0.1),
        new naver.maps.LatLng(Number(lat) - 0.1, Number(lon) + 0.1)
    )
    new naver.maps.LatLng(lat - 0.1, lon + 0.1)
    map.panToBounds(position);
}


export function removeMapMarker(marker){
    marker.setMap(null);
}


