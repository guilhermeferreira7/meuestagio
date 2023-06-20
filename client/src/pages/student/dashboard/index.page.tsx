import { GetServerSideProps } from "next";
import React from "react";

import CardVacancy from "./_card-vacancy";
import { getAPIClient } from "../../../services/api/clientApi";
import { Student } from "../../../utils/types/users/student";
import { Vacancy } from "../../../utils/types/vacancy";

interface StudentPageProps {
  vacancies: Vacancy[];
  student: Student;
}

export default function StudentVacancies({
  vacancies,
  student,
}: StudentPageProps) {
  return (
    <div className="flex flex-col items-center">
      <div>{student?.city?.name}</div>
      <div className="collapse">
        <input type="checkbox" />
        <div className="collapse-title text-primary text-xl font-medium underline italic text-center">
          Alterar cidade
        </div>
        <div className="collapse-content flex gap-1">
          <select
            name=""
            id=""
            className="select select-primary"
            defaultValue={1}
          >
            <option disabled value="1">
              Escolha um estado
            </option>
          </select>
          <select
            name=""
            id=""
            className="select select-primary"
            defaultValue={1}
          >
            <option disabled value="1">
              Escolha uma região
            </option>
          </select>
          <select
            name=""
            id=""
            className="select select-primary"
            defaultValue={1}
          >
            <option disabled value="1">
              Escolha uma cidade
            </option>
          </select>
        </div>
      </div>
      <div className="flex flex-row justify-center my-4 ">
        <div className="flex flex-col items-center gap-2 mx-2">
          <div className="w-96 flex flex-col items-center gap-2">
            <input
              type="text"
              placeholder="Pesquisar vagas"
              className="w-full pl-2 input input-primary"
            />
            <div className="flex justify-center items-center gap-1">
              <span>Vagas remotas?</span>
              <input type="checkbox" className="checkbox checkbox-primary" />
              <button className="btn btn-primary w-5/6">Buscar</button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 mx-8 w-4/5 mb-4">
        {vacancies?.map((vacancy: Vacancy) => (
          <div key={vacancy.id}>
            <CardVacancy vacancy={vacancy} />
          </div>
        ))}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const apiClient = getAPIClient(ctx);
    const student = await apiClient.get<Student>("/students/profile");
    console.log(student.data);

    const getVacancies = await apiClient.get("/vacancies");
    const vacancies = getVacancies.data;
    return {
      props: {
        vacancies,
        student: student.data,
      },
    };
  } catch (error: any) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};
