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
    /*
    const position = new naver.maps.LatLngBounds(
        new naver.maps.LatLng(Number(lat) + 0.1, Number(lon) - 0.1),
        new naver.maps.LatLng(Number(lat) - 0.1, Number(lon) + 0.1)
    )
    new naver.maps.LatLng(lat - 0.1, lon + 0.1)
    
    map.panToBounds(position);
    */
    map.morph(new naver.maps.LatLng(lat, lon), 12);
}


export function removeMapMarker(marker){
    marker.setMap(null);
}

export function showOverall(){
    //map.setZoom(10);
    //map.updateBy(coord, 10);
    //
    map.morph(new naver.maps.LatLng(33.400273684416305, 126.5418323465492), 10)
}

export function recMarkerClick(lon, lat){
    map.morph(new naver.maps.LatLng(lat , lon), 14);


}

export function recListClick(lon, lat){
    map.panTo(new naver.maps.LatLng(lat , lon));
}



