import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";

import { CITIES_PATH, INSTITUTIONS_PATH } from "app-constants";
import { Form, notify } from "components";
import { CreateInstitutionFormSchema } from "schemas";
import { api, serverApi, withAdminAuth } from "services";
import { City, Institution } from "types";
import { errorToString } from "utils";

type NewCoursePageProps = {
  cities: City[];
};

export default function _page({ cities }: NewCoursePageProps) {
  const router = useRouter();

  const createInstitutionForm = useForm<CreateInstitutionFormSchema>({
    mode: "all",
    resolver: zodResolver(CreateInstitutionFormSchema),
  });

  const { handleSubmit } = createInstitutionForm;

  const createInstitution = async (data: CreateInstitutionFormSchema) => {
    try {
      const institution = await api.post<Institution>(INSTITUTIONS_PATH, {
        name: data.institutionName,
        cityId: data.cityId,
      });
      notify.success(
        `Instituição ${institution.data.name} cadastrada com sucesso!`
      );
      router.push("/admin/institutions");
    } catch (error) {
      notify.error(errorToString(error));
    }
  };

  return (
    <>
      <FormProvider {...createInstitutionForm}>
        <form
          onSubmit={handleSubmit(createInstitution)}
          className="flex flex-col gap-2 justify-center"
        >
          <Form.Field>
            <Form.Label htmlFor="institutionName">Nome</Form.Label>
            <Form.InputText name="institutionName" />
            <Form.ErrorMessage field="institutionName" />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="cityId">Cidade</Form.Label>
            <Form.InputSelect name="cityId" defaultValue="">
              <option value="">Cidade da instituição</option>
              {cities?.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </Form.InputSelect>
            <Form.ErrorMessage field="cityId" />
          </Form.Field>
          <button className="btn btn-primary">Cadastrar</button>
        </form>
      </FormProvider>
    </>
  );
}

export const getServerSideProps = withAdminAuth(async (ctx) => {
  const apiClient = serverApi(ctx);

  try {
    const { data: cities } = await apiClient.get<City[]>(CITIES_PATH);
    return {
      props: {
        cities,
      },
    };
  } catch (error) {
    console.log(errorToString(error));
    return {
      props: {},
    };
  }
});
