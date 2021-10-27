"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fakeUser = exports.fakeTotPlan2 = exports.fakeTotPlan1 = exports.fakeRecPlace = exports.fakePlace = void 0;
// fake database로 추후 진짜 데이터베이스로 바꿔야 함
// 프론트엔드 자바스크립트 확인용으로 만듦
var fakeUser = {
  _id: "507f1f77bcf86cd799439011",
  name: "홍길동",
  image_url: "https://cdn.pixabay.com/photo/2021/07/20/03/39/fisherman-6479663__340.jpg",
  gmail: "fake123@gmail.com",
  totPlan_id: ["507f191e810c19729de860ea", "13jbrkw3494msd3j3456e245"]
};
exports.fakeUser = fakeUser;
var fakeTotPlan1 = {
  _id: "507f191e810c19729de860ea",
  title: "첫 제주도 여행🚗",
  admin: {
    name: "오정환",
    _id: "507f1f77bcf86cd799439011"
  },
  participants: [{
    name: "오정환",
    _id: "507f1f77bcf86cd799439011"
  }, {
    name: "박병준",
    _id: "33643fab36324ba879813855"
  }, {
    name: "최재원",
    _id: "20864abc9468cc7330683610"
  }, {
    name: "권내영",
    _id: "3952ab947607509ee9654795"
  }],
  day_plan: [{
    date: "2022-04-05",
    place: [{
      name: "봄날",
      adr: [33.46245977342849, 126.30958954597405],
      memo: "분위기 좋은 카페! 당근 케이크 맛있댔음ㅋㅋ🍰"
    }, {
      name: "닻",
      adr: [33.48995848264188, 126.39210188375121],
      memo: "딱새우 회, 고등어 숙성회"
    }, {
      name: "하나로마트 애월농협",
      adr: [33.46323342747784, 126.31984110269427],
      memo: "장봐서 숙소 ㄱㄱ 흑돼지 삼겹살"
    }, {
      name: "마농 게스트하우스",
      adr: [33.4466288993023, 126.30143679794665],
      memo: "불판 2만원 2인실 10만원"
    }]
  }, {
    date: "2022-04-06",
    place: [{
      name: "리치망고 협재점",
      adr: [33.40319523519324, 126.2513735721025],
      memo: "망고 스무디 한잔씩🥤"
    }, {
      name: "수우동",
      adr: [33.39777473078003, 126.24244591569902],
      memo: "해변 가기 전에 우동"
    }, {
      name: "금능해수욕장",
      adr: [33.390546865589286, 126.23541200459329],
      memo: "바다!!!!!!!여분 옷 챙기기"
    }, {
      name: "비파펜션",
      adr: [33.39890403001805, 126.24758608102232],
      memo: "뷰 엄청 이쁨!"
    }]
  }, {
    date: "2022-04-07",
    place: [{
      name: "블루사이공",
      adr: [33.456988964081596, 126.40809224025948],
      memo: "베트남 음식 존맛탱.."
    }, {
      name: "그라벨호텔제주",
      adr: [33.49217223903005, 126.42845651544157],
      memo: "여기 수영장 굳! 카메라 방수되는 케이스 가져가야 함"
    }]
  }, {
    date: "2022-04-08",
    place: [{
      name: "제주돔베고기집",
      adr: [33.48903195497423, 126.47794670980754],
      memo: "공항 가기 전에 돔베고기 먹기"
    }, {
      name: "제주 국제 공항",
      adr: [33.5070799881718, 126.49201453240686],
      memo: "12시 비행기!!! 11시까지 도착해야 함"
    }]
  }]
};
exports.fakeTotPlan1 = fakeTotPlan1;
var fakeTotPlan2 = {
  _id: "13jbrkw3494msd3j3456e245",
  title: "제주도 가족 여행🚌",
  admin: "홍길동",
  participants: ["홍길동", "홍두깨"],
  //start_date : "2022-04-05",
  //end_date : "2022-04-07",
  day_plan: [{
    date: "2022-04-05",
    place: [{
      name: "봄날",
      adr: [33.46245977342849, 126.30958954597405],
      memo: "분위기 좋은 카페! 당근 케이크 맛있댔음ㅋㅋ🍰"
    }, {
      name: "닻",
      adr: [33.48995848264188, 126.39210188375121],
      memo: "딱새우 회, 고등어 숙성회"
    }, {
      name: "하나로마트 애월농협",
      adr: [33.46323342747784, 126.31984110269427],
      memo: "장봐서 숙소 ㄱㄱ 흑돼지 삼겹살"
    }, {
      name: "마농 게스트하우스",
      adr: [33.4466288993023, 126.30143679794665],
      memo: "불판 2만원 2인실 10만원"
    }]
  }, {
    date: "2022-04-06",
    place: [{
      name: "리치망고 협재점",
      adr: [33.40319523519324, 126.2513735721025],
      memo: "망고 스무디 한잔씩🥤"
    }, {
      name: "수우동",
      adr: [33.39777473078003, 126.24244591569902],
      memo: "해변 가기 전에 우동"
    }, {
      name: "금능해수욕장",
      adr: [33.390546865589286, 126.23541200459329],
      memo: "바다!!!!!!!여분 옷 챙기기"
    }, {
      name: "비파펜션",
      adr: [33.39890403001805, 126.24758608102232],
      memo: "뷰 엄청 이쁨!"
    }]
  }, {
    date: "2022-04-07",
    place: [{
      name: "제주돔베고기집",
      adr: [33.48903195497423, 126.47794670980754],
      memo: "공항 가기 전에 돔베고기 먹기"
    }, {
      name: "제주 국제 공항",
      adr: [33.5070799881718, 126.49201453240686],
      memo: "12시 비행기!!! 11시까지 도착해야 함"
    }]
  }]
};
exports.fakeTotPlan2 = fakeTotPlan2;
var fakeRecPlace = {
  id: 1,
  name: "한라산",
  adr: [33.36193358861604, 126.52916341462316],
  summary: "한국에서 가장 높은 산봉우리인 순상 화산이며 낮에만 등산이 가능합니다.",
  img_url: "https://lh5.googleusercontent.com/p/AF1QipOl-UfARUHiDl5MtQNGXkBcj43f5pW_UDtQTUP9=w408-h306-k-no"
}; //실시간

exports.fakeRecPlace = fakeRecPlace;
var fakePlace = {
  id: 1,
  name: "봄날",
  adr: [33.46245977342849, 126.30958954597405],
  memo: "분위기 좋은 카페! 당근 케이크 맛있댔음ㅋㅋ🍰"
};
exports.fakePlace = fakePlace;