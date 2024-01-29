import { z } from "zod";

export const CreateInstitutionFormSchema = z.object({
  institutionName: z
    .string()
    .min(3, "O nome precisa de pelo menos 3 caracteres"),
  cityId: z.string().min(1, "Selecione uma cidade"),
});

export type CreateInstitutionFormSchema = z.infer<
  typeof CreateInstitutionFormSchema
>;
