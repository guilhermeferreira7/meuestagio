import React, { useContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FormProvider, useForm } from "react-hook-form";
import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { saveStudent } from "@/services/users/student/student-service";
import { AuthContext } from "../../contexts/AuthContext";
import { GetServerSideProps } from "next";
import { getAPIClient } from "../../services/api/clientApi";
import {
  notifyError,
  notifySuccess,
  notifyWarning,
} from "../../components/toasts/toast";
import { createUserFormSchema } from "../../utils/validators/create-account-schema";

import { Form } from "../../components/Form";
import { Role } from "../../utils/types/user-auth";

type CreateAccountFormData = z.infer<typeof createUserFormSchema>;

export default function CreateAccount({ institutions }: any) {
  const createAccountForm = useForm<CreateAccountFormData>({
    resolver: zodResolver(createUserFormSchema),
  });
  const { handleSubmit } = createAccountForm;

  const { signIn } = useContext(AuthContext);

  const [userRole, setUserRole] = useState<Role>(Role.Student);

  async function createAccount(data: CreateAccountFormData) {
    if (data.userRole === Role.Student) {
      try {
        notifySuccess("Cadastrado com sucesso!");
        await saveStudent(data);
        setTimeout(() => {
          signIn(data.email, data.password, data.userRole);
        }, 2000);
      } catch (error: any) {
        notifyError(error.response?.data?.message);
      }
    } else if (data.userRole === Role.Company) {
      try {
        notifyWarning("Ainda não é possível cadastrar empresas");
      } catch (error: any) {
        notifyError(error.response?.data?.message);
      }
    } else {
      notifyWarning();
    }
  }

  return (
    <div className="flex flex-col flex-1 items-center w-full ">
      <div className="text-center my-3">
        <h1 className="font-bold text-lg text-primary">
          Crie já sua conta para utilizar o sistema!
        </h1>
      </div>

      <FormProvider {...createAccountForm}>
        <form
          className="flex flex-col gap-2 w-5/6 lg:w-1/3 mb-4"
          onSubmit={handleSubmit(createAccount)}
        >
          <Form.Field>
            <div className="btn-group flex flex-row justify-center">
              <Form.InputRadio
                value="student"
                name="userRole"
                title="Aluno"
                defaultChecked
                onChange={() => setUserRole(Role.Student)}
              />
              <Form.InputRadio
                value="company"
                name="userRole"
                title="Empresa"
                onChange={() => setUserRole(Role.Company)}
              />
            </div>
          </Form.Field>

          <Form.Field>
            <Form.Label htmlFor="name">
              {userRole === Role.Student
                ? "Digite seu nome completo"
                : "Digite o nome de sua empresa"}
            </Form.Label>
            <Form.InputText name="name" />
            <Form.ErrorMessage field="name" />
          </Form.Field>

          <Form.Field>
            <Form.Label htmlFor="email">Digite seu email</Form.Label>
            <Form.InputText name="email" />
            <Form.ErrorMessage field="email" />
          </Form.Field>

          {userRole === "student" ? (
            <Form.Field>
              <Form.Label htmlFor="institutionId">Insituição</Form.Label>
              <Form.InputSelect name="institutionId">
                <option disabled value="">
                  Escolha uma instituição
                </option>
                {institutions.map((institution: any) => {
                  return (
                    <option key={institution.id} value={institution.id}>
                      {institution.name}
                    </option>
                  );
                })}
              </Form.InputSelect>
              <Form.ErrorMessage field="institutionId" />
            </Form.Field>
          ) : (
            <Form.Field>
              <Form.Label htmlFor="cnpj">Digite o CNPJ da empresa</Form.Label>
              <Form.InputText name="cnpj" />
              <Form.ErrorMessage field="cnpj" />
            </Form.Field>
          )}

          <Form.Field>
            <Form.Label htmlFor="password">Digite sua senha</Form.Label>
            <Form.InputText name="password" type="password" />
            <Form.ErrorMessage field="password" />
          </Form.Field>

          <Form.Field>
            <Form.Label htmlFor="confirmPassword">
              Confirme sua senha
            </Form.Label>
            <Form.InputText name="confirmPassword" type="password" />
            <Form.ErrorMessage field="confirmPassword" />
          </Form.Field>

          <button className="btn btn-primary w-2/3 self-center">
            Criar conta
          </button>
        </form>
      </FormProvider>

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
