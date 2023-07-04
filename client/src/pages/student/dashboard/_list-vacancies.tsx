import React from "react";
import { Vacancy } from "../../../utils/types/vacancy";
import CardVacancy from "./_card-vacancy";

export default function ListVacancies({
  vacancies,
  hasMoreVacancies,
  moreVacancies,
}: any) {
  return (
    <>
      <div className="flex flex-col gap-2 mx-8 w-4/5 mb-4">
        {vacancies.length > 0 ? (
          vacancies.map((vacancy: Vacancy) => (
            <div key={vacancy.id}>
              <CardVacancy vacancy={vacancy} />
            </div>
          ))
        ) : (
          <div className="p-10 self-center">
            <h1 className="text-xl">Nenhuma vaga encontrada... </h1>
          </div>
        )}
        {hasMoreVacancies ? (
          <button
            className="btn btn-primary w-1/2 self-center"
            onClick={moreVacancies}
          >
            Ver mais
          </button>
        ) : (
          <div className="p-10 self-center">
            <h1 className="text-xl">Não há mais vagas, mude sua filtragem</h1>
          </div>
        )}
      </div>
    </>
  );
}
