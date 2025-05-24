import { Express } from "express";
import  {authSignIn, authRegister}  from "../controllers/AuthController";
import requestBodyValidator from "../middlewares/request-body-validator";
import  authValidation  from "../validations/AuthValidation";
import userValidation from "../validations/UserValidation";
import checkUserStatus from "../middlewares/CheckUserStatus";
const authRouter = (server: Express) => {
    server.post("/auth/signIn", requestBodyValidator(authValidation), authSignIn);
    server.post("/auth/register",requestBodyValidator(userValidation), authRegister)
}

export default authRouter