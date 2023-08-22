import Link from "next/link";
import React, { useState } from "react";
import { Vacancy } from "../../../utils/types/vacancy";

interface CardVacancyProps {
  vacancy: Vacancy;
}

export default function CardVacancy({ vacancy }: CardVacancyProps) {
  return (
    <>
      <div className="card-body">
        <div className="card-title flex justify-between">
          <h2 className="text-primary font-bold">
            {vacancy.title}{" "}
            {vacancy.remote ? (
              <span className="text-black font-normal">
                {"("}Remoto{")"}
              </span>
            ) : (
              <span className="text-black font-normal">
                {"("}Presencial{")"}
              </span>
            )}
          </h2>
          <h2 className="font-normal text-sm">Código da vaga: {vacancy.id}</h2>
        </div>
        <div className="flex flex-row gap-1">
          <p className="line-clamp-1 text-lg">{vacancy.company.name}</p>
        </div>
        <div className="line-clamp-4">
          Descrição:
          <div>{vacancy.description.replace(/<[^>]*>?/gm, " ")}</div>
        </div>
        <p>
          Local: {vacancy.city.name} - {vacancy.state}
        </p>
        {vacancy.salary ? (
          <p>Salário: R$ {vacancy.salary},00</p>
        ) : (
          <p>Salário a combinar</p>
        )}
        <div className="card-actions flex flex-row items-center justify-between">
          <ul>
            {vacancy.keywords.split(",").map((keyword, index) => (
              <li
                key={index}
                className="inline-block group-hover:bg-white bg-base-200 rounded-full px-3 py-1 text-sm font-semibold mr-2"
              >
                {keyword}
              </li>
            ))}
          </ul>
          <Link
            className="w-full btn btn-sm btn-info md:btn-md"
            href={`vacancy/${vacancy.id}`}
          >
            Ver mais detalhes
          </Link>
        </div>
      </div>
    </>
  );
}
