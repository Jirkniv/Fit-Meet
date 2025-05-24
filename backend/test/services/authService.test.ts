import { describe, expect, test, jest, beforeEach } from "@jest/globals";
import { authenticateUser, createUser } from "../../services/AuthService";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as UserRepository from "../../repositories/UserRepository";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const mockUser = {
  id: "123",
  name: "Igor",
  email: "igor@gmail.com",
  cpf: "12345678900",
  deletedAt: null,
  password: "hashed-password",
  avatar: "avatar",
  xp: 0,
  level: 1,
  UserAchievements: [],
};

process.env.JWT_SECRET = "test-secret"; // Configurando a variável de ambiente para os testes

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

jest.mock("../../repositories/UserRepository", () => ({
  getByEmail: jest.fn(),
  register: jest.fn(), // Este é o nome correto!
}));

describe("Auth Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("authenticateUser", () => {
    test("Should return token and user data when authentication is successful", async () => {
      jest.spyOn(UserRepository, "getByEmail").mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, "compare").mockImplementation(() => Promise.resolve(true));
      jest.spyOn(jwt, "sign").mockImplementation(() => "mocked-jwt-token");

      const result = await authenticateUser("igor@gmail.com", "123456");

      expect(result).toEqual({
        token: "mocked-jwt-token",
        user: {
          id: "123",
          name: "Igor",
          email: "igor@gmail.com",
          cpf: "12345678900",
          avatar: "avatar",
          xp: 0,
          level: 1,
          UserAchievements: [],
        },
      });
    });

    test("Should throw an error when user is not found", async () => {
      jest.spyOn(UserRepository, "getByEmail").mockResolvedValue(null);

      await expect(authenticateUser("notfound@gmail.com", "123456"))
        .rejects.toThrow("USER_NOT_FOUND");
    });

    test("Should throw an error when password is incorrect", async () => {
      jest.spyOn(UserRepository, "getByEmail").mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, "compare").mockImplementation(() => Promise.resolve(false));

      await expect(authenticateUser("igor@gmail.com", "wrongpassword"))
        .rejects.toThrow("INVALID_PASSWORD");
    });
  });

  describe("createUser", () => {
    test("Should create a user and return user data", async () => {
        const newUser = {
          name: "Junior",
          email: "junior@gmail.com",
          password: "123456",
          cpf: "12345678999",
          avatar: "avatar",
        };
      
        const hashedPassword = "hashed-password";
      
        jest.spyOn(bcrypt, "hash").mockImplementation(() => Promise.resolve(hashedPassword));
        jest.spyOn(UserRepository, "register").mockResolvedValue({
          id: "456",
          name: "Junior",
          email: "junior@gmail.com",
          password: hashedPassword,
          cpf: "12345678999",
          avatar: "avatar",
          xp: 0,
          level: 1,
          deletedAt: null,
          // <- Aqui removemos a senha do retorno
        });
      
        const result = await createUser(newUser);
      
        expect(result).toEqual({
          id: "456",
          name: "Junior",
          email: "junior@gmail.com",
          cpf: "12345678999",
          password: hashedPassword,
          avatar: "avatar",
          xp: 0,
          level: 1,
          deletedAt: null,
        });
      });
      

    test("Should throw an error when email or CPF already exists", async () => {
        // Simula um erro do Prisma com o código P2002
        const prismaError = new PrismaClientKnownRequestError(
          "Unique constraint failed on the fields: (`email`)",
          {
            code: "P2002",
            clientVersion: "4.5.0",
          }
        );
      
        jest.spyOn(UserRepository, "register").mockRejectedValue(prismaError);
      
        const newUser = {
          name: "Junior",
          email: "junior@gmail.com",
          password: "123456",
          cpf: "12345678999",
          avatar: "avatar",
        };
      
        await expect(createUser(newUser)).rejects.toThrow("EMAIL_OR_CPF_EXISTS");
      });
  });
});
