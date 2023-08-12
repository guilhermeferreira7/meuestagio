import { z } from "zod";

export const createVacancyFormSchema = z.object({
  title: z.string().min(3, "O título precisa de pelo menos 3 caracteres"),
  salary: z.string().optional(),
  remote: z.boolean(),
  keywords: z.string().refine(
    (val) => {
      const words = val.split(",");
      return (
        words.length >= 2 && words[0].trim() !== "" && words[1].trim() !== ""
      );
    },
    {
      message: "Digite pelo menos 2 palavras-chave",
    }
  ),
  areaId: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: "Selecione uma área",
  }),
});
