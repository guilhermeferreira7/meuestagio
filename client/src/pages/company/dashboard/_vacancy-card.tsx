import React from "react";
import { Vacancy } from "../../../utils/types/vacancy";
import { ArrowDown, ChevronDown } from "lucide-react";

interface VacancyCompanyCardProps {
  vacancy: any;
}

export default function VacancyCompanyCard({
  vacancy,
}: VacancyCompanyCardProps) {
  return (
    <>
      <div className="w-full flex flex-col items-center justify-center hover:bg-base-200 mb-2 p-2 text-xl border rounded-md border-primary">
        <span>
          {vacancy.title} - {vacancy.remote ? "Remoto" : "Presencial"} - Código:{" "}
          {vacancy.id}
        </span>
        <div className="flex items-center">
          <div tabIndex={0} className="collapse w-full">
            <div className="collapse-title text-center text-primary underline">
              Ver detalhes
            </div>
            <div className="collapse-content">
              <div className="flex flex-col items-center gap-1">
                <p>
                  Local: {vacancy.city.name} - {vacancy.state}
                </p>
                <p>Palavras chave: {vacancy.keywords}</p>
                <div>
                  <button className="btn btn-primary">
                    Ver Candidatos {`(10)`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
