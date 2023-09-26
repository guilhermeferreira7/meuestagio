import React, { useState } from "react";
import { GetServerSideProps } from "next";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { Loader } from "lucide-react";

import { createJobFormSchema } from "../../../utils/validators/create-job-schema";
import { AREAS_PATH, JOBS_PATH } from "../../../constants/api-routes";
import { notify } from "../../../components/toasts/toast";
import { Form } from "../../../components";
import { Area } from "../../../types/area";
import { Company } from "../../../types/users/company";
import withCompanyAuth from "../../../services/auth/withCompanyAuth";
import { api } from "../../../services/api/api";

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

type CreateJobFormData = z.infer<typeof createJobFormSchema>;

interface PageProps {
  areas: Area[];
  company: Company;
}

export default function CreateJob({ areas, company }: PageProps) {
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const createJobForm = useForm<CreateJobFormData>({
    resolver: zodResolver(createJobFormSchema),
  });
  const { handleSubmit } = createJobForm;

  const createJob = async (data: CreateJobFormData) => {
    setIsLoading(true);
    try {
      await api.post(JOBS_PATH, {
        ...data,
        cityId: company.cityId,
        companyId: company.id,
        description,
        regionId: company.city.regionId,
        state: company.city.state,
      });
      router.push("dashboard");
      notify.success("Vaga criada com sucesso!");
    } catch (error: any) {
      notify.error(`Erro ao criar vaga! ${error.response?.data?.message}`);
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2 className="font-bold text-xl text-primary text-center my-3">
        Preencha o formulário abaixo para criar uma vaga de estágio
      </h2>

      <FormProvider {...createJobForm}>
        <form
          onSubmit={handleSubmit(createJob)}
          className="flex flex-col w-full px-5"
        >
          <div className="grid grid-cols-1 gap-2">
            <div>
              <Form.Field>
                <Form.Label htmlFor="title">Título da Vaga</Form.Label>
                <Form.InputText name="title" />
                <Form.ErrorMessage field="title" />
              </Form.Field>
            </div>
            <div>
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
            <div>
              <Form.Field>
                <Form.Label htmlFor="description">Descrição</Form.Label>
                <QuillNoSSRWrapper
                  theme="snow"
                  value={description}
                  onChange={setDescription}
                  className="h-40 mb-16 sm:mb-10"
                />
              </Form.Field>
            </div>
            <div>
              <Form.Field>
                <Form.Label htmlFor="salary">
                  Salário {"("}opcional{")"}
                </Form.Label>
                <Form.InputText name="salary" type="number" />
                <Form.ErrorMessage field="salary" />
              </Form.Field>
            </div>
            <div>
              <Form.Field>
                <Form.Label htmlFor="keywords">
                  Palavras chaves {"("}separados por vírgulas{")"}
                </Form.Label>
                <Form.InputText name="keywords" />
                <Form.ErrorMessage field="keywords" />
              </Form.Field>
            </div>
            <div>
              <Form.Field className="flex items-center justify-center my-2 gap-1">
                <Form.InputCheckbox
                  name="remote"
                  title="remote"
                  label="Vaga remota?"
                />
                <Form.ErrorMessage field="remote" />
              </Form.Field>
            </div>
          </div>

          {isLoading ? (
            <button
              className="btn btn-warning w-2/3 mt-2 self-center"
              type="button"
            >
              Criando vaga...
              <span className="animate-spin ml-2">
                <Loader />
              </span>
            </button>
          ) : (
            <button
              className="btn btn-primary w-2/3 mt-2 self-center"
              type="submit"
            >
              Criar vaga
            </button>
          )}
        </form>
      </FormProvider>
    </>
  );
}

export const getServerSideProps = withCompanyAuth(
  async (_context, company, apiClient) => {
    const areas = await apiClient.get<Area[]>(AREAS_PATH);

    return {
      props: { areas: areas.data, company },
    };
  }
);
