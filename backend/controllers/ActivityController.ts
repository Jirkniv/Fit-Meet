import { Request, Response } from "express";
import {

  checkSubscriptionExists,
  getActivitiesParticipants,



  getActivityById,

} from "../repositories/ActivityRepository";

import { createActivityService,fetchAllCreatorActivities, softDeleteActivityService,  fetchActivityTypes, 
approveActivityService,
concludeActivityService,
checkInActivityService,
deleteActivitySubscriptionService,
fetchAllActivitiesWithSubscription,
fetchActivitiesWithPagination ,fetchAllUserActivities,fetchPaginatedUserActivitiesWithCount,
fetchPaginatedCreatorActivitiesWithCount,
updateActivityService

} from "../services/ActivityService";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { createSubscription } from "../services/ActivityService";
import { grantAchievement } from "../services/achievementsService";
import { SubscriptionStatus } from "../types/subscriptionStats";
import { uploadImage } from "../services/s3Service";

export async function getActivityTypesController(req: Request, res: Response) {
  try {
    const types = await fetchActivityTypes();
    res.status(200).json(types);
  } catch (error: any) {
    if (error.message === "Nenhum tipo de atividade encontrado") {
      res.status(404).json({ error: error.message });
    } else {
      console.error("Erro ao buscar tipos de atividades:", error);
      res.status(500).json({ error: "Erro inesperado" });
    }
  }
}

export async function createActivityController(req: Request, res: Response) {
  try {
    const userId = req.userId;

    const {
      title,
      description,
      typeId,
      scheduledAt,
      private: isPrivate,
      address,
    } = req.body;

    const privateValue = isPrivate === "true";
    //console.log(req.body)
  
    if (!address || typeof address !== "string" || !address.includes(",")) {
      res.status(400).json({
        error: "O campo 'address' é obrigatório e deve estar no formato 'latitude,longitude'",
      }); 
      return
    }

    const [latitude, longitude] = address.split(",").map((value: string) => parseFloat(value.trim()));

    if (isNaN(latitude) || isNaN(longitude)) {
     res.status(400).json({ error: "Os valores de latitude e longitude devem ser números válidos" });
      return 
    }

   
    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadImage(req.file);
    }

    const newActivity = await createActivityService(userId, {
      title,
      description,
      typeId,
      image: imageUrl!,
      address: { latitude, longitude },
      scheduledDate: scheduledAt,
      private: privateValue,
    });

    res.status(201).json(newActivity);
  } catch (error: any) {
    console.error("Erro ao criar atividade:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}



export async function softDeleteActivityController(req: Request, res: Response) {
  try {
    const userId = req.userId;
    const activityId = req.params.id;

    const result = await softDeleteActivityService(userId, activityId);

    if(!result){
      res.status(404).json({ error: "Atividade nao encontrada" });
    }

    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.error || "Erro inesperado" });
  }
}

export async function updateActivityController(req: Request, res: Response) {
  try {
    const userId = req.userId;
    const activityId = req.params.id;

    const {
      title,
      description,
      type: typeId, 
      scheduledAt,
      private: isPrivate,
      address,
    } = req.body;


    

    const privateValue = isPrivate === "true";
    
    
    if (!address || typeof address !== "string" || !address.includes(",")) {
      res.status(400).json({
        error: "O campo 'address' é obrigatório e deve estar no formato 'latitude,longitude'",
      }); 
      return
    }

    const [latitude, longitude] = address.split(",").map((value: string) => parseFloat(value.trim()));

    if (isNaN(latitude) || isNaN(longitude)) {
     res.status(400).json({ error: "Os valores de latitude e longitude devem ser números válidos" });
      return 
    }


    // Faz o upload da imagem enviada
    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadImage(req.file);
    }

    // Atualiza a atividade
    const updatedActivity = await updateActivityService(userId, activityId, {
      title,
      description,
      typeId,
      image: imageUrl!,
      address: { latitude, longitude },
      scheduledDate: scheduledAt,
      private: privateValue,
    });

    res.status(200).json(updatedActivity);
  } catch (error: any) {
    if (error.status) {
      res.status(error.status).json({ error: error.error });
    } else {
      console.error("Erro ao atualizar atividade:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}

export async function postActivitySubscriptionController(
  req: Request,
  res: Response
) {
  try {
    const userId = req.userId;
    const activityId = req.params.id;

    const subscriptionExists = await checkSubscriptionExists(
      userId,
      activityId
    );
    if (subscriptionExists) {
      res.status(409).json({ error: "Você já se registrou nesta atividade" });
      return;
    }
    const activity = await getActivityById(activityId);

    if(activity?.deletedAt != null) {
      res.status(400).json({ error: "Não é possivel se inscrever em uma atividade excluida" });
      return
    }
    if(activity?.completedAt != null) {
      res.status(409).json({ error: "Não é possível se inscrever em uma atividade concluída" });
      return
    }
   
    if (activity?.creatorId == userId) {
      res.status(409).json({error: "O criador da atividade não pode se inscrever como um participante"});
      return
    }

    let newSubscription;
    if (activity?.private === false) {
      newSubscription = await createSubscription(
        { userId, activityId, approved: true, confirmedAt: null, id: "" },
        activityId
      );
      newSubscription.subscriptionStatus = SubscriptionStatus.Approved;
    } else {
      newSubscription = await createSubscription(
        { userId, activityId, approved: false, confirmedAt: null, id: "" },
        activityId
      );
      newSubscription.subscriptionStatus = SubscriptionStatus.WaitingForApproval;
    }
    

    const { approved, ...responseData } = newSubscription;
    newSubscription.subscriptionStatus = SubscriptionStatus.WaitingForApproval;
    
   
    res.status(200).json({
        ...responseData, 
        subscriptionStatus: newSubscription.subscriptionStatus
    });
    grantAchievement("Starting", userId);
    
   

  } catch (error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        res.status(404).json({ error: "Atividade não encontrada" });
        return;
      }
      if (error.code === "P2003") {
        res.status(404).json({ error: "Atividade não encontrada" });
        return;
      }
    }
    console.error("Erro ao criar inscrição:", error);
    res.status(500).json({ error: "Erro inesperado" });
  }
}
export async function deleteActivitySubscriptionController(req: Request, res: Response) {
  try {
    const userId = req.userId;
    const activityId = req.params.id;

    const result = await deleteActivitySubscriptionService(userId, activityId);

    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.error || "Erro inesperado" });
  }
}
export async function getActivityPartipantsController(req: Request, res: Response) {
  try {
    const activityId = req.params.id;
    if (!activityId) {
    res.status(404).json({ error: "Aividade não encontrada" });
      return ;
    }
    const subscriptions = await getActivitiesParticipants(activityId);

    if (subscriptions === null) {
      res.status(404).json({ error: "Atividade não encontrada" });return ;
    }

    res.status(200).json(subscriptions);
  } catch (error: any) {
    if (
      (error instanceof PrismaClientKnownRequestError && error.code === "P2025") ||
      error.message === "Atividade não encontrada" 
    ) {
      res.status(404).json({ error: "Atividade não encontrada" });
      return;
    }

    console.error("Erro ao buscar inscrições:", error);
    res.status(500).json({ error: "Erro inesperado" });
  }
}
export async function getAllUserActivitiesController(req: Request, res: Response) {
  try {
    const userId = req.userId;

    const activities = await fetchAllUserActivities(userId);

    res.status(200).json(activities);
  } catch (error: any) {
    console.error("Erro ao buscar atividades do participante:", error);
    res.status(500).json({ error: "Erro inesperado" });
  }
}
export async function getPaginatedUserActivitiesController(req: Request, res: Response) {
  try {
    const userId = req.userId;
    const { page = 1, pageSize = 10 } = req.query;

    const result = await fetchPaginatedUserActivitiesWithCount(userId, Number(page), Number(pageSize));

    res.status(200).json(result);
  } catch (error: any) {
    console.error("Erro ao buscar atividades do participante:", error);
    res.status(500).json({ error: "Erro inesperado" });
  }
}
export async function getAllCreatorActivitiesController(req: Request, res: Response) {
  try {
    const userId = req.userId;

    const activities = await fetchAllCreatorActivities(userId);

    res.status(200).json(activities);
  } catch (error: any) {
    console.error("Erro ao buscar atividades do criador:", error);
    res.status(500).json({ error: "Erro inesperado" });
  }
}

export async function getPaginatedCreatorActivitiesController(req: Request, res: Response) {
  try {
    const userId = req.userId;
    const { page = 1, pageSize = 10 } = req.query;

    const result = await fetchPaginatedCreatorActivitiesWithCount(userId, Number(page), Number(pageSize));

    res.status(200).json(result);
  } catch (error: any) {
    console.error("Erro ao buscar atividades do criador:", error);
    res.status(500).json({ error: "Erro inesperado" });
  }
}
export async function getAllActivitiesController(req: Request, res: Response) {
  try {
    const userId = req.userId;
    const activities = await fetchAllActivitiesWithSubscription(userId);
    res.status(200).json(activities);
  } catch (error: any) {
    console.error("Erro ao buscar todas as atividades:", error);
    res.status(500).json({ error: "Erro inesperado" });
  }
}


export async function concludeActivityController(req: Request, res: Response) {
  try {
    const userId = req.userId;
    const activityId = req.params.id;

    const concludedActivity = await concludeActivityService(userId, activityId);

    res.status(200).json({ message: "Atividade concluída com sucesso" });
  } catch (error: any) {
    if (error.status) {
      res.status(error.status).json({ error: error.error });
    } else {
      console.error("Erro ao concluir atividade:", error);
      res.status(500).json({ error: "Erro inesperado" });
    }
  }
}

export async function approveActivityController(req: Request, res: Response) {
  try {
    const userId = req.userId;
    const activityId = req.params.id;
    const { participantId, approved } = req.body;

    const result = await approveActivityService(userId, activityId, participantId, approved);

    res.status(200).json(result);
  } catch (error: any) {
    if (error.status) {
      res.status(error.status).json({ error: error.error });
    } else {
      console.error("Erro ao aprovar participante:", error);
      res.status(500).json({ error: "Erro inesperado" });
    }
  }
}

export async function checkInActivityController(req: Request, res: Response) {
  try {
    const userId = req.userId;
    const activityId = req.params.id;
    const { confirmationCode } = req.body;

    const result = await checkInActivityService(userId, activityId, confirmationCode);

    res.status(200).json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.error || "Erro inesperado" });
  }
}
export async function getActivitiesController(req: Request, res: Response) {
  try {
    const { typeId, orderBy = "createdAt", order = "desc", page = 1, pageSize = 10 } = req.query;

    const result = await fetchActivitiesWithPagination(
      typeId as string,
      orderBy as string,
      order as string,
      Number(page),
      Number(pageSize)
    );

    res.status(200).json(result);
  } catch (error: any) {
    console.error("Erro ao buscar atividades:", error);
    res.status(500).json({ error: "Erro inesperado" });
  }
}