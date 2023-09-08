import { Trash } from "lucide-react";

import { Course } from "@customTypes/course";

import Table from "@components/AppTable";
import TableRow from "@components/AppTable/TableRow";
import { api } from "@services/api/api";
import { notify } from "@components/toasts/toast";
import { useRouter } from "next/router";

interface EditCoursesFormProps {
  courses: Course[];
}

export default function ListCourses({ courses }: EditCoursesFormProps) {
  const router = useRouter();
  const handleDelete = async (course: Course) => {
    if (
      !confirm(`
      Tem certeza que deseja deletar o curso ${course.name}?
    `)
    )
      return;
    try {
      await api.delete(`/courses/${course.id}`);
      notify.success(`Curso ${course.name} deletado com sucesso!`);
      router.reload();
    } catch (error: any) {
      notify.error(error.response?.data?.message);
    }
  };

  return (
    <Table headers={["#", "Nome", "Instituição", "Área", "Ações"]}>
      {courses.map((course) => (
        <TableRow
          key={course.id}
          dataCells={[
            course.id + "",
            course.name,
            course.institution.name,
            course.area.title,
          ]}
          actions={
            <div className=" flex items-center gap-1">
              <button
                className="btn btn-error"
                onClick={() => {
                  handleDelete(course);
                }}
              >
                <Trash />
              </button>
            </div>
          }
        />
      ))}
    </Table>
  );
}
