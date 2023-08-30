import React from "react";
import { Vacancy } from "../../../utils/types/vacancy";
import { ArrowDown, ChevronDown } from "lucide-react";
import Link from "next/link";
import AppCard from "../../../components/AppCard";

interface VacancyCompanyCardProps {
  vacancy: any;
}

export default function VacancyCompanyCard({
  vacancy,
}: VacancyCompanyCardProps) {
  return (
    <>
      <AppCard>
        <h2 className="flex justify-between text-2xl">
          {vacancy.title} - {vacancy.remote ? "Remoto" : "Presencial"} - Código:{" "}
          {vacancy.id}
        </h2>
        <div className="flex flex-col md:flex-row gap-1 justify-between">
          <div className="flex flex-col items-start text-xl">
            <p>
              Local: {vacancy.city.name} - {vacancy.state}
            </p>
            <p>Palavras chave: {vacancy.keywords}</p>
          </div>
          <Link
            href={`vacancy/applications/${vacancy.id}`}
            className="btn btn-primary"
          >
            Ver Candidatos
          </Link>
        </div>
      </AppCard>
    </>
  );
}
