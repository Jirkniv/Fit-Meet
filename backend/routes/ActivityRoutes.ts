import { Express, request } from "express";
import { createActivityController,
    getActivityTypesController,
         softDeleteActivityController,
         updateActivityController,
         postActivitySubscriptionController,
         deleteActivitySubscriptionController,
         getActivityPartipantsController,
         getAllUserActivitiesController,
         getPaginatedUserActivitiesController,
         
         getAllCreatorActivitiesController,
         getPaginatedCreatorActivitiesController,
         getAllActivitiesController,
         getActivitiesController,
         concludeActivityController,
         approveActivityController,
         checkInActivityController
        } from "../controllers/ActivityController";
import authGuard from "../middlewares/AuthGuard";
import checkUserStatus from "../middlewares/CheckUserStatus";
import validateRequestBody from "../middlewares/request-body-validator";
import { xpMiddleware } from "../middlewares/AwardXp";
import ActivityValidation from "../validations/ActivityValidation";
import multer from "../middlewares/multer"
import upload from "../middlewares/multer";

const activityRouter = (server: Express) => {

    server.get("/activities/types", authGuard,checkUserStatus, getActivityTypesController);
    
    server.get("/activities/all", authGuard,checkUserStatus, getAllActivitiesController);

    server.get("/activities", authGuard,checkUserStatus, getActivitiesController);

    server.get("/activities/user/creator/all", authGuard,checkUserStatus, getAllCreatorActivitiesController);

    server.get("/activities/user/creator", authGuard,checkUserStatus, getPaginatedCreatorActivitiesController);

    server.get("/activities/user/participant/all", authGuard,checkUserStatus, getAllUserActivitiesController);

    server.get("/activities/user/participant", authGuard,checkUserStatus, getPaginatedUserActivitiesController);

    server.get("/activities/:id/participants", authGuard,checkUserStatus, getActivityPartipantsController)

    server.put("/activities/:id/update", authGuard,checkUserStatus,upload.single("image"), xpMiddleware(25), 
    updateActivityController)

    server.put("/activities/:id/conclude", authGuard,checkUserStatus,xpMiddleware(75), concludeActivityController)

    server.put("/activities/:id/approve", authGuard,checkUserStatus, xpMiddleware(25),approveActivityController)

    server.put("/activities/:id/check-in", authGuard,checkUserStatus, checkInActivityController)

    server.post("/activities/new", authGuard, upload.single("image"),checkUserStatus,xpMiddleware(50), createActivityController)

    server.post("/activities/:id/subscribe", authGuard,checkUserStatus,xpMiddleware(50), postActivitySubscriptionController) 
  
    server.delete("/activities/:id/unsubscribe", authGuard,checkUserStatus, deleteActivitySubscriptionController)

    server.delete("/activities/:id/delete", authGuard, checkUserStatus,softDeleteActivityController )  
};

export default activityRouter;