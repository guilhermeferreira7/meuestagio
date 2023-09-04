import { z } from "zod";

import { Role } from "@customTypes/auth/user-auth";

export const loginSchema = z.object({
  email: z.string().min(1, "Digite seu email"),
  password: z.string().min(1, "Digite sua senha"),
  userRole: z.enum([Role.Student, Role.Company, Role.Professor, Role.Admin]),
});
