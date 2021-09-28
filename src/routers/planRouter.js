import express  from "express";
import {see, edit, del, chatting} from "../controllers/planController"

const planRouter = express.Router();

planRouter.get("/:id(\\d+)", see);
planRouter.get("/:id(\\d+)/edit", edit);
planRouter.get("/:id(\\d+)/delete", del);
planRouter.get("/:id(\\d+)/chatting", chatting);

export default planRouter
