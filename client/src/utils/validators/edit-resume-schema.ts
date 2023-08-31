import { z } from "zod";

export const createSkillSchema = z.object({
  name: z.string().min(2, "Deve conter no mínimo 2 caracteres"),
  level: z.enum(["Básico", "Intermediário", "Avançado"]),
});
