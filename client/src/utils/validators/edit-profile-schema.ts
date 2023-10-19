import { z } from "zod";

export const editContactSchema = z.object({
  email: z.string().nonempty({ message: "Email é obrigatório" }).email(),
  phone: z.string().optional(),
});

export type ContactData = z.infer<typeof editContactSchema>;

export const editEducationSchema = z
  .object({
    institutionId: z
      .string({ required_error: "Selecione uma instituição" })
      .min(1, { message: "Selecione uma instituição" }),
    courseId: z
      .string({ required_error: "Selecione um curso" })
      .min(1, { message: "Selecione um curso" }),
  })
  .refine(
    (data) => {
      if (isNaN(parseInt(data.institutionId))) return false;
      if (isNaN(parseInt(data.courseId))) return false;
      return true;
    },
    { message: "Selecione uma instituição e um curso", path: ["institutionId"] }
  );

export type EducationData = z.infer<typeof editEducationSchema>;

export const editAddressSchema = z
  .object({
    city: z.string().min(1).max(255),
    state: z.string().min(1).max(255),
  })
  .refine(
    (data) => {
      if (isNaN(parseInt(data.city))) return false;
      return true;
    },
    { message: "Selecione uma cidade e um estado", path: ["city"] }
  );

export type AddressData = z.infer<typeof editAddressSchema>;
