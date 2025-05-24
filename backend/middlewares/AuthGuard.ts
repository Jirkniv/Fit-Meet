import { Request, Response, NextFunction } from "express";
import  Jwt  from "jsonwebtoken";


const jwtSecret = process.env.JWT_SECRET!
declare module "express-serve-static-core" {
        interface Request {
          userId: string;
          deletedAt: Date;
        }
      }
    
export default function authGuard(request: Request, response: Response, next: NextFunction) {

    
    const authHeader = request.headers.authorization;
    if (!authHeader) {
         response.status(401).json( {error :"Autenticação necessária" })
         return;
    }

    const token = authHeader.replace("Bearer ", "");

    
        try {
            const user = Jwt.verify(token, jwtSecret) as {
              id: string;
              name: string;
              email: string;
              password: string;
              iat: number;
              exp: number;
            };
        
            request.userId = user.id;
    next()
} catch (error: any) {
    response.status(401).json( {error:"Token invalido"} )
    return;
}

}