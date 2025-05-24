import { describe, expect, test, jest } from "@jest/globals";
import * as UserService from "../../services/UserService";
import * as UserRepository from "../../repositories/UserRepository";
import { Request, Response, NextFunction } from "express";
import prisma from "../../prismaClient";


import checkUserStatus from "../../middlewares/CheckUserStatus";

jest.mock("../../repositories/UserRepository", () => ({
  getByEmail: jest.fn(),
  getUserById: jest.fn(),
  updateUser: jest.fn(),
  softDeleteUser: jest.fn(),
  getUserPreferences: jest.fn(),
  createPreference: jest.fn(),
  deleteUserPreferences: jest.fn(),
  putAvatar: jest.fn(),
}));

jest.mock("../../middlewares/authGuard", () => jest.fn((req: Request, res: Response, next: (err?: any) => void) => {
    req.userId = "123"; 
    next();
  }));


  const mockCheckUserStatus = jest.fn((req: Request, res: Response, next: NextFunction) => {
    req.userId = "123"; 
    next(); 
    return Promise.resolve(); 
  });
  
  (checkUserStatus as jest.MockedFunction<typeof checkUserStatus>) = mockCheckUserStatus;
  
  

describe("User Service", () => {
  describe("fetchLoggedUser", () => {
    test("Should return user data when user is found", async () => {
        const mockUser = {
            id: "123",
            name: "Igor",
            email: "igor@gmail.com",
            password: "password",
            deletedAt: null,
            cpf: "12345678900",
            avatar: "http://example.com/default-avatar.png",
            xp: 100,
            level: 1,
            UserAchievements: [{
              achievement: {
                name: "First Login",
                criterion: "Log in for the first time",
              },
            }],
          };

      jest.spyOn(UserRepository, "getUserById").mockResolvedValue(mockUser);

      const result = await UserService.fetchLoggedUser("123");

      expect(result).toEqual(mockUser);
      expect(UserRepository.getUserById).toHaveBeenCalledWith("123");
    });

    test("Should throw an error when user is not found", async () => {
      jest.spyOn(UserRepository, "getUserById").mockResolvedValue(null);

      await expect(UserService.fetchLoggedUser("123")).rejects.toThrow("Usuário não encontrado");

      expect(UserRepository.getUserById).toHaveBeenCalledWith("123");
    });
  });

  describe("updateUserDetails", () => {
    test("Should update user details and return updated user data", async () => {
      const mockUpdatedUser = {
        id: "123",
        name: "Igor Updated",
        email: "igor_updated@gmail.com",
        cpf: "12345678900",
        avatar: null,
        xp: 100,
        level: 1,
      };

      jest.spyOn(UserRepository, "updateUser").mockResolvedValue(mockUpdatedUser);

      const result = await UserService.updateUserDetails("123", {
        name: "Igor Updated",
        email: "igor_updated@gmail.com",
      });

      expect(result).toEqual(mockUpdatedUser);
      expect(UserRepository.updateUser).toHaveBeenCalledWith("123", {
        name: "Igor Updated",
        email: "igor_updated@gmail.com",
      });
    });

    test("Should throw an error when user is not found", async () => {
        jest.spyOn(UserRepository, "updateUser").mockResolvedValue({
            id: "484984",
            name: "Unknown",
            email: "",
            cpf: "",
            avatar: null,
            xp: 0,
            level: 0,
          });

      await expect(
        UserService.updateUserDetails("123", {
          name: "Igor Updated",
          email: "igor_updated@gmail.com",
        })
      ).rejects.toThrow("Usuário não encontrado");

      expect(UserRepository.updateUser).toHaveBeenCalledWith("123", {
        name: "Igor Updated",
        email: "igor_updated@gmail.com",
      });
    });
  });

  describe("deactivateUser", () => {
    test("Should deactivate user successfully", async () => {
        jest.spyOn(UserRepository, "softDeleteUser").mockResolvedValue({
            id: "123",
            name: "Igor",
            email: "igor@gmail.com",
            cpf: "12345678900",
            password: "password",
            avatar: null,
            xp: 100,
            level: 1,
            deletedAt: null,
          });

      await UserService.deactivateUser("123");

      expect(UserRepository.softDeleteUser).toHaveBeenCalledWith("123");
    });

    test("Should throw an error when user is not found", async () => {
      jest.spyOn(UserRepository, "softDeleteUser").mockRejectedValue(new Error("Usuário não encontrado"));

      await expect(UserService.deactivateUser("123")).rejects.toThrow("Usuário não encontrado");

      expect(UserRepository.softDeleteUser).toHaveBeenCalledWith("123");
    });
  });

  describe("fetchUserPreferences", () => {
    test("Should return user preferences", async () => {
      const mockPreferences = [
        { typeId: "1", typeName: "Sports", typeDescription: "Esportes" },
        { typeId: "2", typeName: "Music", typeDescription: "Música" },
      ];

      jest.spyOn(UserRepository, "getUserPreferences").mockResolvedValue(mockPreferences);

      const result = await UserService.fetchUserPreferences("123");

      expect(result).toEqual(mockPreferences);
      expect(UserRepository.getUserPreferences).toHaveBeenCalledWith("123");
    });

    test("Should throw an error when preferences are not found", async () => {
        jest.spyOn(UserRepository, "getUserPreferences").mockResolvedValue([]);
      
        await expect(UserService.fetchUserPreferences("123")).rejects.toThrow("Preferências não encontradas");
      
        expect(UserRepository.getUserPreferences).toHaveBeenCalledWith("123");
      });
  });

//   describe("updateUserAvatar", () => {
//     test("Should update user avatar and return the new avatar URL", async () => {
//       const mockAvatarUrl = "http://example.com/avatar.png";
//       const mockFile = {
//         buffer: Buffer.from("image data"),
//         originalname: "avatar.png",
//         mimetype: "image/png",
//       } as Express.Multer.File;
  
//       (uploadImage as jest.Mock).mockResolvedValue(mockAvatarUrl);
//       (UserRepository.putAvatar as jest.Mock).mockResolvedValue({ avatar: mockAvatarUrl });
  
//       const result = await UserService.updateUserAvatar("123", mockFile);
  
//       expect(result).toEqual({ avatar: mockAvatarUrl });
//       expect(uploadImage).toHaveBeenCalledWith(mockFile);
//       expect(UserRepository.putAvatar).toHaveBeenCalledWith("123", mockAvatarUrl);
//     });
  
//     test("Should throw an error when avatar update fails", async () => {
//       const mockFile = {
//         buffer: Buffer.from("image data"),
//         originalname: "avatar.png",
//         mimetype: "image/png",
//       } as Express.Multer.File;
  
//       (uploadImage as jest.Mock).mockRejectedValue(new Error("Erro ao atualizar avatar"));
  
//       await expect(UserService.updateUserAvatar("123", mockFile)).rejects.toThrow("Erro ao atualizar avatar");
  
//       expect(uploadImage).toHaveBeenCalledWith(mockFile);
//     });
//   });
});