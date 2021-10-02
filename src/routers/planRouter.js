import express  from "express";
import {seePlan, editPlan, del, chatting} from "../controllers/planController"

const planRouter = express.Router();


planRouter.get("/:id(\\d+)", seePlan);
planRouter.get("/:id(\\d+)/edit", editPlan);
planRouter.get("/:id(\\d+)/delete", del);
planRouter.get("/:id(\\d+)/chatting", chatting);

export default planRouter
