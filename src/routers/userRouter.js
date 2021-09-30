import express from "express"; 
import {postEditProfile, getEditProfile, seeProfile, invitations, callback} from "../controllers/userController";

const userRouter = express.Router();

//로그인 작업 
userRouter.get("/callback", callback);

userRouter.get("/invitations", invitations);
userRouter.get("/:id(\\d+)", seeProfile);
userRouter.route("/:id(\\d+)/edit").get(getEditProfile).post(postEditProfile);
export default userRouter;