import dotdev from "dotenv";
dotdev.config();

// fake database(json) 추후 진짜 데이터베이스로 바꿔야 함
import { fakeTotPlan1, fakeTotPlan2} from "./fakeDB";

//사용자 마다 완성된 plan 보여주기 위한 것
export const seePlan = (req, res) => 
{
    const {id} = req.params;

    //**DB** : => // 같은 id 값을 가지고 있는 plan 가지고 오기, user, user가 가지고 있는 plan목록, 페이지에서 보여주고 있는 total plan
    res.render(`see-plan`, {
        user : req.session.user,
        totPlanTitles : req.session.totPlanTitleList,
        totPlan : fakeTotPlan1,
        map_cl : process.env.MAP_CLIENT
    });
}

export const sendInvitation = (req, res) => {
    //Database 작업(초대장 전송)
    const {id} = req.params; //plan id
    const {gmail} = req.body; //초대장을 보낼 이메일

    //**DB
    
    res.redirect(`/plans/${id}`);
}
 
export const editPlan = (req, res) => 
{
    // database => 접근하고자 하는 plan id를 통해 user가 plan 사용자에 포함되어있는지 확인
    // 포함되어있으면 들어가게, 아니면 접근 x 하게 만들어야 함
    const {id} = req.params;
    
    res.render("socket", {
        user : req.session.user,
        totPlan : fakeTotPlan1,
        map_cl : process.env.MAP_CLIENT
    });
    
    /*
    res.render("edit-plan", {
        user : req.session.user,
        totPlan : fakeTotPlan1,
        map_cl : process.env.MAP_CLIENT
    });
    */
}

export const getCreatePlan = (req, res) => {

    res.render("create-plan", {user : req.session.user, totPlanTitles : req.session.totPlanTitleList });
}

export const postCreatePlan = (req, res) => {
    const {title, dates} = req.body;
    console.log("여행 계획 : " , title, dates);
    const days = dates.split("~");

    let startDate = new Date(days[0]);
    let endDate =  new Date(days[1]);


    startDate.setDate(startDate.getDate() + 1);
    endDate.setDate(endDate.getDate() + 1);



    let tempDate = new Date(startDate);
    const dayArray = [];

    for(tempDate; tempDate <= endDate; tempDate.setDate(tempDate.getDate() + 1)){
        dayArray.push(new Date(tempDate));
    }
    

    
    // database => 새 plan 생성 뒤 user에 추가




    res.redirect(`/users/${req.session.user._id}`); 
}

// admin만 삭제 가능하게 만들어야 함 아직 작업 x
export const del = (req, res) => res.send("delete plans");

