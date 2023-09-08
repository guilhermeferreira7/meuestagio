import { Search, Trash } from "lucide-react";

import { Course } from "@customTypes/course";

import Table from "@components/AppTable";
import TableRow from "@components/AppTable/TableRow";
import { api } from "@services/api/api";
import { notify } from "@components/toasts/toast";
import { useEffect, useState } from "react";
import { usePagination } from "../../../hooks/usePagination";

interface ListCoursesProps {
  courses: Course[];
}

export default function ListCourses({ courses }: ListCoursesProps) {
  const limit = 10;
  const {
    counter: counterPagination,
    handleChangePage,
    page: pagePagination,
    updatedData,
  } = usePagination<Course>({
    data: courses,
    route: "/courses",
    limit,
  });

  const [counter, setCounter] = useState(0);
  const [page, setPage] = useState(0);

  const [search, setSearch] = useState("");
  const [coursesUpdated, setCoursesUpdated] = useState<Course[]>(courses);

  useEffect(() => {
    setCoursesUpdated(updatedData);
    setCounter(counterPagination);
    setPage(pagePagination);
  }, [updatedData, counterPagination, pagePagination]);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSearch(e.currentTarget.search.value);
    console.log(e.currentTarget.search.value);
    setPage(0);
    setCounter(0);
    try {
      const res = await api.get<Course[]>("/courses", {
        params: {
          page: 0,
          limit,
          name: e.currentTarget.search.value,
        },
      });
      setCoursesUpdated(res.data);
    } catch (error: any) {
      notify.error(error.response?.data?.message || error.message);
    }
  };

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
      const courses = await api.get<Course[]>("/courses");
      setCoursesUpdated(courses.data);
    } catch (error: any) {
      notify.error(error.response?.data?.message);
    }
  };

  return (
    <>
      <form className="flex gap-1 my-2" onSubmit={handleSearch}>
        <div className="flex flex-col flex-1">
          <label htmlFor="search" className="font-semibold">
            Pesquisar
          </label>
          <input
            id="search"
            name="search"
            type="text"
            placeholder="Nome do curso"
            className="input input-primary"
          />
        </div>
        <button type="submit" className="btn btn-info self-end">
          <Search />
        </button>
      </form>
      {search && (
        <div className="flex justify-between">
          <span className="italic">
            Resultados para: <strong>{search}</strong>
          </span>
          <button
            className="text-error text-lg underline"
            onClick={() => {
              handleChangePage(0);
              setSearch("");
            }}
          >
            Limpar pesquisa
          </button>
        </div>
      )}
      <Table headers={["#", "Nome", "Instituição", "Área", "Ações"]}>
        {coursesUpdated.length === 0 && (
          <tr className="text-center">
            <td>Nenhum curso encontrado</td>
          </tr>
        )}

        {coursesUpdated.map((course) => (
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

      {!search && (
        <div className="join text-center">
          <button
            className="join-item btn btn-primary"
            onClick={() => {
              handleChangePage(page - limit);
            }}
            disabled={page === 0}
          >
            «
          </button>
          <button
            className="join-item border rounded-md p-3 mx-1 border-primary text-primary font-semibold"
            disabled
          >
            Página {counter}
          </button>
          <button
            className="join-item btn btn-primary"
            onClick={() => {
              handleChangePage(page + limit);
            }}
            disabled={coursesUpdated.length < limit}
          >
            »
          </button>
        </div>
      )}
    </>
  );
}
