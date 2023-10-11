import { z } from "zod";

export const editContactSchema = z.object({
  name: z.string().nonempty({ message: "Nome é obrigatório" }),
  email: z.string().nonempty({ message: "Email é obrigatório" }).email(),
  phone: z.string().optional(),
});

export type ContactData = z.infer<typeof editContactSchema>;

export const editEducationSchema = z.object({
  institutionId: z
    .string({ required_error: "Selecione uma instituição" })
    .min(1, { message: "Selecione uma instituição" }),
  courseId: z
    .string({ required_error: "Selecione um curso" })
    .min(1, { message: "Selecione um curso" }),
});

export type EducationData = z.infer<typeof editEducationSchema>;

export const editAddressSchema = z.object({
  city: z.string().min(1).max(255),
  state: z.string().min(1).max(255),
});

export type AddressData = z.infer<typeof editAddressSchema>;
