import { z } from "zod";

const userValidation = z.object({
  name: z.string().max(15),
  email: z.string().email(),
  password: z.string().min(6),
  cpf: z.string().min(11).max(14),
});

export default userValidation;