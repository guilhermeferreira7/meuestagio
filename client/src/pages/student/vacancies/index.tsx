import { GetServerSideProps } from "next";
import React from "react";
import { parseCookies } from "nookies";

import { getVacancies } from "@/services/vacancies/vacancy-service";
import CardVacancy from "./card-vacancy";

interface StudentPageProps {
  vacancies: [];
}

export default function StudentVacancies({ vacancies }: StudentPageProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row justify-center gap-2 p-2">
        <input
          type="text"
          placeholder="Pesquisar vagas"
          className="bg-primary text-primary-content placeholder:textarea-primary input border-primary-focus"
        />
        <button className="bg-primary text-primary-content border-primary-focus btn">
          Buscar
        </button>
      </div>
      <div className="flex justify-center">
        <select
          defaultValue={1}
          className="bg-primary text-primary-content border-primary-focus  select select-sm"
        >
          <option disabled>Filtrar por</option>
          <option>Todas as vagas</option>
          <option>Vagas do meu curso</option>
        </select>
      </div>

      <div className="flex flex-col gap-2 m-8">
        {vacancies.map((vacancy: any) => (
          <div key={vacancy.id}>
            <CardVacancy vacancy={vacancy} />
          </div>
        ))}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["next.token"]: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const vacancies: [] = await getVacancies();

  return {
    props: {
      vacancies,
    },
  };
};
