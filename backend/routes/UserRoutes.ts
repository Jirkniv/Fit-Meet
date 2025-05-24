import { Express, request } from "express";
import {   getLoggedUser, updateUserController ,deleteUserController, defineUserPreferenceController, getUserPreferencesController, putAvatarController} from "../controllers/UserController";
import authGuard from "../middlewares/AuthGuard";
import  checkUserStatus  from "../middlewares/CheckUserStatus";

import userValidation from "../validations/UserValidation";
import upload from "../middlewares/multer";
import { xpMiddleware } from "../middlewares/AwardXp";


const userRouter = (server: Express) => {
  
    server.get("/user", authGuard, checkUserStatus, getLoggedUser);
    server.put("/user/update", authGuard, checkUserStatus, updateUserController); 
    server.put("/user/avatar", authGuard,checkUserStatus, upload.single("avatar"),xpMiddleware(25),putAvatarController )
    server.delete("/user/deactivate", authGuard, checkUserStatus,deleteUserController); 
    server.get("/user/preferences", authGuard, checkUserStatus, getUserPreferencesController);
    server.post("/user/preferences/define", authGuard, checkUserStatus,defineUserPreferenceController); 
    
};

export default userRouter;
