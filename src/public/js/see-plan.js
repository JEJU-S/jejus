

let totMap = document.getElementById('totMap');
const mapOptions = {
    center: new naver.maps.LatLng(33.405265881588015, 126.5546799108763),
    logoControl : false,
    zoom: 10,
};

const totPlanMap = new naver.maps.Map('totMap', mapOptions);

const markerList = [];


const marker = new naver.maps.Marker(
    {
        position : new naver.maps.LatLng(33.405265881588015, 126.5546799108763),
        map : totPlanMap
    }
);