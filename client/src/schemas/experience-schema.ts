import { z } from "zod";

export const CreateExperienceSchema = z
  .object({
    company: z
      .string()
      .min(2, { message: "Nome da empresa deve ter pelo menos 2 caracteres" }),
    position: z
      .string()
      .min(2, { message: "Nome do cargo deve ter pelo menos 2 caracteres" }),
    description: z
      .string()
      .min(2, { message: "Descrição deve ter pelo menos 2 caracteres" }),
    startDate: z.string(),
    endDate: z.string(),
    currentJob: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.currentJob) {
        data.endDate = "";
        return true;
      }

      if (!data.endDate) {
        return false;
      }

      return data.startDate <= data.endDate;
    },
    {
      message: "A data de início deve ser anterior ou igual à data de término",
      path: ["endDate"],
    }
  );

export type CreateExperienceSchema = z.infer<typeof CreateExperienceSchema>;
