import { cnpj } from "cpf-cnpj-validator";
import { z } from "zod";

export const createUserFormSchema = z
  .object({
    userRole: z.enum(["student", "company"]),
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
        } else {
          return cnpj.isValid(data.cnpj);
        }
      }
      return true;
    },
    {
      message: "O CNPJ é inválido",
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
        const hasInstitution = data.institutionId !== "" ? true : false;
        const hasCourse = data.courseId !== "" ? true : false;
        return hasInstitution && hasCourse;
      }
      return true;
    },
    {
      message: "A instituição e o curso são obrigatórios",
      path: ["institutionId"],
    }
  );
