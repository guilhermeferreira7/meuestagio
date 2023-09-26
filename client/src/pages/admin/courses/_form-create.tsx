import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { notify } from "../../../components/toasts/toast";
import { Form } from "../../../components/Form";
import { COURSES_PATH } from "../../../constants/api-routes";
import { api } from "../../../services/api/api";
import { Institution } from "../../../types/institution";
import { Area } from "../../../types/area";
import { createCourseSchema } from "../../../utils/validators/course-schema";

type CreateCourseFormData = z.infer<typeof createCourseSchema>;

interface CreateCourseFormProps {
  institutions?: Institution[];
  areas?: Area[];
}

export default function CreateCourseForm({
  institutions,
  areas,
}: CreateCourseFormProps) {
  const router = useRouter();
  const createCourseForm = useForm<CreateCourseFormData>({
    mode: "all",
    resolver: zodResolver(createCourseSchema),
  });
  const { handleSubmit } = createCourseForm;

  const saveCourse = async (data: CreateCourseFormData) => {
    try {
      const course = await api.post<Institution>(COURSES_PATH, {
        ...data,
      });
      router.reload();
      notify.success(`Curso ${course.data.name} cadastrado com sucesso!`);
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
