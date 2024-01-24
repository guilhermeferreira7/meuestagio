import { z } from "zod";

export const CreateSkillSchema = z.object({
  name: z.string().min(2, "Deve conter no mínimo 2 caracteres"),
  level: z.enum(["Basico", "Intermediario", "Avancado"]),
});

export const CreateEducationSchema = z
  .object({
    school: z.string().min(2, "Deve conter no mínimo 2 caracteres"),
    degree: z.enum([
      "EnsinoMedio",
      "EnsinoTecnico",
      "EnsinoSuperior",
      "PosGraduacao",
    ]),
    fieldOfStudy: z.string().min(2, "Deve conter no mínimo 2 caracteres"),
    startDate: z.string(),
    endDate: z.string(),
  })
  .refine(
    (data) => {
      return data.startDate <= data.endDate;
    },
    {
      message: "A data de início deve ser anterior ou igual à data de término",
      path: ["endDate"],
    }
  );

export type CreateEducationSchema = z.infer<typeof CreateEducationSchema>;

export type CreateSkillSchema = z.infer<typeof CreateSkillSchema>;
