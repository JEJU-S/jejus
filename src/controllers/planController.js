//goes to plan router

import { fakeUser } from "./fakeDB";
import { fakeTotPlan } from "./fakeDB";

// fake database(json) 추후 진짜 데이터베이스로 바꿔야 함

//사용자 마다 완성된 plan 보여주기 위한 것
export const seePlan = (req, res) => 
{

    
    //**DB** : => user, user가 가지고 있는 plan목록, 페이지에서 보여주고 있는 total plan
    res.render(`see-plan`, {user : fakeUser, plan : fakeTotPlan});
}
 
export const editPlan = (req, res) => 
{


    //**DB** : => user, 페이지에서 보여주고 있는 total plan
    res.render("edit-plan", {user : fakeUser, plan : fakeTotPlan});
}

//----------아직 작업 x ------------

// 처음 만든 사람만 삭제 가능하게 만들어야 함
export const del = (req, res) => res.send("delete plans");
export const chatting = (req,res) => res.send("chatting pop up");
