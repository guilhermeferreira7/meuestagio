import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { COURSES_PATH, PROFESSORS_PATH } from "app-constants";
import { notify } from "components";
import { api, serverApi, withAdminAuth } from "services";
import { Course } from "types";
import { errorToString } from "utils";

type NewProfessorPageProps = {
  courses: Course[];
};

const formSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
  courseId: z.string().refine((courseId) => Number(courseId) !== 0),
});

type FormData = z.infer<typeof formSchema>;

export default function _screen({ courses }: NewProfessorPageProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = form;

  async function createProfessor(data: FormData) {
    try {
      const response = await api.post(PROFESSORS_PATH, {
        ...data,
      });
      console.log(response);
    } catch (error) {
      console.log(errorToString(error));
      notify.error(errorToString(error));
    } finally {
      console.log("data", data);
    }
  }

  return (
    <>
      <h1 className="text-primary font-bold text-xl">Novo professor</h1>

      <form
        className="flex flex-col w-2/3"
        onSubmit={handleSubmit(createProfessor)}
      >
        <label className="label label-text" htmlFor="name">
          Nome:
        </label>
        <input
          className="input input-primary"
          type="text"
          id="name"
          placeholder="Nome"
          {...register("name")}
        />
        <span className="text-error">
          {errors.root ? errors.root.message : ""}
        </span>
        <label className="label label-text" htmlFor="email">
          Email:
        </label>
        <input
          className="input input-primary"
          type="text"
          id="email"
          placeholder="Email"
          {...register("email")}
        />
        <label className="label label-text" htmlFor="email">
          Senha:
        </label>
        <input
          className="input input-primary"
          type="text"
          id="password"
          placeholder="Senha"
          {...register("password")}
        />
        <label className="label label-text" htmlFor="courseId">
          Curso:
        </label>
        <select
          defaultValue=""
          id="courseId"
          className="select select-primary"
          {...register("courseId")}
        >
          <option disabled value="">
            Selecione o curso
          </option>
          {courses.map((course) => (
            <option value={course.id} key={course.id}>
              {course.name} - {course.institution.name}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary w-full mt-2">
          Cadastrar
        </button>
      </form>
    </>
  );
}

export const getServerSideProps = withAdminAuth(async (context, _user) => {
  const apiServer = serverApi(context);
  try {
    const { data: courses } = await apiServer.get<Course>(COURSES_PATH);

    return {
      props: {
        courses,
      },
    };
  } catch (err) {
    console.log(errorToString(err));
    return {
      props: {},
    };
  }
});
