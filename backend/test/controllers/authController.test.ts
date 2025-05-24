import { describe, expect, test, jest } from "@jest/globals";
import request from "supertest";
import express, { json } from "express";
import authRouter from "../../routes/AuthRoutes";
import * as AuthService from "../../services/AuthService"; // Importa o módulo para mockar

// Mock do servidor
const server = express();
server.use(json());
authRouter(server);

// Mock das funções do AuthService
jest.mock("../../services/AuthService", () => ({
  authenticateUser: jest.fn(),
  createUser: jest.fn(),
}));

describe("Auth Controller", () => {
  describe("POST /auth/signIn", () => {
    test("Should return 200 and a token when authentication is successful", async () => {
      // Mock da função authenticateUser
      jest.spyOn(AuthService, "authenticateUser").mockResolvedValue({
        token: "mocked-jwt-token",
        user: {
          id: "123",
          name: "Igor",
          email: "igor@gmail.com",
          cpf: "12345678900",
          deletedAt: null,
          avatar: null,
          xp: 100,
          level: 1,
          UserAchievements: [
            {
              achievement: {
                name: "First Login",
                criterion: "Log in for the first time",
              },
            },
          ],
        },
      });

      const response = await request(server).post("/auth/signIn").send({
        email: "igor@gmail.com",
        password: "123456",
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        token: "mocked-jwt-token",
        user: {
          id: "123",
          name: "Igor",
          email: "igor@gmail.com",
          cpf: "12345678900",
          avatar: null,
          xp: 100,
          level: 1,
          UserAchievements: [
            {
              achievement: {
                name: "First Login",
                criterion: "Log in for the first time",
              },
            },
          ],
        },
      });
    });

    test("Should return 401 when password is incorrect", async () => {
      // Mock da função authenticateUser para lançar erro de senha incorreta
      jest.spyOn(AuthService, "authenticateUser").mockRejectedValue(new Error("INVALID_PASSWORD"));

      const response = await request(server).post("/auth/signIn").send({
        email: "igor@gmail.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: "Senha incorreta" });
    });

    test("Should return 404 when user is not found", async () => {
      // Mock da função authenticateUser para lançar erro de usuário não encontrado
      jest.spyOn(AuthService, "authenticateUser").mockRejectedValue(new Error("USER_NOT_FOUND"));

      const response = await request(server).post("/auth/signIn").send({
        email: "notfound@gmail.com",
        password: "123456",
      });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Usuário não encontrado" });
    });
  });

  describe("POST /auth/register", () => {
    test("Should return 201 when user is successfully registered", async () => {
      // Mock da função createUser para simular sucesso
      jest.spyOn(AuthService, "createUser").mockResolvedValue({
        id: "123",
        name: "Junior",
        email: "elizabeth@gmail.com",
        cpf: "11345699999",
        password: "hashed-password",
        avatar: null,
        xp: 0,
        level: 1,
        deletedAt: null,
      });
      const response = await request(server).post("/auth/register").send({
        name: "Junior",
        email: "elizabeth@gmail.com",
        password: "123456",
        cpf: "11345699999",
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: "Usuário criado com sucesso" });
    });

    test("Should return 409 when email or CPF already exists", async () => {
      // Mock da função createUser para lançar erro de conflito
      jest.spyOn(AuthService, "createUser").mockRejectedValue(new Error("EMAIL_OR_CPF_EXISTS"));

      const response = await request(server).post("/auth/register").send({
        name: "Igor",
        email: "igor@gmail.com",
        password: "123456",
        cpf: "12345678900",
      });

      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        error: "O email ou CPF informado já pertence a outro usuário",
      });
    });

    test("Should return 500 when an unexpected error occurs", async () => {
      // Mock da função createUser para lançar erro genérico
      jest.spyOn(AuthService, "createUser").mockRejectedValue(new Error("SERVER_ERROR"));

      const response = await request(server).post("/auth/register").send({
        name: "Igor",
        email: "igor@gmail.com",
        password: "123456",
        cpf: "123.456.789-00",
      });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Ocorreu um erro no servidor." });
    });
  });
});