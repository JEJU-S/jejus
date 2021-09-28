import express from "express"; 
import {profile, edit, invitations, callback} from "../controllers/userController";

const userRouter = express.Router();


userRouter.get("/callback", callback);
userRouter.get("/invitations", invitations);
userRouter.get("/:id(\\d+)",profile );
userRouter.get("/:id(\\d+)/edit", edit);
export default userRouter;