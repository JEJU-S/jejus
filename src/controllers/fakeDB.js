// fake database로 추후 진짜 데이터베이스로 바꿔야 함

export const fakeUser = {
    id : 1, 
    name : "김가짜",
    image_url : "https://cdn.pixabay.com/photo/2021/07/20/03/39/fisherman-6479663__340.jpg",
    gmail : "fake123@gmail.com",
    plan_id : []
}

export const fakeRecPlace = {
    id : 1,
    name : "한라산",
    adr : [33.36193358861604, 126.52916341462316],
    summary : "한국에서 가장 높은 산봉우리인 순상 화산이며 낮에만 등산이 가능합니다.",
    img_url : "https://lh5.googleusercontent.com/p/AF1QipOl-UfARUHiDl5MtQNGXkBcj43f5pW_UDtQTUP9=w408-h306-k-no",
}



export const fakePlace = {
   id : 1,
   name : "봄날",
   adr : [33.46245977342849, 126.30958954597405],
   memo : "분위기 좋은 카페! 당근 케이크 맛있댔음ㅋㅋ🍰"
}



export const fakeTotPlan = {
    id : 1,
    title : "첫 제주도 여행🚗",
    admin : "가짜",
    participants : ["민주", "유리", "가짜"],
    start_date : "2022-04-05",
    end_date : "2022-04-07",
    dayPlan : [
        { }, { }, { }
    ]
}



