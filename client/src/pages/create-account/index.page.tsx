import React, { useContext, useState } from "react";
import { ToastContainer } from "react-toastify";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Role } from "../../utils/types/auth/user-auth";
import { api } from "../../services/api/api";
import { Course } from "../../utils/types/courses/course";
import { Institution } from "../../utils/types/institutions/institution";
import { City } from "../../utils/types/cities/city";

type CreateAccountFormData = z.infer<typeof createUserFormSchema>;

interface PageProps {
  institutions: Institution[];
  cities: City[];
}

export default function CreateAccount({ institutions, cities }: PageProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [cityId, setCityId] = useState<number | undefined>(0);
  const [courseSelected, setCourseSelected] = useState<string>("");

  const changeCourseSelected = (event: any) => {
    const id = event.target.value;
    setCourseSelected(id);
  };

  const changeCourses = async (event: any) => {
    const id = event.target.value;
    try {
      const institution = institutions.find(
        (institution) => institution.id === +id
      );
      setCityId(institution?.cityId);

      const response = await api.get<Course[]>(`/institutions/${id}/courses`);
      setCourseSelected("");
      setCourses(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const changeCity = (event: any) => {
    const id = event.target.value;
    setCityId(+id);
  };

  const createAccountForm = useForm<CreateAccountFormData>({
    resolver: zodResolver(createUserFormSchema),
  });
  const { handleSubmit } = createAccountForm;

  const { signIn } = useContext(AuthContext);

  const [userRole, setUserRole] = useState<Role>(Role.Student);

  async function createAccount(data: CreateAccountFormData) {
    if (data.userRole === Role.Student) {
      try {
        await api.post("/students", {
          ...data,
          courseId: courseSelected,
          cityId,
        });
        notifySuccess("Aluno cadastrado com sucesso!");
        setTimeout(() => {
          signIn(data.email, data.password, data.userRole);
        }, 2000);
      } catch (error: any) {
        notifyError(error.response?.data?.message);
      }
    } else if (data.userRole === Role.Company) {
      try {
        await api.post("/companies", { ...data });
        notifySuccess("Empresa cadastrada com sucesso!");
        setTimeout(() => {
          signIn(data.email, data.password, data.userRole);
        }, 2000);
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
            <div>
              <Form.Field>
                <Form.Label htmlFor="institutionId">Instituição</Form.Label>
                <Form.InputSelect name="institutionId" onChange={changeCourses}>
                  <option disabled value="">
                    Escolha uma instituição
                  </option>
                  {institutions.map((institution) => {
                    return (
                      <option key={institution.id} value={institution.id}>
                        {institution.name}
                      </option>
                    );
                  })}
                </Form.InputSelect>
                <Form.ErrorMessage field="institutionId" />
              </Form.Field>
              <Form.Field>
                <Form.Label htmlFor="courseId">Curso</Form.Label>
                <Form.InputSelect
                  name="courseId"
                  value={courseSelected}
                  onChange={changeCourseSelected}
                >
                  <option disabled value="">
                    Qual seu curso?
                  </option>
                  {courses.map((course: any) => {
                    return (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    );
                  })}
                </Form.InputSelect>
                <Form.ErrorMessage field="institutionId" />
              </Form.Field>
            </div>
          ) : (
            <div>
              <Form.Field>
                <Form.Label htmlFor="cityId">Cidade</Form.Label>
                <Form.InputSelect name="cityId" onChange={changeCity}>
                  <option disabled value="">
                    Qual cidade a empresa está localizada?
                  </option>
                  {cities.map((city) => {
                    return (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    );
                  })}
                </Form.InputSelect>
                <Form.ErrorMessage field="cityId" />
              </Form.Field>
              <Form.Field>
                <Form.Label htmlFor="cnpj">Digite o CNPJ da empresa</Form.Label>
                <Form.InputText name="cnpj" />
                <Form.ErrorMessage field="cnpj" />
              </Form.Field>
            </div>
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

          {courseSelected === "" && userRole === Role.Student ? (
            <div>
              <span className="text-error">Escolha seu curso!</span>
              <button className="btn btn-primary w-2/3 self-center" disabled>
                Criar conta
              </button>
            </div>
          ) : (
            <button className="btn btn-primary w-2/3 self-center">
              Criar conta
            </button>
          )}
        </form>
      </FormProvider>

      <ToastContainer />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apiClient = getAPIClient(ctx);

  const institutions = await apiClient.get<Institution[]>("/institutions");
  const cities = await apiClient.get<City[]>("/cities");
  console.log(cities.data);

  return {
    props: { institutions: institutions.data, cities: cities.data },
  };
};
