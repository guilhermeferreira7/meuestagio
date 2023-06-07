import { GetServerSideProps } from "next";
import React from "react";

import CardVacancy from "./_card-vacancy";
import { getAPIClient } from "../../../services/api/clientApi";
import { Student } from "../../../utils/types/users/student";
import { getUser } from "../../../services/api/userLogged";
import { Vacancy } from "../../../utils/types/vacancies/vacancy";

interface StudentPageProps {
  vacancies: Vacancy[];
}

export default function StudentVacancies({ vacancies }: StudentPageProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row justify-center my-4 max-w-xs">
        <div className="flex flex-col items-center gap-2 w-96 mx-2">
          <input
            type="text"
            placeholder="Pesquisar vagas"
            className="w-full pl-2 input input-primary"
          />
          <button className="btn btn-primary w-5/6">Buscar</button>
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
  const student = await getUser<Student>(ctx);
  if (!student) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const apiClient = getAPIClient(ctx);
  try {
    const getVacancies = await apiClient.get("/vacancies");
    const vacancies = getVacancies.data;
    return {
      props: {
        vacancies,
      },
    };
  } catch (error: any) {
    return {
      props: {},
    };
  }
};
