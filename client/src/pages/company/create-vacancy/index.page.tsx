import React from "react";
import { GetServerSideProps } from "next";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/router";

import { createVacancyFormSchema } from "../../../utils/validators/create-vancancy-schema";
import { Form } from "../../../components/Form";
import { getAPIClient } from "../../../services/api/clientApi";
import { Area } from "../../../utils/types/area";
import { api } from "../../../services/api/api";
import { notifyError, notifySuccess } from "../../../components/toasts/toast";
import { Company } from "../../../utils/types/users/company";

type CreateVacancyFormData = z.infer<typeof createVacancyFormSchema>;

interface PageProps {
  areas: Area[];
  company: Company;
}

export default function CreateVacancy({ areas, company }: PageProps) {
  const router = useRouter();

  const createVacancyForm = useForm<CreateVacancyFormData>({
    resolver: zodResolver(createVacancyFormSchema),
  });
  const { handleSubmit } = createVacancyForm;

  const createVacancy = async (data: CreateVacancyFormData) => {
    try {
      await api.post("/vacancies", {
        ...data,
        cityId: company.cityId,
        companyId: company.id,
      });
      notifySuccess("Vaga criada com sucesso!");
      router.push("/company/dashboard");
    } catch (error: any) {
      notifyError(`Erro ao criar vaga! ${error.response?.data?.message}`);
    }
  };

  return (
    <div className="w-4/5 my-2">
      <h2 className="font-bold text-xl text-primary text-center my-3">
        Preencha o formulário abaixo para criar uma vaga de estágio
      </h2>

      <FormProvider {...createVacancyForm}>
        <form onSubmit={handleSubmit(createVacancy)} className="flex flex-col">
          <div className="grid grid-cols-1">
            <div className="mr-2">
              <Form.Field>
                <Form.Label htmlFor="title">Nome da Vaga</Form.Label>
                <Form.InputText name="title" />
                <Form.ErrorMessage field="title" />
              </Form.Field>
            </div>
            <div className="mr-2">
              <Form.Field>
                <Form.Label htmlFor="salary">Salário opcional</Form.Label>
                <Form.InputText name="salary" type="number" />
                <Form.ErrorMessage field="salary" />
              </Form.Field>
            </div>
            <div className="mr-2">
              <Form.Field>
                <Form.Label htmlFor="description">Descrição</Form.Label>
                <Form.InputTextarea name="description" />
                <Form.ErrorMessage field="description" />
              </Form.Field>
            </div>
            <div className="mr-2">
              <Form.Field>
                <Form.Label htmlFor="requirements">
                  Requisitos minimos
                </Form.Label>
                <Form.InputTextarea name="requirements" />
                <Form.ErrorMessage field="requirements" />
              </Form.Field>
            </div>
            <div className="mr-2">
              <Form.Field>
                <Form.Label htmlFor="desirableRequirements">
                  Requisitos desejados
                </Form.Label>
                <Form.InputTextarea name="desirableRequirements" />
                <Form.ErrorMessage field="desirableRequirements" />
              </Form.Field>
            </div>
            <div className="mr-2">
              <Form.Field>
                <Form.Label htmlFor="activities">Atividades</Form.Label>
                <Form.InputTextarea name="activities" />
                <Form.ErrorMessage field="activities" />
              </Form.Field>
            </div>
            <div className="mr-2">
              <Form.Field>
                <Form.Label htmlFor="keyWords">
                  Palavras chaves {"("}separados por vírgulas{")"}
                </Form.Label>
                <Form.InputText name="keyWords" />
                <Form.ErrorMessage field="keyWords" />
              </Form.Field>
            </div>
            <div className="mr-2">
              <Form.Field>
                <Form.Label htmlFor="areaId">Área da vaga</Form.Label>
                <Form.InputSelect name="areaId">
                  <option disabled value="">
                    Escolha uma área
                  </option>
                  {areas.map((area) => {
                    return (
                      <option key={area.id} value={area.id}>
                        {area.title}
                      </option>
                    );
                  })}
                </Form.InputSelect>
                <Form.ErrorMessage field="areaId" />
              </Form.Field>
            </div>
            <div className="">
              <Form.Field className="flex items-center justify-center my-2 gap-1">
                <Form.Label htmlFor="remote">Vaga remota?</Form.Label>
                <Form.InputCheckbox name="remote" title="remote" />
                <Form.ErrorMessage field="remote" />
              </Form.Field>
            </div>
          </div>

          <button
            className="btn btn-primary w-2/3 mt-2 self-center"
            type="submit"
          >
            Criar vaga
          </button>
        </form>
      </FormProvider>

      <ToastContainer />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const apiClient = getAPIClient(ctx);
    const company = await apiClient.get<Company>("/companies/profile");
    const areas = await apiClient.get<Area[]>("/areas");
    return {
      props: { areas: areas.data, company: company.data },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};
