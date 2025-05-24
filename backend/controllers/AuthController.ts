import { Request, Response } from "express";
import { authenticateUser, createUser } from "../services/AuthService";

export async function authSignIn(request: Request, response: Response) {
  try {
    const { email, password } = request.body;
    const userToken = await authenticateUser(email, password);
    response.status(200).json(userToken);
  } catch (error: any) {
    if (error.message === "USER_NOT_FOUND") {
      response.status(404).json({ error: "Usuário não encontrado" });
      return;
    }
    if(error.message === "USER_DELETED") {
      response.status(403).json({ error: "Esta conta foi desativada e não pode ser utilizada." });
    }
    if (error.message === "INVALID_PASSWORD") {
      response.status(401).json({ error: "Senha incorreta" });
      return;
    }
    if(error.message === "SERVER_ERROR") {
      response.status(500).json({ error: "Erro inesperado" });
      return;
    }
    console.error(error);
    response.status(500).json({ error: "Erro inesperado" });
    return;
  }
}

export async function authRegister(request: Request, response: Response) {
  try {
    await createUser(request.body);
    response.status(201).json({ message: "Usuário criado com sucesso" });
  } catch (error: any) {
   
    if (error.message === "EMAIL_OR_CPF_EXISTS") {
      response.status(409).json({ error: "O email ou CPF informado já pertence a outro usuário" });
      return;
    }
    console.error(error);
    response.status(500).json({ error: "Ocorreu um erro no servidor." });
    return;
  }
}