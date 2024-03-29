import { z } from "zod";

// TODO refactor
export const CreateUserFormSchema = z
  .object({
    userRole: z.enum(["student", "company"], {
      errorMap: (issue) => ({ message: "Selecione o tipo de conta" }),
    }),
    name: z.string().min(3, "O nome precisa de pelo menos 3 caracteres"),
    email: z.string().nonempty("O email é obrigatório").email("Email inválido"),
    institutionId: z.string().optional(),
    courseId: z.string().optional(),
    cnpj: z.string().optional(),
    cityId: z.string().optional(),
    password: z.string().min(6, "A senha precisa de pelo menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas precisam ser iguais",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.userRole === "company") {
        if (!data.cnpj) {
          return false;
        }
      }
      return true;
    },
    {
      message: "O CNPJ é obrigatório",
      path: ["cnpj"],
    }
  )
  .refine(
    (data) => {
      if (data.userRole === "company") {
        const hasCity = data.cityId !== "" ? true : false;
        return hasCity;
      }
      return true;
    },
    {
      message: "A cidade é obrigatória",
      path: ["cityId"],
    }
  )
  .refine(
    (data) => {
      if (data.userRole === "student") {
        return data.institutionId !== "" ? true : false;
      }
      return true;
    },
    {
      message: "A instituição é obrigatória",
      path: ["institutionId"],
    }
  )
  .refine(
    (data) => {
      if (data.userRole === "student") {
        return data.courseId !== "" ? true : false;
      }
      return true;
    },
    {
      message: "Selecione um curso",
      path: ["courseId"],
    }
  );

export type CreateUserFormSchema = z.infer<typeof CreateUserFormSchema>;
