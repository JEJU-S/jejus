import express from "express"; 
import {postEditProfile, getEditProfile, seeProfile, callback} from "../controllers/userController";

const userRouter = express.Router();
userRouter.get("/callback", callback);
userRouter.get("/profile", seeProfile);

// 아직 시작xx
userRouter.route("/profile/edit").get(getEditProfile).post(postEditProfile);
export default userRouter;