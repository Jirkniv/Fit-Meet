import { describe, expect, test, jest } from "@jest/globals";
import request from "supertest";
import express, { json } from "express";
import * as UserService from "../../services/UserService";
import userRouter from "../../routes/UserRoutes";
import { Request, Response, NextFunction } from "express";
import authGuard from "../../middlewares/AuthGuard";


// Mock do servidor
const server = express();
server.use(json());
userRouter(server);

// Mock das funções do UserService
jest.mock("../../services/UserService", () => ({
  fetchAllUsers: jest.fn(),
  fetchLoggedUser: jest.fn(),
  updateUserDetails: jest.fn(),
  deactivateUser: jest.fn(),
  defineUserPreference: jest.fn(),
  fetchUserPreferences: jest.fn(),
  updateUserAvatar: jest.fn(),
}));


jest.mock("../../middlewares/authGuard", () => jest.fn((req: Request, res: Response, next: (err?: any) => void) => {
    req.userId = "123"; 
    next();
  }));
  

describe("User Controller", () => {
  describe("GET /user", () => {
    test("Should return 200 and the logged-in user data", async () => {
      jest.spyOn(UserService, "fetchLoggedUser").mockResolvedValue({
        id: "123",
        name: "Igor",
        email: "igor@gmail.com",
        cpf: "12345678900",
        avatar: null,
        xp: 100,
        level: 1,
        UserAchievements: [],
      });

      const response = await request(server).get("/user").set("Authorization", "Bearer token");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: "123",
        name: "Igor",
        email: "igor@gmail.com",
        cpf: "12345678900",
        avatar: null,
        xp: 100,
        level: 1,
        UserAchievements: [],
      });

      expect(UserService.fetchLoggedUser).toHaveBeenCalledWith(expect.any(String));
    });

    test("Should return 404 when user is not found", async () => {
      jest.spyOn(UserService, "fetchLoggedUser").mockRejectedValue(new Error("Usuário não encontrado"));

      const response = await request(server).get("/user").set("Authorization", "Bearer token");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Usuário não encontrado" });

      expect(UserService.fetchLoggedUser).toHaveBeenCalledWith(expect.any(String));
    });
  });

  describe("PUT /user/update", () => {
    test("Should return 200 and the updated user data", async () => {
      jest.spyOn(UserService, "updateUserDetails").mockResolvedValue({
        id: "123",
        name: "Igor Updated",
        email: "igor_updated@gmail.com",
        cpf: "12345678900",
        avatar: null,
        xp: 100,
        level: 1,
      });

      const response = await request(server).put("/user/update").send({
        name: "Igor Updated",
        email: "igor_updated@gmail.com",
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        user: {
          id: "123",
          name: "Igor Updated",
          email: "igor_updated@gmail.com",
          cpf: "12345678900",
          avatar: null,
          xp: 100,
          level: 1,
        },
      });

      expect(UserService.updateUserDetails).toHaveBeenCalledWith(expect.any(String), {
        name: "Igor Updated",
        email: "igor_updated@gmail.com",
      });
    });

    test("Should return 404 when user is not found", async () => {
      jest.spyOn(UserService, "updateUserDetails").mockRejectedValue(new Error("Usuário não encontrado"));

      const response = await request(server).put("/user/update").send({
        name: "Igor Updated",
        email: "igor_updated@gmail.com",
      });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Usuário não encontrado" });

      expect(UserService.updateUserDetails).toHaveBeenCalledWith(expect.any(String), {
        name: "Igor Updated",
        email: "igor_updated@gmail.com",
      });
    });
  });

  describe("DELETE /user/deactivate", () => {
    test("Should return 200 when user is successfully deactivated", async () => {
        jest.spyOn(UserService, "deactivateUser").mockResolvedValue({
            id: "123",
            name: "Igor",
            email: "igor@gmail.com",
            cpf: "12345678900",
            password: "password", // Add this property
            avatar: null,
            xp: 100,
            level: 1,
            deletedAt: null, // Add this property
          });

      const response = await request(server).delete("/user/deactivate");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Conta desativada com sucesso" });

      expect(UserService.deactivateUser).toHaveBeenCalledWith(expect.any(String));
    });

    test("Should return 404 when user is not found", async () => {
      jest.spyOn(UserService, "deactivateUser").mockRejectedValue(new Error("Usuário não encontrado"));

      const response = await request(server).delete("/user/deactivate");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Usuário não encontrado" });

      expect(UserService.deactivateUser).toHaveBeenCalledWith(expect.any(String));
    });
  });

  describe("GET /user/preferences", () => {
    test("Should return 200 and user preferences", async () => {
      jest.spyOn(UserService, "fetchUserPreferences").mockResolvedValue([
        { typeId: "1", typeName: "Sports", typeDescription: "Esportes" },
        { typeId: "2", typeName: "Music", typeDescription: "Música" },
      ]);

      const response = await request(server).get("/user/preferences");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { typeId: "1", typeName: "Sports", typeDescription: "Esportes" },
        { typeId: "2", typeName: "Music", typeDescription: "Música" },
      ]);

      expect(UserService.fetchUserPreferences).toHaveBeenCalledWith(expect.any(String));
    });

    test("Should return 500 when an unexpected error occurs", async () => {
      jest.spyOn(UserService, "fetchUserPreferences").mockRejectedValue(new Error("Erro inesperado"));

      const response = await request(server).get("/user/preferences");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Erro inesperado" });

      expect(UserService.fetchUserPreferences).toHaveBeenCalledWith(expect.any(String));
    });
  });

  describe("POST /user/preferences/define", () => {
    test("Should return 201 when user preferences are successfully defined", async () => {
      jest.spyOn(UserService, "defineUserPreference").mockResolvedValue({
        message: "Preferências atualizadas com sucesso",
      });
  
      const response = await request(server)
        .post("/user/preferences/define")
        .set("Authorization", "Bearer token")
        .send({
          typeId: "1",
        });
  
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: "Preferências atualizadas com sucesso" });
  
      expect(UserService.defineUserPreference).toHaveBeenCalledWith("123", "1");
    });
  
    test("Should return 404 when typeId is invalid", async () => {
      jest.spyOn(UserService, "defineUserPreference").mockRejectedValue(
        new Error("Um ou mais IDs informados são inválidos")
      );
  
      const response = await request(server)
        .post("/user/preferences/define")
        .set("Authorization", "Bearer token")
        .send({
          typeId: "invalid-id",
        });
  
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Um ou mais IDs informados são inválidos" });
  
      expect(UserService.defineUserPreference).toHaveBeenCalledWith("123", "invalid-id");
    });
  
    test("Should return 500 when an unexpected error occurs", async () => {
      jest.spyOn(UserService, "defineUserPreference").mockRejectedValue(new Error("Erro inesperado"));
  
      const response = await request(server)
        .post("/user/preferences/define")
        .set("Authorization", "Bearer token")
        .send({
          typeId: "1",
        });
  
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Erro inesperado" });
  
      expect(UserService.defineUserPreference).toHaveBeenCalledWith("123", "1");
    });
  
    test("Should return 400 when typeId is not provided", async () => {
      const response = await request(server)
        .post("/user/preferences/define")
        .set("Authorization", "Bearer token")
        .send({});
  
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "O campo 'typeId' é obrigatório" });
    });
  });

  describe("PUT /user/avatar", () => {
    test("Should return 200 and the updated avatar URL", async () => {
      jest.spyOn(UserService, "updateUserAvatar").mockResolvedValue({
        id: "123",
        name: "John Doe",
        email: "john.doe@example.com",
        cpf: "12345678900",
        avatar: "http://example.com/avatar.png",
        xp: 100,
        level: 1,
        deletedAt: null,
        password: "hashed-password",
      });
  
      const response = await request(server)
        .put("/user/avatar")
        .set("Authorization", "Bearer token") // Se precisar autenticar
        .attach("avatar", Buffer.from("image data"), "avatar.png");
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ avatar: "http://example.com/avatar.png" });
  
      expect(UserService.updateUserAvatar).toHaveBeenCalledWith(expect.any(String), expect.any(Object));
    });
  
    test("Should return 400 when no file is provided", async () => {
      const response = await request(server)
        .put("/user/avatar")
        .set("Authorization", "Bearer token");
  
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "A imagem deve ser um arquivo PNG ou JPG" });
    });
  });

});  