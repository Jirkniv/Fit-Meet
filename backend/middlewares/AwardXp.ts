// middlewares/xpMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { addXpToUser } from "../services/UserService";

export function xpMiddleware(xpToAdd: number) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        return next();
      }

      addXpToUser(req.userId, xpToAdd).catch(err => {
        console.error("Erro ao adicionar XP:", err);
      });

    
      next();
    } catch (error) {
      console.error("Erro no xpMiddleware:", error);
      res.status(500).json({ error: "Erro ao adicionar XP" });
    }
  };
}
