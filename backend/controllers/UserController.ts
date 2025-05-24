import { Request, Response } from "express";
import {
  fetchAllUsers,
  fetchLoggedUser,
  updateUserDetails,
  deactivateUser,
  defineUserPreference,
  fetchUserPreferences,
  updateUserAvatar,
} from "../services/UserService";
import multer from "multer";


export async function getUsers(req: Request, res: Response) {
  try {
    const users = await fetchAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro inesperado" });
  }
}

export async function getLoggedUser(req: Request, res: Response) {
  try {
    const userId = req.userId;
    const user = await fetchLoggedUser(userId);
    res.status(200).json(user);
  } catch (error: any) {
    if (error.message === "Usuário não encontrado") {
      res.status(404).json({ error: error.message });
    } else {
      console.error("Erro ao buscar usuário logado:", error);
      res.status(500).json({ error: "Erro inesperado" });
    }
  }
}

export async function updateUserController(req: Request, res: Response) {
  try {
    const userId = req.userId;
    const { name, email, password } = req.body;

    const updatedUser = await updateUserDetails(userId, { name, email, password });
    res.status(200).json({ user: updatedUser });
  } catch (error: any) {
    if (error.message === "Usuário não encontrado") {
      res.status(404).json({ error: error.message });
    } else {
      console.error("Erro ao atualizar usuário:", error);
      res.status(500).json({ error: "Erro inesperado" });
    }
  }
}

export async function deleteUserController(req: Request, res: Response) {
  try {
    const userId = req.userId;
    await deactivateUser(userId);
    res.status(200).json({ message: "Conta desativada com sucesso" });
  } catch (error: any) {
    if (error.message === "Usuário não encontrado") {
      res.status(404).json({ error: error.message });
    } else {
      console.error("Erro ao deletar usuário:", error);
      res.status(500).json({ error: "Erro inesperado" });
    }
  }
}

export async function defineUserPreferenceController(req: Request, res: Response) {
  try {
    const userId = req.userId;
    const { typeIds } = req.body;

    if (!typeIds || !Array.isArray(typeIds) || typeIds.length === 0) {
      res.status(400).json({ error: "O campo 'typeIds' é obrigatório e deve ser um array não vazio" });
      return;
    }

    await defineUserPreference(userId, typeIds);
    res.status(201).json({ message: "Preferências atualizadas com sucesso" });
  } catch (error: any) {
    if (error.message === "Um ou mais IDs informados são inválidos") {
      res.status(404).json({ error: error.message });
    } else {
      console.error("Erro ao criar preferências:", error);
      res.status(500).json({ error: "Erro inesperado" });
    }
  }
}

export async function getUserPreferencesController(req: Request, res: Response) {
  try {
    const userId = req.userId;
    const preferences = await fetchUserPreferences(userId);
    res.status(200).json(preferences);
  } catch (error: any) {
    if (error.message === "Preferências não encontradas") {
      res.status(404).json({ error: error.message });
    }
    console.error("Erro ao buscar preferências do usuário:", error);
    res.status(500).json({ error: "Erro inesperado" });
  }
}

export async function putAvatarController(req: Request, res: Response) {
  try {
    const userId = req.userId;
    
    if (!req.file) {
      res.status(400).json({ error: "Imagem não encontrada" });
      return;
    }

    const userAvatar = await updateUserAvatar(userId, req.file);
    res.status(200).json({ avatar: userAvatar.avatar });
  } catch (error: any) {
    if (error.message === "IMAGE_NOT_FOUND") {
      res.status(400).json({ error: error.message });
    }
    if (error.message === "TIPO_INVALIDO") {
      res.status(400).json({ error: "A imagem deve ser PNG ou JPG" });return 
  }
    else {
      console.error("Erro ao atualizar avatar:", error);
      res.status(500).json({ error: "Erro inesperado" });
    }
  }
}