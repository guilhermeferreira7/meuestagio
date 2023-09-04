import { z } from "zod";

export const createCourseSchema = z.object({
  name: z.string().min(3, "O nome precisa de pelo menos 3 caracteres"),
  areaId: z.string().min(1, "Selecione uma área"),
  institutionId: z.string().min(1, "Selecione uma instituição"),
});
