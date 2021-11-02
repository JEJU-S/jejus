import express  from "express";
import {seePlan, editPlan, del, getCreatePlan, postCreatePlan, sendInvitation} from "../controllers/planController"

const planRouter = express.Router();

import {protectMiddleware} from "../middleware";

// /plans/~~
planRouter.get("/:id([0-9a-f]{24})",protectMiddleware , seePlan);
planRouter.post("/:id([0-9a-f]{24})",protectMiddleware , sendInvitation);

planRouter.get("/:id([0-9a-f]{24})/edit", protectMiddleware, editPlan);
planRouter.get("/:id([0-9a-f]{24})/delete",protectMiddleware,  del);

planRouter.route("/create", protectMiddleware).get(getCreatePlan).post(postCreatePlan);


export default planRouter
