import { z } from "zod";

export const editContactSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email({ message: "Email inválido" }).min(1).max(255),
  phone: z.string().min(1).max(255),
});

export const editEducationSchema = z.object({
  institution: z
    .string({ required_error: "Selecione uma instituição" })
    .min(1, { message: "Selecione uma instituição" }),
  course: z
    .string({ required_error: "Selecione um curso" })
    .min(1, { message: "Selecione um curso" }),
});

export const editAddressSchema = z.object({
  city: z.string().min(1).max(255),
  state: z.string().min(1).max(255),
});
