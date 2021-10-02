//goes to plan router

import { fakeUser } from "./fakeDB";
import { fakeTotPlan } from "./fakeDB";

// fake database(json) 추후 진짜 데이터베이스로 바꿔야 함
export const seePlan = (req, res) => 
{
    res.render(`see-plan`, {user : fakeUser, plan : fakeTotPlan});
}

export const editPlan = (req, res) => 
{
    res.render("edit-plan", {user : fakeUser, plan : fakeTotPlan});
}

// 관계자만 삭제 가능하게 만들어야 함
export const del = (req, res) => res.send("delete plans");
export const chatting = (req,res) => res.send("chatting pop up");
