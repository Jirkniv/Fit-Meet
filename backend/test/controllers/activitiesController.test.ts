import { describe, expect, test, jest } from "@jest/globals";
import request from "supertest";
import express, { json } from "express";
import activityRouter from "../../routes/ActivityRoutes";
import * as ActivityService from "../../services/ActivityService";
import { Request, Response, NextFunction } from 'express';
import File from "multer";
import { SubscriptionStatus } from "../../types/subscriptionStats";
import { getActivitiesParticipants } from "../../repositories/ActivityRepository";
import { create } from "../../repositories/achievementsRepository";




const server = express();
server.use(json());
activityRouter(server);

jest.mock("../../repositories/ActivityRepository", () => ({
  getActivitiesParticipants: jest.fn(),
  checkSubscriptionExists: jest.fn(),
  
}));
jest.mock("../../services/ActivityService", () => ({
  fetchActivityTypes: jest.fn(),
  createActivityService: jest.fn(),
  softDeleteActivityService: jest.fn(),
  updateActivityService: jest.fn(),
  fetchAllActivitiesWithSubscription: jest.fn(),
  fetchActivitiesWithPagination: jest.fn(),
  approveActivityService: jest.fn(),
  concludeActivityService: jest.fn(),
  checkInActivityService: jest.fn(),
  fetchPaginatedCreatorActivitiesWithCount: jest.fn(),
  fetchPaginatedUserActivitiesWithCount: jest.fn(),
  fetchAllCreatorActivities: jest.fn(),
  fetchAllUserActivities: jest.fn(),
  createSubscription: jest.fn(),
 deleteActivitySubscriptionService: jest.fn(),

}));


jest.mock("../../middlewares/AuthGuard", () =>
  jest.fn((req: Request, res: Response, next: (err?: any) => void) => {
    req.userId = "123";
    next();
  })
);

jest.mock("../../middlewares/AwardXp", () => ({
    xpMiddleware: jest.fn(() => (req: Request, res: Response, next: (err?: any) => void) => {
      next(); 
    }),
  }));

jest.mock("../../middlewares/CheckUserStatus", () =>
  jest.fn((req: Request, res: Response, next: (err?: any) => void) => {
    next();
  })
);

jest.mock("../../middlewares/multer", () => ({
    single: jest.fn(() => (req: Request, res: Response, next: NextFunction) => {
      req.file = {
        fieldname: "image",
        originalname: "image.png",
        encoding: "7bit",
        mimetype: "image/png",
        size: 1024,
        buffer: Buffer.from("image data"),
      } as Express.Multer.File;
      next();
    }),
  }));
  
  
  
  jest.mock("../../services/s3Service", () => ({
    uploadImage: jest.fn<() => Promise<string>>().mockResolvedValue("http://example.com/image.png")
  }));


describe("Activity Controller", () => {
  describe("GET /activities/types", () => {
    test("Should return 200 and activity types", async () => {
      jest.spyOn(ActivityService, "fetchActivityTypes").mockResolvedValue([
        { id: "1", name: "Sports", description: "Sports activities", image: "http://example.com/image.png" },
        { id: "2", name: "Music", description: "Music activities", image: "http://example.com/image.png" },
      ]);

      const response = await request(server).get("/activities/types");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { id: "1", name: "Sports", description: "Sports activities", image: "http://example.com/image.png" },
        { id: "2", name: "Music", description: "Music activities", image: "http://example.com/image.png" },
      ]);

      expect(ActivityService.fetchActivityTypes).toHaveBeenCalled();
    });

    test("Should return 404 when no activity types are found", async () => {
      jest.spyOn(ActivityService, "fetchActivityTypes").mockRejectedValue(
        new Error("Nenhum tipo de atividade encontrado")
      );

      const response = await request(server).get("/activities/types");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Nenhum tipo de atividade encontrado" });

      expect(ActivityService.fetchActivityTypes).toHaveBeenCalled();
    });
  });

  describe("POST /activities/new", () => {
    describe("POST /activities/new", () => {
        test("Should return 201 when activity is successfully created", async () => {
          jest.spyOn(ActivityService, "createActivityService").mockResolvedValue({
            id: "1",
            title: "New Activity",
            description: "Description",
            typeId: "1",
            image: "http://example.com/image.png",
            ActivityAddresses: {
              latitude: -23.55052,
              longitude: -46.633308
            },
            scheduledDate: new Date("2025-03-30T10:00:00.000Z"),
            private: false,
            creator: {
              id: "123",
              name: "John Doe",
              avatar: null
            },
            createdAt: new Date()
          });
      
          const response = await request(server)
            .post("/activities/new")
            .set("Authorization", "Bearer token")
            .field("title", "New Activity")
            .field("description", "Description")
            .field("typeId", "1")
            .field("scheduledAt", "2025-03-30T10:00:00.000Z")
            .field("private", "false")
            .field("address", "-23.55052,-46.633308")
            .attach("image", Buffer.from("image data"), "image.png");  // Adicione isto
      
          expect(response.status).toBe(201);
          expect(response.body).toEqual({
            id: "1",
            title: "New Activity",
            description: "Description",
            typeId: "1",
            image: "http://example.com/image.png",
            address: { latitude: -23.55052, longitude: -46.633308 },
            scheduledDate: "2025-03-30T10:00:00.000Z",
            private: false,
          });
      
          expect(ActivityService.createActivityService).toHaveBeenCalledWith("123", {
            title: "New Activity",
            description: "Description",
            typeId: "1",
            image: "http://example.com/image.png",
            address: { latitude: -23.55052, longitude: -46.633308 },
            scheduledDate: "2025-03-30T10:00:00.000Z",
            private: false,
          });
        });
      });
      

    test("Should return 400 when address is invalid", async () => {
      const response = await request(server)
        .post("/activities/new")
        .set("Authorization", "Bearer token")
        .field("title", "New Activity")
        .field("description", "Description")
        .field("typeId", "1")
        .field("scheduledAt", "2025-03-30T10:00:00.000Z")
        .field("private", "false")
        .field("address", "invalid-address");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "O campo 'address' é obrigatório e deve estar no formato 'latitude,longitude'",
      });
    });
  });

  describe("DELETE /activities/:id/delete", () => {
    test("Should return 200 when activity is successfully deleted", async () => {
      jest.spyOn(ActivityService, "softDeleteActivityService").mockResolvedValue({
        message: "Atividade excluída com sucesso",
      });

      const response = await request(server)
        .delete("/activities/1/delete")
        .set("Authorization", "Bearer token");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Atividade excluída com sucesso" });

      expect(ActivityService.softDeleteActivityService).toHaveBeenCalledWith("123", "1");
    });

    test("Should return 404 when activity is not found", async () => {
        jest.spyOn(ActivityService, "softDeleteActivityService").mockRejectedValue({
          status: 404,
          error: "Atividade não encontrada",
        });
      
        const response = await request(server)
          .delete("/activities/1/delete")
          .set("Authorization", "Bearer token");
      
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Atividade não encontrada" });
      
        expect(ActivityService.softDeleteActivityService).toHaveBeenCalledWith("123", "1");
      });
  });      

  describe("PUT /activities/:id/update", () => {
    test("Should return 200 when activity is successfully updated", async () => {
      jest.spyOn(ActivityService, "updateActivityService").mockResolvedValue({
        id: "1",
        title: "Updated Activity",
        description: "Updated Description",
        typeId: "1",
        image: "http://example.com/image.png",
        ActivityAddresses: { latitude: -23.55052, longitude: -46.633308 },
        scheduledDate: new Date("2025-03-30T10:00:00.000Z"),
        private: false,
        creator: { id: "123", name: "John Doe", avatar: null },
        createdAt: new Date("2022-01-01T00:00:00.000Z"),
        completedAt: null,
      });

      const response = await request(server)
        .put("/activities/1/update")
        .set("Authorization", "Bearer token")
        .field("title", "Updated Activity")
        .field("description", "Updated Description")
        .field("typeId", "1")
        .field("scheduledAt", "2025-03-30T10:00:00.000Z")
        .field("private", "false")
        .field("address", "-23.55052,-46.633308")
        .attach("image", Buffer.from("image data"), "image.png");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: "1",
        title: "Updated Activity",
        description: "Updated Description",
        typeId: "1",
        image: "http://example.com/image.png",
        address: { latitude: -23.55052, longitude: -46.633308 },
        scheduledDate: "2025-03-30T10:00:00.000Z",
        private: false,
      });

      expect(ActivityService.updateActivityService).toHaveBeenCalledWith("123", "1", {
        title: "Updated Activity",
        description: "Updated Description",
        typeId: "1",
        image: "http://example.com/image.png",
        address: { latitude: -23.55052, longitude: -46.633308 },
        scheduledDate: "2025-03-30T10:00:00.000Z",
        private: false,
      });
    });

    test("Should return 404 when activity is not found", async () => {
      jest.spyOn(ActivityService, "updateActivityService").mockRejectedValue({
        status: 404,
        error: "Atividade não encontrada",
      });

      const response = await request(server)
  .put("/activities/1/update")
  .set("Authorization", "Bearer token")
  .field("title", "Updated Activity")
  .field("description", "Updated Description")
  .field("typeId", "1")
  .field("scheduledAt", "2025-03-30T10:00:00.000Z")
  .field("private", "false")
  .field("address", "10.0,20.0"); 

     
      expect(response.body).toEqual({ error: "Atividade não encontrada" });

      expect(ActivityService.updateActivityService).toHaveBeenCalledWith("123", "1", expect.any(Object));
    });
  });

  describe("PUT /activities/:id/conclude", () => {
    test("Should return 200 when activity is successfully concluded", async () => {
      jest.spyOn(ActivityService, "concludeActivityService").mockResolvedValue({
        message: "Atividade concluída com sucesso",
      });

      const response = await request(server)
        .put("/activities/1/conclude")
        .set("Authorization", "Bearer token");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Atividade concluída com sucesso" });

      expect(ActivityService.concludeActivityService).toHaveBeenCalledWith("123", "1");
    });

    test("Should return 404 when activity is not found", async () => {
      jest.spyOn(ActivityService, "concludeActivityService").mockRejectedValue({
        status: 404,
        error: "Atividade não encontrada",
      });

      const response = await request(server)
        .put("/activities/1/conclude")
        .set("Authorization", "Bearer token");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Atividade não encontrada" });

      expect(ActivityService.concludeActivityService).toHaveBeenCalledWith("123", "1");
    });
  });

  describe("PUT /activities/:id/approve", () => {
    test("Should return 200 when participant is successfully approved", async () => {
      jest.spyOn(ActivityService, "approveActivityService").mockResolvedValue({
        message: "Solicitação de participação atualizada com sucesso",
      });

      const response = await request(server)
        .put("/activities/1/approve")
        .set("Authorization", "Bearer token")
        .send({
          participantId: "456",
          approved: true,
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Solicitação de participação atualizada com sucesso" });

      expect(ActivityService.approveActivityService).toHaveBeenCalledWith("123", "1", "456", true);
    });

    test("Should return 404 when participant is not found", async () => {
      jest.spyOn(ActivityService, "approveActivityService").mockRejectedValue({
        status: 404,
        error: "Participante não encontrado",
      });

      const response = await request(server)
        .put("/activities/1/approve")
        .set("Authorization", "Bearer token")
        .send({
          participantId: "456",
          approved: true,
        });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Participante não encontrado" });

      expect(ActivityService.approveActivityService).toHaveBeenCalledWith("123", "1", "456", true);
    });
  });

  describe("PUT /activities/:id/check-in", () => {
    test("Should return 200 when check-in is successfully completed", async () => {
      jest.spyOn(ActivityService, "checkInActivityService").mockResolvedValue({
        message: "Check-in realizado com sucesso",
      });

      const response = await request(server)
        .put("/activities/1/check-in")
        .set("Authorization", "Bearer token")
        .send({
          confirmationCode: "123456",
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Check-in realizado com sucesso" });

      expect(ActivityService.checkInActivityService).toHaveBeenCalledWith("123", "1", "123456");
    });

    test("Should return 400 when confirmation code is invalid", async () => {
      jest.spyOn(ActivityService, "checkInActivityService").mockRejectedValue({
        status: 400,
        error: "Código de confirmação inválido",
      });

      const response = await request(server)
        .put("/activities/1/check-in")
        .set("Authorization", "Bearer token")
        .send({
          confirmationCode: "invalid-code",
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Código de confirmação inválido" });

      expect(ActivityService.checkInActivityService).toHaveBeenCalledWith("123", "1", "invalid-code");
    });
  });
  describe("GET /activities/all", () => {
    test("Should return 200 and all activities with subscription status", async () => {
      jest.spyOn(ActivityService, "fetchAllActivitiesWithSubscription").mockResolvedValue([
        {
          id: "1",
          title: "Activity 1",
          description: "Description 1",
          type: "1",
          image: "http://example.com/image1.png",
          address: {
            latitude: 10.0,
            longitude: 20.0,
          },
          scheduledDate: new Date("2023-03-01T14:00:00.000Z"),
          createdAt: new Date("2023-03-01T12:00:00.000Z"),
          completedAt: null,
          private: false,
          creator: {
            id: "123",
            name: "John Doe",
            avatar: "http://example.com/avatar.jpg",
          },
          subscriptionStatus: SubscriptionStatus.Approved,
        },
      ]);
        
     
  
      const response = await request(server).get("/activities/all").set("Authorization", "Bearer token");
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          id: "1",
          title: "Activity 1",
          description: "Description 1",
          type: "1",
          image: "http://example.com/image1.png",
          address: {
            latitude: 10.0,
            longitude: 20.0,
          },
          scheduledDate: ("2023-03-01T14:00:00.000Z"),
          createdAt: ("2023-03-01T12:00:00.000Z"),
          completedAt: null,
          private: false,
          creator: {
            id: "123",
            name: "John Doe",
            avatar: "http://example.com/avatar.jpg",
          },
          subscriptionStatus: SubscriptionStatus.Approved,
        },
      ]);
  
      expect(ActivityService.fetchAllActivitiesWithSubscription).toHaveBeenCalledWith("123");
    });
  });
  
  describe("GET /activities", () => {
    test("Should return 200 and paginated activities", async () => {
      jest.spyOn(ActivityService, "fetchActivitiesWithPagination").mockResolvedValue({
        page: 1,
        pageSize: 10,
        totalActivities: 1,
        totalPages: 1,
        previous: null,
        next: null,
        activities: [
          {
            id: "1",
            title: "Activity 1",
            description: "Description 1",
            type: "1",
            image: "http://example.com/image1.png",
            confirmationCode: "123456",
            participantCount: 10,
            address: {
              latitude: 10.0,
              longitude: 20.0,
            },
            scheduledDate: new Date("2023-03-01T14:00:00.000Z"),
            createdAt: new Date("2023-03-01T12:00:00.000Z"),
            completedAt: null,
            private: false,
            creator: {
              id: "123",
              name: "John Doe",
              avatar: "http://example.com/avatar.jpg",
            },
            userSubscriptionStatus: SubscriptionStatus.Approved,
          },
        ],
      });
  
      const response = await request(server).get("/activities").set("Authorization", "Bearer token");
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        
          page: 1,
          pageSize: 10,
          totalActivities: 1,
          totalPages: 1,
          previous: null,
          next: null,
          activities: [
            {
              id: "1",
              title: "Activity 1",
              description: "Description 1",
              type: "1",
              image: "http://example.com/image1.png",
              confirmationCode: "123456",
              participantCount: 10,
              address: {
                latitude: 10.0,
                longitude: 20.0,
              },
              scheduledDate: ("2023-03-01T14:00:00.000Z"),
              createdAt: ("2023-03-01T12:00:00.000Z"),
              completedAt: null,
              private: false,
              creator: {
                id: "123",
                name: "John Doe",
                avatar: "http://example.com/avatar.jpg",
              },
              userSubscriptionStatus: "Aprovado", 
            },
        ],
      });
  
      expect(ActivityService.fetchActivitiesWithPagination).toHaveBeenCalledWith(
        undefined,
        "createdAt",
        "desc",
        1,
        10
      );
    });
  });
  
  describe("GET /activities/user/creator/all", () => {
    test("Should return 200 and all activities created by the user", async () => {
      jest.spyOn(ActivityService, "fetchAllCreatorActivities").mockResolvedValue([
        {
          id: "1",
          title: "Activity 1",
          description: "Description 1",
          type: "1",
          image: "http://example.com/image1.png",
          confimationCode: "123456",
          address: {
            latitude: 10.0,
            longitude: 20.0,
          },
          scheduledDate: new Date("2023-03-01T14:00:00.000Z"),
          createdAt: new Date("2023-03-01T12:00:00.000Z"),
          completedAt: null,
          private: false,
          creator: {
            id: "123",
            name: "John Doe",
            avatar: "http://example.com/avatar.jpg",
          },
        }
      ]);
  
      const response = await request(server).get("/activities/user/creator/all").set("Authorization", "Bearer token");
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          id: "1",
          title: "Activity 1",
          description: "Description 1",
          type: "1",
          image: "http://example.com/image1.png",
          confimationCode: "123456",
          address: {
            latitude: 10.0,
            longitude: 20.0,
          },
          scheduledDate: ("2023-03-01T14:00:00.000Z"),
          createdAt: ("2023-03-01T12:00:00.000Z"),
          completedAt: null,
          private: false,
          creator: {
            id: "123",
            name: "John Doe",
            avatar: "http://example.com/avatar.jpg",
          },
        },
      ]);
  
      expect(ActivityService.fetchAllCreatorActivities).toHaveBeenCalledWith("123");
    });
  });
  
  describe("GET /activities/:id/participants", () => {
    test("Should return 200 and participants of the activity", async () => {
      const ActivityRepository = require("../../repositories/ActivityRepository");
      jest.spyOn(ActivityRepository, "getActivitiesParticipants").mockResolvedValue([
        { id: "1", name: "John Doe", avatar: null },
      ]);
    
      const response = await request(server).get("/activities/1/participants").set("Authorization", "Bearer token");
    
      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ id: "1", name: "John Doe", avatar: null }]);
    
      expect(ActivityRepository.getActivitiesParticipants).toHaveBeenCalledWith("1");
    });
  
    test("Should return 404 when activity is not found", async () => {
      const ActivityRepository = require("../../repositories/ActivityRepository");
      jest.spyOn(ActivityRepository, "getActivitiesParticipants").mockRejectedValue(new Error("Atividade não encontrada"));

  
      const response = await request(server).get("/activities/1/participants").set("Authorization", "Bearer token");
  
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Atividade não encontrada" });
  
      expect(ActivityRepository.getActivitiesParticipants).toHaveBeenCalledWith("1");
    });
  });
  
  describe("DELETE /activities/:id/unsubscribe", () => {
    test("Should return 200 when subscription is successfully deleted", async () => {
      jest.spyOn(ActivityService, "deleteActivitySubscriptionService").mockResolvedValue({
        message: "Inscrição cancelada com sucesso",
      });
  
      const response = await request(server).delete("/activities/1/unsubscribe").set("Authorization", "Bearer token");
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Inscrição cancelada com sucesso" });
  
      expect(ActivityService.deleteActivitySubscriptionService).toHaveBeenCalledWith("123", "1");
    });
  
    test("Should return 404 when subscription is not found", async () => {
      jest.spyOn(ActivityService, "deleteActivitySubscriptionService").mockRejectedValue({
        status: 404,
        error: "Inscrição não encontrada",
      });
  
      const response = await request(server).delete("/activities/1/unsubscribe").set("Authorization", "Bearer token");
  
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Inscrição não encontrada" });
  
      expect(ActivityService.deleteActivitySubscriptionService).toHaveBeenCalledWith("123", "1");
    });
  });
  
  describe("POST /activities/:id/subscribe", () => {
    test("Should return 200 when subscription is successfully created", async () => {
      jest.spyOn(ActivityService, "createSubscription").mockResolvedValue({
        id: "1",
        subscriptionStatus: SubscriptionStatus.Approved,
        approved: true,
        confirmedAt: null,
        activityId: "1",
        userId: "123",
      });
  
      const response = await request(server).post("/activities/1/subscribe").set("Authorization", "Bearer token");
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: "1",
        subscriptionStatus: "Approved",
      });
  
      expect(ActivityService.createSubscription).toHaveBeenCalledWith(
        { userId: "123", activityId: "1", approved: true, confirmedAt: null, id: "" },
        "1"
      );
    });
  
    test("Should return 409 when user is already subscribed", async () => {
      jest.spyOn(ActivityService, "createSubscription").mockRejectedValue({
        status: 409,
        error: "Você já se registrou nesta atividade",
      });
  
      const response = await request(server).post("/activities/1/subscribe").set("Authorization", "Bearer token");
  
      expect(response.status).toBe(409);
      expect(response.body).toEqual({ error: "Você já se registrou nesta atividade" });
  
      expect(ActivityService.createSubscription).toHaveBeenCalledWith(
        { userId: "123", activityId: "1", approved: true, confirmedAt: null, id: "" },
        "1"
      );
    });
  });
})
