import { register, getByEmail, getUserById } from "../repositories/UserRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { defaultAvatar } from "../seeds/seeds";

const jwtSecret = process.env.JWT_SECRET!;

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  cpf: string;
  avatar: string;
}) {
  try {
    const encryptedPassword = await bcrypt.hash(data.password, 10);
    data.password = encryptedPassword;
    console.log(defaultAvatar);
    // Define o avatar padrão caso não seja fornecido
    data.avatar = defaultAvatar;

    return await register(data);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      throw new Error("EMAIL_OR_CPF_EXISTS");
    }
    console.error(error);
    throw new Error("SERVER_ERROR");
  }
}

export async function authenticateUser(email: string, password: string) {
  const user = await getByEmail(email);
 
//console.log(user?.deletedAt)
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  if(user.deletedAt){
    throw new Error("USER_DELETED")
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new Error("INVALID_PASSWORD");
  }

  // Gera token sem expor a senha
  const { password: _, ...userData } = user;
  const token = jwt.sign(userData, jwtSecret, { expiresIn: "1d" });

  return { token, user: userData };
}
