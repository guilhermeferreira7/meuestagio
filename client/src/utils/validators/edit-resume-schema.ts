import { z } from "zod";

export const createSkillSchema = z.object({
  name: z.string().min(2, "Deve conter no mínimo 2 caracteres"),
  level: z.enum(["Basico", "Intermediario", "Avancado"]),
});

export const createEducationSchema = z
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

export type FormAddEducation = z.infer<typeof createEducationSchema>;
