import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function checkUserStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId; 
  
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { deletedAt: true },
    });

    if (user?.deletedAt) {
      res.status(403).json({ error: "Esta conta foi desativada e não pode ser utilizada." });
       return
    }

    next(); 
  } catch (error) {
    console.error("Erro ao verificar status do usuário:", error);
    res.status(500).json({ error: "Erro inesperado" });
     return
  }
}
