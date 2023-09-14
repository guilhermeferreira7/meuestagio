import { z } from "zod";

export const createInstitutionFormSchema = z.object({
  institutionName: z
    .string()
    .min(3, "O nome precisa de pelo menos 3 caracteres"),
  cityId: z.string().min(1, "Selecione uma cidade"),
});
