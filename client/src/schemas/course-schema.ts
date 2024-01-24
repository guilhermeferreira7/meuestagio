import { z } from "zod";

export const CreateCourseSchema = z.object({
  name: z.string().min(3, "O nome precisa de pelo menos 3 caracteres"),
  areaId: z.string().min(1, "Selecione uma área"),
  institutionId: z.string().min(1, "Selecione uma instituição"),
});

export type CreateCourseSchema = z.infer<typeof CreateCourseSchema>;
