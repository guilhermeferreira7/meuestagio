import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";

import { AREAS_PATH, COURSES_PATH, INSTITUTIONS_PATH } from "app-constants";
import { Form, notify } from "components";
import { CreateCourseSchema } from "schemas";
import { api, serverApi, withAdminAuth } from "services";
import { Area, Institution } from "types";
import { errorToString } from "utils";

type NewCoursePageProps = {
  institutions: Institution[];
  areas: Area[];
};

export default function _page({ areas, institutions }: NewCoursePageProps) {
  const router = useRouter();

  const createCourseForm = useForm<CreateCourseSchema>({
    mode: "all",
    resolver: zodResolver(CreateCourseSchema),
  });

  const { handleSubmit } = createCourseForm;

  const saveCourse = async (data: CreateCourseSchema) => {
    try {
      const course = await api.post<Institution>(COURSES_PATH, {
        ...data,
      });
      notify.success(`Curso ${course.data.name} cadastrado com sucesso!`);
      router.push("admin/courses");
    } catch (error: any) {
      notify.error(error.response?.data?.message);
    }
  };

  return (
    <>
      <FormProvider {...createCourseForm}>
        <form
          onSubmit={handleSubmit(saveCourse)}
          className="flex flex-col gap-2 justify-center"
        >
          <Form.Field>
            <Form.Label htmlFor="name">Nome</Form.Label>
            <Form.InputText name="name" />
            <Form.ErrorMessage field="name" />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="institutionId">Instituição</Form.Label>
            <Form.InputSelect name="institutionId" defaultValue="">
              <option value="">Selecione uma instituição</option>
              {institutions?.map((institution) => (
                <option key={institution.id} value={institution.id}>
                  {institution.name}
                </option>
              ))}
            </Form.InputSelect>
            <Form.ErrorMessage field="institutionId" />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="areaId">Área</Form.Label>
            <Form.InputSelect name="areaId" defaultValue="">
              <option value="">Selecione uma área</option>
              {areas?.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.title}
                </option>
              ))}
            </Form.InputSelect>
            <Form.ErrorMessage field="areaId" />
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
    const { data: institutions } = await apiClient.get<Institution[]>(
      INSTITUTIONS_PATH
    );
    const { data: areas } = await apiClient.get<Area[]>(AREAS_PATH);
    return {
      props: {
        institutions,
        areas,
      },
    };
  } catch (error) {
    console.log(errorToString(error));
    return {
      props: {},
    };
  }
});
