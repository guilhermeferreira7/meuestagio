import { z } from "zod";

export const UpdateCompanySchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  cityId: z.string().min(1, "Cidade é obrigatória"),
});

export type UpdateCompanySchema = z.infer<typeof UpdateCompanySchema>;
