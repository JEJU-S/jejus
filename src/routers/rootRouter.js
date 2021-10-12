import express from "express"; 
import {main ,login} from "../controllers/userController"
import {loggedInMiddleware} from "../middleware";


const rootRouter = express.Router();

rootRouter.get("/", loggedInMiddleware, main);

// google aouth2로 넘어감
rootRouter.get("/login", loggedInMiddleware, login);


export default rootRouter;
