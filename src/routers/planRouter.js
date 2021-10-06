import express  from "express";
import {seePlan, editPlan, del, chatting} from "../controllers/planController"

const planRouter = express.Router();


planRouter.get("/see", seePlan);
planRouter.get("/edit", editPlan);
planRouter.get("/delete", del);


// 안만들어도 됨
planRouter.get("/:id(\\d+)/chatting", chatting);

export default planRouter
