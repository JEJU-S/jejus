import express from "express"; 
import {postEditProfile, getEditProfile, seeProfile, callback, logout} from "../controllers/userController";
import {protectMiddleware} from "../middleware";

// /users/~~~


const userRouter = express.Router();
// google login api 처리하는 함수 사용
userRouter.get("/callback", callback);

userRouter.get("/logout", logout);
// user profile

userRouter.get("/:id([0-9a-f]{24})", protectMiddleware, seeProfile);
// 아직 시작xx
userRouter.route("/:id([0-9a-f]{24})/edit").get(getEditProfile).post(postEditProfile);



export default userRouter;