import { z } from "zod";
import { Role } from "../types/user-auth";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  userRole: z.enum([Role.Student, Role.Company, Role.Professor]),
});
