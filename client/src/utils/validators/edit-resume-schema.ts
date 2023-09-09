import { z } from "zod";

export const createSkillSchema = z.object({
  name: z.string().min(2, "Deve conter no mínimo 2 caracteres"),
  level: z.enum(["Básico", "Intermediário", "Avançado"]),
});

const months = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
] as const;

export const createEducationSchema = z
  .object({
    school: z.string().min(2, "Deve conter no mínimo 2 caracteres"),
    degree: z.enum([
      "Ensino Médio",
      "Ensino Técnico",
      "Ensino Superior",
      "Pós-Graduação",
    ]),
    fieldOfStudy: z.string().min(2, "Deve conter no mínimo 2 caracteres"),
    startMonth: z.enum(months, {
      errorMap: (issue, ctx) => ({ message: "Escolha um mês de início" }),
    }),
    endMonth: z.enum(months, {
      errorMap: (issue, ctx) => ({ message: "Escolha um mês de término" }),
    }),
    startYear: z.string().transform((value) => value.toString()),
    endYear: z.string().transform((value) => value.toString()),
  })
  .refine(
    (data) => {
      const start = new Date(`${data.startYear}-${data.startMonth}-01`);
      const end = new Date(`${data.endYear}-${data.endMonth}-01`);

      console.log(start, end.getMonth(), end.getFullYear());
      console.log(start <= end);

      return start <= end;
    },
    {
      message: "A data de início deve ser anterior ou igual à data de término",
      path: ["endMonth"],
    }
  );

export type FormAddEducation = z.infer<typeof createEducationSchema>;
