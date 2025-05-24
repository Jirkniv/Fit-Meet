import prisma from "../prismaClient";
import preference from "../types/preference-data";
import userData from "../types/user-data";
import { grantAchievement } from "../services/achievementsService";

// // Retorna todos os usuários
export async function getAll() {
  return await prisma.user.findMany(); 
}


//(POST /auth/register) Cria um novo usuário
export async function register(data: userData) {
  return await prisma.user.create({
  data:{
      ...data,
      avatar: data.avatar || "",
      level: data.level || 1,
      xp: data.xp || 0,
      deletedAt: null
  }
  }); 
}

//(POST /auth/sing-In)Retorna o usuário pelo email
export async function getByEmail(email: string) {
  return await prisma.user.findUnique({
     where: { 
      email,
     }
     ,//Tem que dar omit na senha 
     include: {
      UserAchievements: {
        select: {
          achievement: {
            select: {
              name: true,
              criterion: true
            }
          }
        }
      }
     }
     }); 
}

//(GET /user) Retorna o usuário pelo id logado
export async function getUserById(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    omit: { password: true, deletedAt: true },
    include: {
      UserAchievements: {
        select: {
          achievement: {
            select: {
              name: true,
              criterion: true
            }
          }
        }
      }
    }
  }); 
}

//(GET /user/preference) Retorna as preferências do usuário
export async function getUserPreferences(userId: string) {
  const preferences = await prisma.preferences.findMany({
    where: { userId: userId },
    select: {
      typeId: true,
      type: {
        select: {
          name: true,
          description: true
        }
      }
    }
  });

  return preferences.map((preference: { typeId: string; type: { name: string; description: string } }) => ({
    typeId: preference.typeId,
    typeName: preference.type.name,
    typeDescription: preference.type.description,
  }));
}

//(POST /user/preference/define) Define as preferências do usuário
export async function createPreference(userId: string, data: preference) {
  return await prisma.preferences.create({
    data:{
      userId: userId,
      typeId: data.typeId
    }
  });
}

//Exclui as prefencias do usuário
export async function deleteUserPreferences(userId: string) {
  return await prisma.preferences.deleteMany({
    where: { userId: userId },
  });
}

//(PUT /user/avatar) Edita a foto do perfil do usuário
export async function putAvatar(userId: string, avatar: string) { 
  return await prisma.user.update({
    where: { id: userId },
    data: { avatar: avatar }, 
  });
}

//(PUT /user/update) Editar dados do usuário
export async function updateUser(userId: string, data:
  Partial<{ name: string; email: string; password: string }>) {
  return await prisma.user.update({
    where: { id: userId },
    omit: { password: true , deletedAt: true},
    data: data,
  });
}

//(DELETE /user/deactivate) Desativar conta o usuário
export async function softDeleteUser(userId: string) {
  return await prisma.user.update({
    where: { id: userId },
    data: { deletedAt: new Date() },
  }); 
}

//Checa se o id do tipo de atividade existe
export async function checkTypeIdExists(typeId: string) {
  const type = await prisma.activityTypes.findUnique({
    where: { id: typeId },
  });
  return !!type;
}

//Adiciona xp ao usuário
export async function awardXP(userId: string, xpToAdd: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }


  const newXp = user.xp + xpToAdd;
  let newLevel = user.level;
 
  let threshold = 100 * Math.pow(2, newLevel - 1);


  if (newXp >= threshold) {
    newLevel++;
    threshold = 100 * Math.pow(2, newLevel - 1);
    if(user.level === 1){
       grantAchievement("Leveling Up", userId)
    }
    if(newLevel === 5){
      grantAchievement("High Level", userId)
      }
    }

  return await prisma.user.update({
    where: { id: userId },
    data: {
      xp: newXp,
      level: newLevel,
    },
  });
}



export async function checkUserExists(userId: string) {
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true } 
  });
  return !!user;
}
