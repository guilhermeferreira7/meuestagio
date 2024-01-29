import { zodResolver } from "@hookform/resolvers/zod";
import { Loop } from "@mui/icons-material";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import {
  AREAS_PATH,
  CITIES_PATH,
  JOBS_PATH,
  PROFILE_COMPANY_PATH,
} from "app-constants";
import { Form, notify } from "components";
import { CreateJobFormSchema } from "schemas";
import { api, serverApi, withCompanyAuth } from "services";
import { Area, City, Company } from "types";
import { errorToString } from "utils";

interface PageProps {
  areas: Area[];
  cities: City[];
  company: Company;
}

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

export default function CreateJob({ areas, company, cities }: PageProps) {
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [changeCity, setChangeCity] = useState(false);
  const router = useRouter();

  const createJobForm = useForm<CreateJobFormSchema>({
    resolver: zodResolver(CreateJobFormSchema),
  });
  const { handleSubmit } = createJobForm;

  const createJob = async (data: CreateJobFormSchema) => {
    setIsLoading(true);
    if (!changeCity) data.cityId = company.cityId + "";

    try {
      await api.post(JOBS_PATH, {
        ...data,
        companyId: company.id,
        description,
        regionId: company.city.regionId,
        state: company.city.state,
      });

      router.push("dashboard");
      notify.success("Vaga criada com sucesso!");
    } catch (error: any) {
      notify.error(errorToString(error));
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
          <Form.Field>
            <Form.Label htmlFor="title">Título da Vaga</Form.Label>
            <Form.InputText name="title" />
            <Form.ErrorMessage field="title" />
          </Form.Field>
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
          <Form.Field>
            <Form.Label htmlFor="description">Descrição</Form.Label>
            <QuillNoSSRWrapper
              theme="snow"
              value={description}
              onChange={setDescription}
              className="h-40 mb-16 sm:mb-10"
            />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="salary">
              Salário {"("}opcional{")"}
            </Form.Label>
            <Form.InputText name="salary" type="number" />
            <Form.ErrorMessage field="salary" />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="keywords">
              Palavras chaves {"("}separados por vírgulas{")"}
            </Form.Label>
            <Form.InputText name="keywords" />
            <Form.ErrorMessage field="keywords" />
          </Form.Field>
          <div className="flex items-center gap-1">
            <label className="label" htmlFor="changeCity">
              Mudar cidade?
            </label>
            <input
              id="changeCity"
              onChange={(e) => {
                setChangeCity(e.target.checked);
                createJobForm.setValue("cityId", "");
              }}
              name="changeCity"
              type="checkbox"
              className="checkbox checkbox-primary"
            />
          </div>
          <span className="text-gray-600 text-sm">
            Se não for marcado a cidade será a mesma da empresa
          </span>
          {changeCity && (
            <Form.Field>
              <Form.Label htmlFor="cityId">Cidade da vaga</Form.Label>
              <Form.InputSelect
                name="cityId"
                defaultValue={company.cityId + ""}
              >
                {cities.map((city) => {
                  return (
                    <option key={city.id} value={city.id}>
                      {city.name} - {city.state}
                    </option>
                  );
                })}
              </Form.InputSelect>
              <Form.ErrorMessage field="cityId" />
            </Form.Field>
          )}

          <Form.Field className="flex items-center justify-center my-2 gap-1">
            <Form.InputCheckbox
              name="remote"
              title="remote"
              label="Vaga remota?"
            />
            <Form.ErrorMessage field="remote" />
          </Form.Field>

          {isLoading ? (
            <button
              className="btn btn-warning w-2/3 mt-2 self-center"
              type="button"
            >
              Criando vaga...
              <span className="animate-spin ml-2">
                <Loop />
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

export const getServerSideProps = withCompanyAuth(async (context) => {
  const apiClient = serverApi(context);
  try {
    const { data: company } = await apiClient.get<Company>(
      PROFILE_COMPANY_PATH
    );

    const { data: areas } = await apiClient.get<Area[]>(AREAS_PATH);
    const { data: cities } = await apiClient.get<City[]>(CITIES_PATH, {
      params: { orderBy: "name" },
    });

    return {
      props: { areas, company, cities },
    };
  } catch (error) {
    console.log(errorToString(error));
    return { props: {} };
  }
});
