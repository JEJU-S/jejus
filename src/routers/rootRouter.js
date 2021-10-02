import express from "express"; 
import {main ,login} from "../controllers/userController"

const rootRouter = express.Router();

rootRouter.get("/", main);

// google aouth2로 넘어감
rootRouter.get("/login", login);


export default rootRouter;
