import { z } from "zod";

export const createLanguageSchema = z.object({
  name: z
    .string()
    .min(2, { message: "O idioma deve ter pelo menos 2 caracteres" }),
  level: z.enum(["Basico", "Intermediario", "Avancado", "Fluente"]),
});

export type FormAddLanguage = z.infer<typeof createLanguageSchema>;
