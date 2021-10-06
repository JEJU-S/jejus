import express from "express"; 
import {postEditProfile, getEditProfile, seeProfile, callback, logout} from "../controllers/userController";

const userRouter = express.Router();
// google login api 처리하는 함수 사용
userRouter.get("/callback", callback);


// user profile
userRouter.get("/profile", seeProfile);


userRouter.get("/logout", logout);

// 아직 시작xx
userRouter.route("/profile/edit").get(getEditProfile).post(postEditProfile);
export default userRouter;