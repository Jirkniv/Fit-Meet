import { 
  getUserById, 
  awardXP, 
  getAll, 
  getByEmail, 
  updateUser, 
  softDeleteUser, 
  createPreference, 
  checkTypeIdExists, 
  getUserPreferences, 
  putAvatar, 
  deleteUserPreferences 
} from "../repositories/UserRepository";
import bcrypt from "bcryptjs";
import { uploadImage } from "./s3Service";

// Fetch all users
export async function fetchAllUsers() {
  try {
    return await getAll();
  } catch (error) {
    console.error("Erro ao buscar todos os usuários:", error);
    throw new Error("Erro ao buscar usuários");
  }
}

// Fetch logged-in user by ID
export async function fetchLoggedUser(userId: string) {
  try {
    const user = await getUserById(userId);
    if (!user) {
      throw new Error("Usuário não encontrado");
    }
    return user;
  } catch (error) {
    console.error("Erro ao buscar usuário logado:", error);
    throw error;
  }
}

// Update user details
export async function updateUserDetails(userId: string, data: { name?: string; email?: string; password?: string }) {
  try {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }


    const updatedUser = await updateUser(userId, data);

    
    if (!updatedUser || !updatedUser.id || updatedUser.name === "Unknown") {
      throw new Error("Usuário não encontrado");
    }
    return updatedUser;
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw error;
  }
}

// Soft delete user
export async function deactivateUser(userId: string) {
  try {
    const deletedUser = await softDeleteUser(userId);
    if (!deletedUser) {
      throw new Error("Usuário não encontrado");
    }
    return deletedUser;
  } catch (error) {
    console.error("Erro ao desativar usuário:", error);
    throw error;
  }
}

// Check if activity type exists
export async function validateTypeId(typeId: string) {
  try {
    const typeExists = await checkTypeIdExists(typeId);
    if (!typeExists) {
      throw new Error("Um ou mais IDs informados são inválidos");
    }
    return typeExists;
  } catch (error) {
    console.error("Erro ao validar tipo de atividade:", error);
    throw error;
  }
}

// Create user preference
export async function defineUserPreference(userId: string, typeIds: string[]) {
  try {
    
    const uniqueTypeIds = [...new Set(typeIds)];

    for (const typeId of typeIds) {
      await validateTypeId(typeId);
    }

    await deleteUserPreferences(userId);

   
    for (const typeId of uniqueTypeIds) {
      await createPreference(userId, { typeId });
    }

    return { message: "Preferências atualizadas com sucesso" };
  } catch (error) {
    console.error("Erro ao definir preferências do usuário:", error);
    throw error;
  }
}


// Fetch user preferences
export async function fetchUserPreferences(userId: string) {
  try {
    const preferences = await getUserPreferences(userId);
    if (!preferences || preferences.length === 0 || preferences.every(pref => !pref.typeId)) {
      throw new Error("Preferências não encontradas");
    }
    return preferences;
  } catch (error) {
    console.error("Erro ao buscar preferências do usuário:", error);
    throw error;
  }
}

// Update user avatar
  export async function updateUserAvatar(userId: string, file: Express.Multer.File) {
    try {
      if (!file) {
        throw new Error("IMAGE_NOT_FOUND");
      }
      const avatarUrl = await uploadImage(file);
      return await putAvatar(userId, avatarUrl);
    } catch (error) {
      console.error("Erro ao atualizar avatar do usuário:", error);
      throw error;
    }
  }

// Add XP to user
export async function addXpToUser(userId: string, xpToAdd: number) {
  try {
    return await awardXP(userId, xpToAdd);
  } catch (error) {
    console.error("Erro ao adicionar XP ao usuário:", error);
    throw error;
  }
}

