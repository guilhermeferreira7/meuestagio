import { GetServerSideProps } from "next";
import React from "react";

import CardVacancy from "./_card-vacancy";
import { getAPIClient } from "../../../services/api/clientApi";
import { Student } from "../../../utils/types/users/student";

interface StudentPageProps {
  vacancies: [];
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

      <div className="flex flex-col gap-2 mx-8 w-full mb-4">
        {vacancies?.map((vacancy: any) => (
          <div key={vacancy.id}>
            <CardVacancy vacancy={vacancy} />
          </div>
        ))}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apiClient = getAPIClient(ctx);
  try {
    await apiClient.get<Student>("/students/profile");

    const getVacancies = await apiClient.get("/vacancies");
    const vacancies = getVacancies.data;
    return {
      props: {
        vacancies,
      },
    };
  } catch (error: any) {
    console.log(error.response?.status);

    if (error.response?.status === 401) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    return {
      props: {},
    };
  }
};
