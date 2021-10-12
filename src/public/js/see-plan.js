

const mapOptions = {
    center : new naver.maps.LatLng(33.50088510909299, 126.52906251498592),
    zoom : 10
};

const totMap = new naver.maps.Map(document.getElementById('totMap'), mapOptions);

const marker = new naver.maps.Marker({
    position : new naver.maps.LatLng(33.50088510909299, 126.52906251498592),
    map: totMap
});

const marker2 = new naver.maps.Marker({
    position : new naver.maps.LatLng(33.40002222233901, 126.55788921383366),
    map: totMap
});





