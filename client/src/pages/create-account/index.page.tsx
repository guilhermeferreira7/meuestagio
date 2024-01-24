import { zodResolver } from "@hookform/resolvers/zod";
import { GetServerSideProps } from "next";
import { useContext, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import {
  CITIES_PATH,
  COMPANIES_PATH,
  INSTITUTIONS_PATH,
  STUDENTS_PATH,
} from "app-constants";
import { Form, notify } from "components";
import { AuthContext } from "contexts/AuthContext";
import { CreateUserFormSchema } from "schemas";
import { api, serverApi } from "services";
import { City, Institution, Role } from "types";
import { errorToString } from "utils";

import CreateCompanyForm from "./_company-form";
import CreateStudentForm from "./_student-form";

interface PageProps {
  institutions: Institution[];
  cities: City[];
}

export default function CreateAccount({ institutions, cities }: PageProps) {
  const createAccountForm = useForm<CreateUserFormSchema>({
    mode: "all",
    resolver: zodResolver(CreateUserFormSchema),
  });
  const { handleSubmit } = createAccountForm;
  const { signIn } = useContext(AuthContext);

  const [userRole, setUserRole] = useState<Role>(Role.Student);

  async function createAccount(data: CreateUserFormSchema) {
    if (data.userRole === Role.Student) {
      try {
        await api.post(STUDENTS_PATH, {
          ...data,
        });
        notify.success("Aluno cadastrado com sucesso!");
        await signIn(data.email, data.password, Role.Student);
      } catch (error: any) {
        notify.error(errorToString(error));
      }
    } else if (data.userRole === Role.Company) {
      try {
        await api.post(COMPANIES_PATH, { ...data });
        notify.success("Empresa cadastrada com sucesso!");
        await signIn(data.email, data.password, Role.Company);
      } catch (error: any) {
        notify.error(errorToString(error));
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
            <div className="text-center">
              <Form.ErrorMessage field="userRole" />
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
  const apiClient = serverApi(ctx);

  try {
    const { data: institutions } = await apiClient.get<Institution[]>(
      INSTITUTIONS_PATH
    );
    const { data: cities } = await apiClient.get<City[]>(CITIES_PATH);
    return {
      props: { institutions, cities },
    };
  } catch (error) {
    console.log(errorToString(error));
    return { props: { institutions: [], cities: [] } };
  }
};
