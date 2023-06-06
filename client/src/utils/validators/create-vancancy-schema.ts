import { z } from "zod";

export const createVacancyFormSchema = z.object({
  title: z.string().min(3, "O título precisa de pelo menos 3 caracteres"),
  description: z
    .string()
    .min(10, "A descrição precisa de pelo menos 10 caracteres"),
  salary: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: "Digite um valor para o salário",
  }),
  remote: z.boolean(),
  requirements: z
    .string()
    .min(10, "Os requisitos precisam de pelo menos 10 caracteres"),
  desirableRequirements: z
    .string()
    .min(10, "Os requisitos desejáveis precisam de pelo menos 10 caracteres"),
  activities: z
    .string()
    .min(10, "As atividades precisam de pelo menos 10 caracteres"),
  keyWords: z.string().refine(
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
