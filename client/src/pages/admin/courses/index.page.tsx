import { Add, Delete, Edit } from "@mui/icons-material";
import Link from "next/link";

import { COURSES_PATH } from "app-constants";
import { Modal } from "components";
import { serverApi, withAdminAuth } from "services";
import { Course } from "types";
import { errorToString } from "utils";

import { useActions } from "./_useActions";

interface CreateCourseFormProps {
  courses: Course[];
}

export default function RegisterCourses({ courses }: CreateCourseFormProps) {
  const { courseSelected, coursesUpdated, handleDelete, setCourseSelected } =
    useActions(courses);

  return (
    <>
      <h2 className="text-xl font-bold mb-2 flex justify-between items-center w-full px-10">
        <span className="text-primary">Cursos cadastrados</span>
        <Link
          href="courses/new"
          className="btn btn-primary btn-md flex items-center"
        >
          <Add /> Novo curso
        </Link>
      </h2>
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Curso</th>
            <th>Instituição</th>
            <th>Área</th>
            <th className="text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {coursesUpdated.map((course) => (
            <tr key={course.id}>
              <td>{course.id}</td>
              <td>{course.name}</td>
              <td>{course.institution.name}</td>
              <td>{course.area.title}</td>
              <td className="flex gap-2">
                <Modal.Button id="edit" type="warning" size="sm">
                  <Edit />
                </Modal.Button>
                <Modal.Button
                  id="delete"
                  type="error"
                  size="sm"
                  onClick={() => {
                    setCourseSelected(course);
                  }}
                >
                  <Delete />
                </Modal.Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal.Content
        id="delete"
        confirmText="Excluir"
        confirmAction={() => handleDelete(courseSelected!)}
        buttonType="error"
      >
        <span>
          Tem certeza que deseja excluir o curso {courseSelected?.name}
        </span>
      </Modal.Content>
    </>
  );
}

export const getServerSideProps = withAdminAuth(async (ctx) => {
  const apiClient = serverApi(ctx);

  try {
    const { data: courses } = await apiClient.get<Course[]>(COURSES_PATH, {
      params: { orderBy: "id", order: "DESC", limit: 10 },
    });

    return {
      props: {
        courses,
      },
    };
  } catch (error) {
    console.log(errorToString(error));
    return {
      props: {},
    };
  }
});
