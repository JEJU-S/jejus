import express from "express"; 
import {main ,login} from "../controllers/userController"

const globalRouter = express.Router();

globalRouter.get("/", main);
globalRouter.get("/login", login);


export default globalRouter;
