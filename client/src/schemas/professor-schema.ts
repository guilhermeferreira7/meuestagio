import { z } from "zod";

export const createProfessorSchema = z.object({
  name: z
    .string({ required_error: "Obrigatório" })
    .min(3, "Nome precisa de 3 ou caracteres"),
  email: z.string({ required_error: "Obrigatório" }).email("Email inválido"),
  password: z
    .string({ required_error: "Obrigatório" })
    .min(6, "Senha precisa de 6 ou mais caracteres"),
  courseId: z
    .string({ required_error: "Obrigatório" })
    .refine((courseId) => Number(courseId) !== 0, "Selecione um curso"),
});

export type CreateProfessorData = z.infer<typeof createProfessorSchema>;
