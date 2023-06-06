import { Building2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Vacancy } from "../../../utils/types/vacancies/vacancy";

interface CardVacancyProps {
  vacancy: Vacancy;
}

export default function CardVacancy({ vacancy }: CardVacancyProps) {
  return (
    <div className="card shadow-sm shadow-primary">
      <div className="card-body">
        <div className="card-title">
          <h2 className="text-primary font-bold">{vacancy.title}</h2>
        </div>
        <div className="flex flex-row gap-1">
          <span>
            <Building2 />
          </span>
          <p className="line-clamp-1 text-lg">{vacancy.company.name}</p>
        </div>
        <p className="line-clamp-3">Descrição: {vacancy.description}</p>
        <p>Salário: R$ {vacancy.salary},00</p>
        <div className="card-actions flex flex-row items-center justify-between">
          <ul>
            {vacancy.keyWords.split(",").map((keyWord, index) => (
              <li
                key={index}
                className="inline-block bg-base-200 rounded-full px-3 py-1 text-sm font-semibold mr-2"
              >
                {keyWord}
              </li>
            ))}
          </ul>
          <button className="btn btn-sm btn-info md:btn-md">
            <Link href={`vacancy/${vacancy.id}`} target="_blank">
              Ver mais detalhes
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}
