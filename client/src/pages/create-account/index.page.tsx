import { useContext, useState } from "react";
import { GetServerSideProps } from "next";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import CreateStudentForm from "./_student-form";
import CreateCompanyForm from "./_company-form";
import { notify } from "../../components/toasts/toast";
import { Form } from "../../components";
import {
  CITIES_PATH,
  COMPANIES_PATH,
  INSTITUTIONS_PATH,
  STUDENTS_PATH,
} from "../../constants/api-routes";
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/api/api";
import { getAPIClient } from "../../services/api/clientApi";
import { Institution } from "../../types/institution";
import { City } from "../../types/city";
import { Role } from "../../types/auth/user-auth";
import { createUserFormSchema } from "../../utils/validators/create-account-schema";

type CreateAccountFormData = z.infer<typeof createUserFormSchema>;

interface PageProps {
  institutions: Institution[];
  cities: City[];
}

export default function CreateAccount({ institutions, cities }: PageProps) {
  const createAccountForm = useForm<CreateAccountFormData>({
    mode: "all",
    resolver: zodResolver(createUserFormSchema),
  });
  const { handleSubmit } = createAccountForm;

  const { signIn } = useContext(AuthContext);

  const [userRole, setUserRole] = useState<Role>(Role.Student);

  async function createAccount(data: CreateAccountFormData) {
    if (data.userRole === Role.Student) {
      try {
        await api.post(STUDENTS_PATH, {
          ...data,
        });
        notify.success("Aluno cadastrado com sucesso!");
      } catch (error: any) {
        notify.error(error.response?.data?.message || error.message);
      }
    } else if (data.userRole === Role.Company) {
      try {
        await api.post(COMPANIES_PATH, { ...data });
        notify.success("Empresa cadastrada com sucesso!");
      } catch (error: any) {
        notify.error("" + error.response?.data?.message || error.message);
      }
    } else {
      notify.warning();
    }
  }

  return (
    <div className="flex flex-col flex-1 items-center w-full">
      <div className="text-center my-3">
        <h1 className="font-bold text-lg text-primary">
          Crie já sua conta para utilizar o sistema!
        </h1>
      </div>

      <FormProvider {...createAccountForm}>
        <form
          className="flex flex-col gap-2 w-11/12"
          onSubmit={handleSubmit(createAccount)}
        >
          <Form.Field>
            <div className="btn-group flex flex-row justify-center">
              <Form.InputRadio
                value="student"
                name="userRole"
                id="student"
                title="Aluno"
                defaultChecked
                onChange={() => setUserRole(Role.Student)}
              />
              <Form.InputRadio
                value="company"
                name="userRole"
                id="company"
                title="Empresa"
                onChange={() => setUserRole(Role.Company)}
              />
            </div>
          </Form.Field>

          {userRole === Role.Student ? (
            <CreateStudentForm
              institutions={institutions}
              form={createAccountForm}
            />
          ) : (
            <CreateCompanyForm cities={cities} />
          )}

          <h2 className="mt-2 text-xl font-semibold text-info italic">
            Seus dados de acesso:
          </h2>
          <Form.Field>
            <Form.Label htmlFor="email">Digite seu email</Form.Label>
            <Form.InputText name="email" />
            <Form.ErrorMessage field="email" />
          </Form.Field>

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
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apiClient = getAPIClient(ctx);

  const institutions = await apiClient.get<Institution[]>(INSTITUTIONS_PATH);
  const cities = await apiClient.get<City[]>(CITIES_PATH);

  return {
    props: { institutions: institutions.data, cities: cities.data },
  };
};
