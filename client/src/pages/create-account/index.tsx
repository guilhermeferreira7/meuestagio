import React, { useContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { saveStudent } from "@/services/student/student-service";
import { AuthContext } from "../../contexts/AuthContext";
import { GetServerSideProps } from "next";
import { getAPIClient } from "../../services/api/clientApi";

type CreateAccountFormData = z.infer<typeof createUserFormSchema>;

const createUserFormSchema = z
  .object({
    userRole: z.enum(["student", "company"]),
    name: z.string().min(3, "O nome precisa de pelo menos 3 caracteres"),
    email: z.string().nonempty("O email é obrigatório").email(),
    institutionId: z.string().optional(),
    cnpj: z.string().optional(),
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
        return data.cnpj?.length === 14;
      }
      return true;
    },
    {
      message: "O CNPJ precisa ter 14 caracteres",
      path: ["cnpj"],
    }
  )
  .refine(
    (data) => {
      if (data.userRole === "student") {
        return data.institutionId !== "";
      }
      return true;
    },
    {
      message: "A instituição é obrigatória",
      path: ["institutionId"],
    }
  );

export default function CreateAccount({ institutions }: any) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAccountFormData>({
    resolver: zodResolver(createUserFormSchema),
  });
  const [userRole, setUserRole] = useState("student");

  const notifySuccess = () => {
    console.log("notifySuccess");

    toast.success("Cadastrado com sucesso!", {
      hideProgressBar: true,
      draggable: true,
    });
  };

  const notifyWarning = () => {
    toast.warning("Em breve você poderá criar uma conta de empresa!", {
      hideProgressBar: true,
      draggable: true,
    });
  };

  const notifyError = (message: any) => {
    toast.error(`Erro ${message}`, {
      hideProgressBar: true,
      draggable: true,
    });
  };

  async function createAccount(data: CreateAccountFormData) {
    if (data.userRole === "student") {
      try {
        await saveStudent(data);
        notifySuccess();
      } catch (error: any) {
        notifyError(error.response?.data?.message);
      }
    } else {
      notifyWarning();
    }
  }

  return (
    <div className="flex flex-col w-full items-center">
      <div className="text-center my-3">
        <h1 className="font-bold text-lg">
          Crie já sua conta para utilizar o sistema!
        </h1>
      </div>

      <form
        className="flex flex-col w-full max-w-sm gap-3"
        onSubmit={handleSubmit(createAccount)}
      >
        <div className="flex flex-col items-center">
          <label htmlFor="type">Tipo de conta</label>
          <select
            id="userRole"
            {...register("userRole")}
            onChange={(e) => {
              setUserRole(e.target.value);
            }}
          >
            <option value="student">Estudante</option>
            <option value="company">Empresa</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="name">Digite seu nome completo</label>
          <input type="text" className="rounded" {...register("name")} />
          {errors.name && (
            <span className="text-error">{errors.name.message}</span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="email">Digite seu e-mail preferido</label>
          <input type="text" className="rounded" {...register("email")} />
          {errors.email && (
            <span className="text-error">{errors.email.message}</span>
          )}
        </div>

        {userRole === "student" ? (
          <div className="flex flex-col">
            <label htmlFor="institution">Qual instituição você estuda?</label>
            <select id="institutionId" {...register("institutionId")}>
              <option disabled selected value="">
                Escolha uma instituição
              </option>
              {institutions.map((institution: any) => {
                return (
                  <option key={institution.id} value={institution.id}>
                    {institution.name}
                  </option>
                );
              })}
            </select>
            {errors.institutionId && (
              <span className="text-error">{errors.institutionId.message}</span>
            )}
          </div>
        ) : (
          <div className="flex flex-col">
            <label htmlFor="cnpj">Qual o CNPJ da sua empresa?</label>
            <input type="text" className="rounded" {...register("cnpj")} />
            {errors.cnpj && (
              <span className="text-error">{errors.cnpj.message}</span>
            )}
          </div>
        )}

        <div className="flex flex-col">
          <label htmlFor="password">Digite sua senha</label>
          <input
            type="password"
            className="rounded"
            {...register("password")}
          />
          {errors.password && (
            <span className="text-error">{errors.password.message}</span>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="confirmPassword">Confirme sua senha</label>
          <input
            type="password"
            className="rounded"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <span className="text-error">{errors.confirmPassword.message}</span>
          )}
        </div>

        <button className="btn" type="submit">
          Criar conta
        </button>
      </form>

      <ToastContainer />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apiClient = getAPIClient(ctx);
  const institutions = await apiClient.get("/institutions");

  return {
    props: { institutions: institutions.data },
  };
};
