import { z } from "zod";

export const CreateExperienceSchema = z.object({
  company: z
    .string()
    .min(2, { message: "Nome da empresa deve ter pelo menos 2 caracteres" }),
  position: z
    .string()
    .min(2, { message: "Nome do cargo deve ter pelo menos 2 caracteres" }),
  description: z
    .string()
    .min(2, { message: "Descrição deve ter pelo menos 2 caracteres" }),
  startDate: z.string(),
  endDate: z.optional(z.string()),
  currentJob: z.boolean(),
});

export type CreateExperienceSchema = z.infer<typeof CreateExperienceSchema>;
