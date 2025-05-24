import { 
  createActivity, 
  postActivitySubscription, 
 getAllCreatorActivities, 
  softDeleteActivity, 
  getActivityTypes,
  getActivityById,
  getAllUserActivities,
  updateActivity,
  concludeActivity,
  approveActivity,
  checkUserActivityStatus,
  getActivityParticipant,
  confirmParticipantCheckIn,
  getActivitySubscription,
  deleteSubscription,
  getAllActivitiesWithSubscription,
  getPaginatedUserActivitiesWithCount,getActivitiesWithCount,getPaginatedCreatorActivitiesWithCount

} from "../repositories/ActivityRepository";
import { checkUserExists } from "../repositories/UserRepository";
import activityData from "../types/activity-data";
import ActivityParticipantsData from "../types/activityParicipant-data";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { SubscriptionStatus } from "../types/subscriptionStats";



//post /activities/subscribe
export async function createSubscription(data: ActivityParticipantsData, activityId: string) {
  const newSubscription = await postActivitySubscription(data, activityId);
  const subscriptionStatus = newSubscription.approved
    ? SubscriptionStatus.Approved
    : SubscriptionStatus.WaitingForApproval;
  return {
    ...newSubscription,
    subscriptionStatus,
  };
}

  

export async function fetchAllCreatorActivities(userId: string) {
  const activities = await getAllCreatorActivities(userId);

  return activities.map((activity) => ({
    id: activity.id,
    title: activity.title,
    description: activity.description,
    type: activity.typeId,
    image: activity.image,
    confimationCode: activity.confirmationCode,
    address: activity.ActivityAddresses
      ? {
          latitude: activity.ActivityAddresses.latitude,
          longitude: activity.ActivityAddresses.longitude,
        }
      : null,
    scheduledDate: activity.scheduledDate,
    createdAt: activity.createdAt,
    completedAt: activity.completedAt,
    private: activity.private,
    creator: {
      id: activity.user.id,
      name: activity.user.name,
      avatar: activity.user.avatar,
    },
  }));
}



export async function createActivityService(userId: string, activityData: activityData) {
  try {
    if (!activityData.title || !activityData.typeId || !activityData.description) {
      throw { status: 400, error: "Campos obrigatórios faltando" };
    }

    const newActivity = await createActivity(userId, activityData);

      const { user, ...rest } = newActivity;
  return {
    ...rest,
    creator: user,
  };

   
   
  } catch (error) {
    console.error("Erro ao criar atividade:", error);
    throw { status: 500, error: "Erro inesperado" };
  }
}
export async function softDeleteActivityService(userId: string, activityId: string) {
  const activity = await getActivityById(activityId);

  if (!activity) {
    throw { status: 404, error: "Atividade não encontrada" };
  }

  if (activity.creatorId !== userId) {
    throw { status: 401, error: "Apenas o criador da atividade pode excluí-la" };
  }

  if (activity.deletedAt) {
    throw { status: 400, error: "Não é possível excluir uma atividade já excluída" };
  }

  try {
    await softDeleteActivity(activityId);
    return {  message: "Atividade excluida com sucesso" };
  } catch (error) {
    console.error("Erro ao excluir atividade:", error);
    throw { status: 500, error: "Erro inesperado" };
  }
}

export async function fetchActivityTypes() {
  try {
    const types = await getActivityTypes();
    if (!types || types.length === 0) {
      throw new Error("Nenhum tipo de atividade encontrado");
    }
    return types;
  } catch (error) {
    console.error("Erro ao buscar tipos de atividades:", error);
    throw error;
  }
}

export async function updateActivityService(userId: string, activityId: string, data: activityData) {
  const activity = await getActivityById(activityId);

  if (!activity) {
    throw { status: 404, error: "Atividade não encontrada" };
  }

  if (activity.creatorId !== userId) {
    throw { status: 401, error: "Apenas o criador da atividade pode editá-la" };
  }

  if (activity.deletedAt) {
    throw { status: 400, error: "Não é possível editar uma atividade excluída" };
  }
 
  try {
    const updatedActivity = await updateActivity(activityId, data);
   
    const { user, ...rest } = updatedActivity;
    return {
      ...rest,
      creator: user,
    };

  } catch (error) {
    console.error("Erro ao atualizar atividade:", error);
    throw { status: 500, error: "Erro inesperado" };
  }
}

export async function concludeActivityService(userId: string, activityId: string) {
  const activity = await getActivityById(activityId);

  if (!activity) {
    throw { status: 404, error: "Atividade não encontrada" };
  }

  if (activity.creatorId !== userId) {
    throw { status: 401, error: "Apenas o criador da atividade pode concluí-la" };
  }

  if (activity.completedAt) {
    throw { status: 400, error: "Não é possível concluir uma atividade já concluída" };
  }

  try {
    await concludeActivity(activityId);
    return { message: "Atividade concluída com sucesso" };
  } catch (error) {
    console.error("Erro ao concluir atividade:", error);
    throw { status: 500, error: "Erro inesperado" };
  }
}

export async function approveActivityService(userId: string, activityId: string, participantId: string, approved: boolean) {
  const activity = await getActivityById(activityId);

  if (!activity) {
    throw { status: 404, error: "Atividade não encontrada" };
  }

  if (activity.creatorId !== userId) {
    throw { status: 401, error: "Apenas o criador da atividade pode aprovar ou negar participantes" };
  }

  const participant = await checkUserActivityStatus(participantId, activityId);
  const user = await checkUserExists(userId);

  if (!user) {
    throw { status: 404, error: "Participante não encontrado" };
  }
if(participant!.approved == true) {
  throw { status: 400, error: "Participante ja foi aprovado" };
}
  

  try {
    await approveActivity(activityId, participantId, approved);
    

    return { message: "Solicitação de participação atualizada com sucesso" };
  } catch (error) {
    console.error("Erro ao aprovar participante:", error);
    throw { status: 500, error: "Erro inesperado" };
  }
}

export async function checkInActivityService(userId: string, activityId: string, confirmationCode: string) {
  const activity = await getActivityById(activityId);

  if (!activity) {
    throw { status: 404, error: "Atividade não encontrada" };
  }

  const participant = await getActivityParticipant(activityId, userId);

  if (!participant) {
    throw { status: 404, error: "Participante não encontrado" };
  }

  if(participant.approved == false) {
    throw { status: 400, error: "Participante ainda precisa ser aprovado" };
  }

  if (activity.confirmationCode !== confirmationCode) {
    throw { status: 400, error: "Código de confirmação inválido" };
  }

  if (participant.confirmedAt) {
    throw { status: 400, error: "Check-in já realizado" };
  }

  try {
    await confirmParticipantCheckIn(participant.id);
    return { message: "Check-in realizado com sucesso" };
  } catch (error) {
    console.error("Erro ao realizar check-in:", error);
    throw { status: 500, error: "Erro inesperado" };
  }
}

export async function deleteActivitySubscriptionService(userId: string, activityId: string) {
  const activity = await getActivityById(activityId);

  if (!activity) {
    throw { status: 404, error: "Atividade não encontrada" };
  }

  const subscription = await getActivitySubscription(userId, activityId);

  if (!subscription) {
    throw { status: 404, error: "Inscrição não encontrada" };
  }

  if (subscription.confirmedAt) {
    throw { status: 400, error: "Não é possível cancelar sua inscrição, pois sua presença já foi confirmada." };
  }

  try {
    await deleteSubscription(subscription.id);
    return { message: "Inscrição cancelada com sucesso" };
  } catch (error) {
    console.error("Erro ao cancelar inscrição:", error);
    throw { status: 500, error: "Erro inesperado" };
  }
}

export async function fetchAllActivitiesWithSubscription(userId: string) {
  const activities = await getAllActivitiesWithSubscription(userId);

  return activities.map((activity) => ({
    id: activity.id,
    title: activity.title,
    description: activity.description,
    type: activity.typeId,
    image: activity.image,
    address: activity.ActivityAddresses
      ? {
          latitude: activity.ActivityAddresses.latitude,
          longitude: activity.ActivityAddresses.longitude,
        }
      : null,
    scheduledDate: activity.scheduledDate,
    createdAt: activity.createdAt,
    completedAt: activity.completedAt,
    private: activity.private,
    creator: {
      id: activity.user.id,
      name: activity.user.name,
      avatar: activity.user.avatar,
    },
    subscriptionStatus: activity.ActivityParticipants.length
      ? activity.ActivityParticipants[0].approved
        ? SubscriptionStatus.Approved
        : SubscriptionStatus.WaitingForApproval
      : SubscriptionStatus.NotSubscribed,
  }));
}




export async function fetchAllUserActivities(userId: string) {
  const activities = await getAllUserActivities(userId);

  return activities.map((activity) => ({
    id: activity.id,
    title: activity.title,
    description: activity.description,
    type: activity.typeId,
    image: activity.image,
    address: activity.ActivityAddresses
      ? {
          latitude: activity.ActivityAddresses.latitude,
          longitude: activity.ActivityAddresses.longitude,
        }
      : null,
    scheduledDate: activity.scheduledDate,
    createdAt: activity.createdAt,
    completedAt: activity.completedAt,
    private: activity.private,
    creator: {
      id: activity.user.id,
      name: activity.user.name,
      avatar: activity.user.avatar,
    },
    subscriptionStatus: activity.ActivityParticipants.length
      ? activity.ActivityParticipants[0].approved
        ? SubscriptionStatus.Approved
        : SubscriptionStatus.WaitingForApproval
      : SubscriptionStatus.NotSubscribed,
  }));
}

function formatPaginatedResponse(
  activities: any[],
  totalActivities: number,
  page: number,
  pageSize: number,
  includeSubscriptionStatus: boolean = false
) {
  const totalPages = Math.ceil(totalActivities / pageSize);
  const previous = page > 1 ? page - 1 : null;
  const next = page < totalPages ? page + 1 : null;

  return {
    page,
    pageSize,
    totalActivities,
    totalPages,
    previous,
    next,
    activities: activities.map((activity) => ({
      id: activity.id,
      title: activity.title,
      description: activity.description,
      type: activity.typeId,
      image: activity.image,
      confirmationCode: activity.confirmationCode || null,
      participantCount: activity.ActivityParticipants.length,
      address: activity.ActivityAddresses
        ? {
            latitude: activity.ActivityAddresses.latitude,
            longitude: activity.ActivityAddresses.longitude,
          }
        : null,
      scheduledDate: activity.scheduledDate,
      createdAt: activity.createdAt,
      completedAt: activity.completedAt,
      private: activity.private,
      creator: {
        id: activity.user.id,
        name: activity.user.name,
        avatar: activity.user.avatar,
      },
      ...(includeSubscriptionStatus && {
        userSubscriptionStatus: activity.ActivityParticipants.length
          ? activity.ActivityParticipants[0].approved
            ? SubscriptionStatus.Approved
            : SubscriptionStatus.WaitingForApproval
          : SubscriptionStatus.NotSubscribed,
      }),
    })),
  };
}

export async function fetchActivitiesWithPagination(
  typeId: string,
  orderBy: string,
  order: string,
  page: number,
  pageSize: number
) {
  const { activities, totalActivities } = await getActivitiesWithCount(typeId, orderBy, order, page, pageSize);

  return formatPaginatedResponse(activities, totalActivities, page, pageSize, false);
}

export async function fetchPaginatedUserActivitiesWithCount(
  userId: string,
  page: number,
  pageSize: number
) {
  const { activities, totalActivities } = await getPaginatedUserActivitiesWithCount(userId, page, pageSize);

  return formatPaginatedResponse(activities, totalActivities, page, pageSize, true);
}

export async function fetchPaginatedCreatorActivitiesWithCount(
  userId: string,
  page: number,
  pageSize: number
) {
  const { activities, totalActivities } = await getPaginatedCreatorActivitiesWithCount(userId, page, pageSize);

  return formatPaginatedResponse(activities, totalActivities, page, pageSize, false);
}