import prisma from "../prismaClient";
import activityData from "../types/activity-data";
import ActivityParticipantsData from "../types/activityParicipant-data";
import jwt from "jsonwebtoken";
import { SubscriptionStatus } from "../types/subscriptionStats";

 // (GET /activities/types) Retorna todos os tipos de atividades
 export async function getActivityTypes() {
  try {
    return await prisma.activityTypes.findMany();
  } catch (error) {
    console.error("Erro ao buscar tipos de atividades:", error);
    throw new Error("Erro ao buscar tipos de atividades");
  }
}

//(GET /activities)Endpoint para listar as atividades com paginação, filtro por tipo e ordenação
export async function getActivitiesWithCount(typeId: string, orderBy: string, order: string, page: number, pageSize: number) {
  const [activities, totalActivities] = await prisma.$transaction([
    prisma.activities.findMany({
      where: {
        deletedAt: null,
        completedAt: null,
        ...(typeId ? { typeId } : {})
      },
      orderBy: { [orderBy]: order },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        ActivityAddresses: true,
        user: {
          select: { id: true, name: true, avatar: true },
        },
        ActivityParticipants: true,
      },
    }),
    prisma.activities.count({
      where: 
     { deletedAt: null, completedAt: null, ...(typeId ? { typeId } : {}) }
    }),
  ]);

  return { activities, totalActivities };
}

// (GET /activities/all)Endpoint para listar todas as atividades com filtro por tipo e ordenação
export async function getAllActivitiesWithSubscription(userId: string) {
  return await prisma.activities.findMany({
    where: { deletedAt: null, completedAt: null },  
    include: {
      ActivityParticipants: {
        where: { userId,  },
        select: { approved: true },
      },
      ActivityAddresses: true,
      user: {
        select: { id: true, name: true, avatar: true },
      },
    },
  });
}
// (GET /activities/user/creator) Endpoint para listar de forma paginada as atividades criadas pelo usuario logado


export async function getPaginatedCreatorActivitiesWithCount(userId: string, page: number, pageSize: number) {
  const [activities, totalActivities] = await prisma.$transaction([
    prisma.activities.findMany({
      where: { creatorId: userId, deletedAt: null },
      include: {
        ActivityAddresses: true,
        user: {
          select: { id: true, name: true, avatar: true },
        },
        ActivityParticipants: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.activities.count({
      where: { creatorId: userId, deletedAt: null },
    }),
  ]);

  return { activities, totalActivities };
}

//(GET /activities/user/creator/all) Endpoint para listar todas as atividades criadas pelo usuario logado
export async function getAllCreatorActivities(userId: string) {
  return await prisma.activities.findMany({
    where: { creatorId: userId, deletedAt: null },
    include: {
      ActivityAddresses: true,
      user: {
        select: { id: true, name: true, avatar: true },
      },
    },
  });
}

//(GET /activities/user/partipant) Endpoint para listar de forma paginada as atividades em que o usuario logado se increveu
export async function getPaginatedUserActivitiesWithCount(userId: string, page: number, pageSize: number) {
  const [activities, totalActivities] = await prisma.$transaction([
    prisma.activities.findMany({
      where: {
        deletedAt: null,
        ActivityParticipants: {
          some: { userId },
        },
      },
      include: {
        ActivityParticipants: {
          where: { userId },
          select: { approved: true },
        },
        ActivityAddresses: true,
        user: {
          select: { id: true, name: true, avatar: true },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.activities.count({
      where: {    
        deletedAt: null,
        ActivityParticipants: {
          some: { userId },
        },
      },
    }),
  ]);

  return { activities, totalActivities };
}

//(GET /activities/user/partipants/all) Endpoint para listar todas as atividades em que o usuario logado se increveu
export async function getAllUserActivities(userId: string) {
  return await prisma.activities.findMany({
    where: {
      deletedAt: null,
      ActivityParticipants: {
        some: { userId },
      },
    },
    include: {
      ActivityAddresses: true,
      user: {
        select: { id: true, name: true, avatar: true },
      },
      ActivityParticipants: {
        where: { userId },
        select: { approved: true },
      },
    },
  });
}

//(GET /activities/{id}/paticipants) Endpoint para listar os participantes de uma atividade especifica
export async function getActivitiesParticipants(activityId: string) { 
 
  const activityExists = await prisma.activities.findUnique({
    where: { 
      id: activityId,
    },
    select: {
      deletedAt: true,
    },
  });

  if (activityExists?.deletedAt !== null) {
    return null;
  }

  if (!activityExists) {
    return null; 
  }
  const participants = await prisma.activityParticipants.findMany({
    where: { activityId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });


  return participants.map((participant) => ({
    Id: participant.id,
    userId: participant.userId,
    name: participant.user.name,
    avatar: participant.user.avatar,
    subscribeStats: participant.approved === true
    ? SubscriptionStatus.Approved
    : participant.approved === false
    ? SubscriptionStatus.WaitingForApproval
    : SubscriptionStatus.NotSubscribed,  
    confirmedAt: participant.confirmedAt,
    
  }));
}

// (POST /activities/new) Cria uma nova atividade
export async function createActivity(userId: string, data: activityData) {
  const token = generateRandomCode(6);

  return await prisma.activities.create({
    data: {
      title: data.title,
      description: data.description,
      typeId: data.typeId,
      image: data.image,
      ActivityAddresses: {
        create: {
          latitude: data.address?.latitude ?? 0,
          longitude: data.address?.longitude ?? 0,
        },
      },
      scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : null,
      createdAt: new Date(),
      completedAt: null,
      private: data.private ?? false,
      confirmationCode: token,
      creatorId: userId, // Relaciona o criador da atividade
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      ActivityAddresses: {
        select: {
          latitude: true,
          longitude: true,
        },
      },
    },
    omit: {  confirmationCode : true, deletedAt: true , completedAt : true , creatorId : true },
  });
}

function generateRandomCode(length: number = 6): string {
  const characters = "0123456789abcdefghijklmnopqrstuvwxyz";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

//(POST /activities/{id}/subscribe) Endpoint para se inscrever em uma atividade
export async function postActivitySubscription(data: ActivityParticipantsData, activityId: string) {
  return await prisma.activityParticipants.create( 
    {
      data: {
        activityId: data.activityId,
        userId: data.userId,
        approved: data.approved,
        confirmedAt: null
      },
      omit: {
        approved: data.approved
      }
    }
  );
}
//(PUT /activities/{id}/update) Endpoint para atualizar uma atividade
export async function updateActivity(activityId: string, data: activityData) {
  const { address, ...activityData } = data;

  const updatedActivity = await prisma.activities.update({
    where: { id: activityId },
    data: activityData,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      ActivityAddresses: {
        select: {
          latitude: true,
          longitude: true,
        },
      },
    },
    omit: { deletedAt: true, confirmationCode: true, creatorId: true },
  });

  if (address) {
    await prisma.activityAddresses.updateMany({
      where: { activityId: activityId },
      data: {
        latitude: address.latitude,
        longitude: address.longitude,
      },
    });
  }

  return updatedActivity;
}

//(PUT /activities/{id}/conclude) Endpoint para concluir uma atividade
export async function concludeActivity(activityId: string){
  return await prisma.activities.update({where: {id: activityId}
  ,data: {completedAt: new Date()}});

}

//(PUT /activities/{id}/approve) Endpoint para aprovar ou negar um  participante em uma atividade privada
export async function approveActivity(activityId: string, userId: string, approved: boolean) {
  return await prisma.activityParticipants.updateMany({
    where: {
      activityId: activityId,
      userId: userId,
    },
    data: {
      approved: approved,
    },
  });
}

//(PUT /activities/{id}/check-in) Endpoint para confirmar o check-in em uma atividade utilizando o codigo de confimação
export async function confirmParticipantCheckIn(participantId: string) {
  return await prisma.activityParticipants.update({
    where: { id: participantId },
    data: { confirmedAt: new Date() },
  });
}
//(DELETE  /activities/{id}/unsubscribe) Endpoint para se cancelar a inscrição do usuario logado em uma atividade
export async function getActivitySubscription(userId: string, activityId: string) {
  return await prisma.activityParticipants.findFirst({
    where: { userId, activityId },
  });
}

export async function deleteSubscription(participantId: string) {
  return await prisma.activityParticipants.delete({
    where: { id: participantId },
  });
}

//(DELETE /activities/{id}/delete) Endpoint para excluir uma atividade existente
export async function softDeleteActivity(activityId: string) {
  return await prisma.activities.update({
    where: { id: activityId },
    data: { deletedAt: new Date() },
  });
}

// Função para verificar se um usuário já se inscreveu em uma atividade
export async function checkSubscriptionExists(userId: string, activityId: string) {
  const subscription = await prisma.activityParticipants.findFirst({
    where: {
      userId: userId,
      activityId: activityId,
    },
  });
  return !!subscription;
}

export async function getActivityById(activityId: string) {
  return await prisma.activities.findUnique({ where: { id: activityId } });
}
export async function checkUserActivityStatus(userId: string, activityId: string) {
  const participant = await prisma.activityParticipants.findFirst({
    where: { userId, activityId },
  });

  if (!participant) {
    return null; 
  }

  return await prisma.activityParticipants.update({
    where: { id: participant.id },
    data: { confirmedAt: null }
  });
}

export async function getActivityParticipant(activityId: string, userId: string) {
  return await prisma.activityParticipants.findFirst({
    where: { activityId, userId },
  });
}

