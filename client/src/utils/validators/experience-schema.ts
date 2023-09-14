import { z } from "zod";

export const createExperienceSchema = z
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
    startDate: z
      .string()
      .min(7, { message: "Digite a data no formato mm/aaaa" }),
    endDate: z.string().optional(),
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

      const startMonth = Number(data.startDate.split("/")[0]);
      const startYear = Number(data.startDate.split("/")[1]);
      const endMonth = Number(data.endDate.split("/")[0]);
      const endYear = Number(data.endDate.split("/")[1]);

      const start = new Date(`${startYear}-${startMonth}-01`);
      const end = new Date(`${endYear}-${endMonth}-01`);

      return start <= end;
    },
    {
      message: "A data de início deve ser anterior ou igual à data de término",
      path: ["endDate"],
    }
  )
  .transform((data) => ({
    ...data,
    startDate: `${data.startDate.split("/")[1]}-${
      data.startDate.split("/")[0]
    }-01`,
    endDate: data.endDate
      ? `${data.endDate.split("/")[1]}-${data.endDate.split("/")[0]}-01`
      : "",
  }));

export type FormAddExperience = z.infer<typeof createExperienceSchema>;
