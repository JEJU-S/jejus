import dotdev from "dotenv";
dotdev.config();
//goes to plan router


// fake database(json) 추후 진짜 데이터베이스로 바꿔야 함
import { fakeTotPlan1, fakeTotPlan2} from "./fakeDB";

//사용자 마다 완성된 plan 보여주기 위한 것
export const seePlan = (req, res) => 
{
    const {id} = req.params;
    // 같은 id 값을 가지고 있는 plan 가지고 오기

    //**DB** : => user, user가 가지고 있는 plan목록, 페이지에서 보여주고 있는 total plan
    res.render(`see-plan`, {
        user : req.session.user,
        totPlanTitles : req.session.totPlanTitleList,
        totPlan : fakeTotPlan1,
        map_cl : process.env.MAP_CLIENT
    });
}
 
export const editPlan = (req, res) => 
{
    //**DB** : => user, 페이지에서 보여주고 있는 total plan
    res.render("edit-plan");
}


export const createPlan = (req, res) => {
    res.render("create-plan", {user : req.session.user, totPlanTitles : req.session.totPlanTitleList });
}

// 처음 만든 사람만 삭제 가능하게 만들어야 함
export const del = (req, res) => res.send("delete plans");

