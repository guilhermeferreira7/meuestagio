import { GetServerSideProps } from "next";
import React from "react";
import { parseCookies } from "nookies";

import { getVacancies } from "@/services/vacancies/vacancy-service";
import CardVacancy from "./card-vacancy";
import jwtDecode from "jwt-decode";

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

  const tokenDecoded = (jwtDecode(token) as any).role;

  if (!token || tokenDecoded !== "student") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const vacancies = [
    {
      id: 1,
      title: "Desenvolvedor Fullstack",
      description:
        "Vaga para desenvolvedor fullstack com experiência em React e NodeJS",
      company: {
        name: "Empresa 1",
      },
      salary: 1500,
    },
    {
      id: 2,
      title: "Desenvolvedor Frontend",
      description: "Vaga para desenvolvedor frontend com experiência em React",
      company: {
        name: "Empresa 2",
      },
      salary: 2000,
    },
  ];

  return {
    props: {
      vacancies,
    },
  };
};
