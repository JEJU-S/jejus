import express  from "express";
import {seePlan, editPlan, del} from "../controllers/planController"

const planRouter = express.Router();

import {protectMiddleware} from "../middleware";

// /plans/~~
planRouter.get("/:id([0-9a-f]{24})",protectMiddleware , seePlan);
planRouter.get("/:id([0-9a-f]{24})/edit", protectMiddleware, editPlan);
planRouter.get("/:id([0-9a-f]{24})/delete",protectMiddleware,  del);

export default planRouter
