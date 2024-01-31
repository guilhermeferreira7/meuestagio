import { zodResolver } from "@hookform/resolvers/zod";

import { PROFESSORS_PATH } from "app-constants";
import { Form, notify } from "components";
import { FormProvider, useForm } from "react-hook-form";
import { CreateProfessorData, createProfessorSchema } from "schemas";
import { api } from "services";
import { Course, Professor } from "types";
import { errorToString } from "utils";

type FormNewProfessorProps = {
  courses: Course[];
};

export default function FormNewProfessor({ courses }: FormNewProfessorProps) {
  const form = useForm<CreateProfessorData>({
    resolver: zodResolver(createProfessorSchema),
    mode: "all",
  });

  const { handleSubmit } = form;

  async function createProfessor(data: CreateProfessorData) {
    try {
      const { data: professorData } = await api.post(PROFESSORS_PATH, {
        ...data,
      });
      const professor = Professor.parse(professorData);
      notify.success("Professor cadastrado: " + professor.name);
      form.reset();
    } catch (error) {
      notify.error(errorToString(error));
    }
  }

  return (
    <FormProvider {...form}>
      <form
        className="flex flex-col w-2/3"
        onSubmit={handleSubmit(createProfessor)}
      >
        <Form.Field>
          <Form.Label htmlFor="name">Nome:</Form.Label>
          <Form.InputText name="name" />
          <Form.ErrorMessage field="name" />
        </Form.Field>
        <Form.Field>
          <Form.Label htmlFor="email">Email:</Form.Label>
          <Form.InputText name="email" />
          <Form.ErrorMessage field="email" />
        </Form.Field>
        <Form.Field>
          <Form.Label htmlFor="password">Senha:</Form.Label>
          <Form.InputText name="password" />
          <Form.ErrorMessage field="password" />
        </Form.Field>
        <Form.Field>
          <Form.Label htmlFor="courseId">Curso:</Form.Label>
          <Form.InputSelect name="courseId" defaultValue="">
            <option disabled value="">
              Selecione o curso
            </option>
            {courses.map((course) => (
              <option value={course.id} key={course.id}>
                {course.name} - {course.institution.name}
              </option>
            ))}
          </Form.InputSelect>
          <Form.ErrorMessage field="courseId" />
        </Form.Field>
        <button type="submit" className="btn btn-primary w-full mt-2">
          Cadastrar
        </button>
      </form>
    </FormProvider>
  );
}
