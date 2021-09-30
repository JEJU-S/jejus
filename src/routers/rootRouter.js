import express from "express"; 
import {main ,login} from "../controllers/userController"

const rootRouter = express.Router();

rootRouter.get("/", main);
rootRouter.get("/login", login);


export default rootRouter;
