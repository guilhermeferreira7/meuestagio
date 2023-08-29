import Link from "next/link";
import React, { useState } from "react";
import { Vacancy } from "../../../utils/types/vacancy";
import AppCard from "../../../components/AppCard";
import { Banknote, Briefcase, DollarSign, MapPin } from "lucide-react";

interface CardVacancyProps {
  vacancy: Vacancy;
}

export default function CardVacancy({ vacancy }: CardVacancyProps) {
  return (
    <>
      <AppCard>
        <h2 className="flex justify-between items-center">
          <span className="text-primary font-bold text-2xl">
            {vacancy.title}
          </span>
          <span className="font-normal text-sm">
            Código da vaga: {vacancy.id}
          </span>
        </h2>
        <p className="text-sm">
          {vacancy.remote ? "(Remoto)" : "(Presencial)"}
        </p>
        <p className="text-sm">{vacancy.area.title}</p>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-1">
            <div className="line-clamp-1 text-lg flex gap-1 items-center">
              <Briefcase /> {vacancy.company.name}
            </div>
          </div>
          <div className="flex gap-1 items-center">
            <MapPin /> {vacancy.city.name} - {vacancy.state}
          </div>
          <div className="flex gap-1 items-center">
            <DollarSign />{" "}
            {vacancy.salary
              ? `R$ ${vacancy.salary},00`
              : "Salário não informado"}
          </div>
          <div className="line-clamp-4">
            <div>{vacancy.description.replace(/<[^>]*>?/gm, " ")}</div>
          </div>
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
          </div>
          <Link
            className="w-full btn btn-sm btn-info md:btn-md"
            href={`vacancy/${vacancy.id}`}
          >
            Ver mais detalhes
          </Link>
        </div>
      </AppCard>
    </>
  );
}
